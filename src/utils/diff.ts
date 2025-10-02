export type LayerType =
  | 'osm'
  | 'wms'
  | 'wms-tiled'
  | 'geojson'
  | 'xyz'
  | 'terrain'
  | 'wfs'
  | 'wcs'
  | 'custom';

// interface BaseLayer {
//   id: string;
//   type: LayerType;
//   visible?: boolean | string;
//   opacity?: number | string;
//   zIndex?: number | string;
//   style?: Record<string, any>;
//   url?: string;
//   layers?: string;
//   tiled?: string;
//   data?: unknown;
// }
export interface LayerGroup {
  groupTitle: string;
  visible?: boolean | string;
  layers: NormalizedLayer[];
}
export interface NormalizedStyle {
  /** internal identifier to keep track between updates */
  key: string;
  format: string;
  src?: string;
  content?: string;
  layerTargets?: string;
  autoApply?: boolean | string;
  id?: string;
}

export interface MapConfig {
  flavour: string;
  zoom: number;
  center: string;
  style: string;
  styles: NormalizedStyle[];
  layerGroups: LayerGroup[];
}
export interface BuilderConfig {
  map: MapConfig;
}

export interface NormalizedLayer {
  id: string;
  type: LayerType;
  visible?: boolean | string;
  opacity?: number | string;
  zIndex?: number | string;
  url?: string;
  layers?: string;
  tiled?: string;
  data?: unknown;
  style?: Record<string, unknown>;
  [key: string]: any;
}

export type LayerPatch = {
  id: string;
  changes: Partial<
    Record<
      | 'type'
      | 'visible'
      | 'opacity'
      | 'zIndex'
      | 'url'
      | 'layers'
      | 'tiled'
      | 'style'
      | 'data',
      { old: any; new: any }
    >
  >;
};

export type LayersDiff = {
  added: NormalizedLayer[];
  removed: NormalizedLayer[];
  updated: LayerPatch[];
  moved: Array<{ id: string; from: number; to: number }>;
  unchangedIds: string[];
};

const EPS = 1e-9;

function toBoolString(v: any): string | undefined {
  if (v == null) return undefined;
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  const s = String(v).toLowerCase();
  if (s === 'true' || s === '1') return 'true';
  if (s === 'false' || s === '0') return 'false';
  return s;
}

function toNumOrUndef(v: any): number | undefined {
  if (v == null) return undefined;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/** stable JSON for objects (key-sorted) */
function stableStringify(obj: any): string | undefined {
  if (obj == null) return undefined;
  if (typeof obj !== 'object') return JSON.stringify(obj);
  const keys = Object.keys(obj).sort();
  const acc: Record<string, any> = {};
  for (const k of keys) acc[k] = (obj as any)[k];
  return JSON.stringify(acc);
}

function eqNum(a?: number, b?: number): boolean {
  if (a == null && b == null) return true;
  if (a == null || b == null) return false;
  return Math.abs(a - b) <= EPS;
}

function eqStr(a?: string, b?: string): boolean {
  return (a ?? undefined) === (b ?? undefined);
}

/** Compare fields relevant for rendering; returns patch (only changed fields) */
export function diffRelevantFields(
  a: NormalizedLayer,
  b: NormalizedLayer,
): LayerPatch['changes'] {
  const changes: LayerPatch['changes'] = {};

  if (a.type !== b.type) changes.type = { old: a.type, new: b.type };

  const aVisible = toBoolString(a.visible);
  const bVisible = toBoolString(b.visible);
  if (!eqStr(aVisible, bVisible))
    changes.visible = { old: aVisible, new: bVisible };

  const aOpacity = toNumOrUndef(a.opacity);
  const bOpacity = toNumOrUndef(b.opacity);
  if (!eqNum(aOpacity, bOpacity))
    changes.opacity = { old: aOpacity, new: bOpacity };

  const aZ = toNumOrUndef(a.zIndex);
  const bZ = toNumOrUndef(b.zIndex);
  if (!eqNum(aZ, bZ)) changes.zIndex = { old: aZ, new: bZ };

  if (!eqStr(a.url, b.url)) changes.url = { old: a.url, new: b.url };
  if (!eqStr(a.layers, b.layers))
    changes.layers = { old: a.layers, new: b.layers };

  const aTiled = toBoolString(a.tiled);
  const bTiled = toBoolString(b.tiled);
  if (!eqStr(aTiled, bTiled)) changes.tiled = { old: aTiled, new: bTiled };

  const aStyle = stableStringify(a.style);
  const bStyle = stableStringify(b.style);
  if (!eqStr(aStyle, bStyle)) changes.style = { old: a.style, new: b.style };

  const aData = stableStringify(a.data);
  const bData = stableStringify(b.data);
  if (!eqStr(aData, bData)) changes.data = { old: a.data, new: b.data };

  return changes;
}

/** Longest Common Subsequence for stable move detection (by IDs) */
function lcs(a: string[], b: string[]): string[] {
  const m = a.length,
    n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const seq: string[] = [];
  let i = 0,
    j = 0;
  while (i < m && j < n) {
    if (a[i] === b[j]) {
      seq.push(a[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return seq;
}

/** Computes added/removed/updated/moved/unchanged */
export function diffLayers(
  oldLayers: NormalizedLayer[],
  newLayers: NormalizedLayer[],
): LayersDiff {
  const oldById = new Map(oldLayers.map(l => [l.id, l]));
  const newById = new Map(newLayers.map(l => [l.id, l]));

  const added: NormalizedLayer[] = [];
  const removed: NormalizedLayer[] = [];
  const updated: LayerPatch[] = [];
  const unchangedIds: string[] = [];

  for (const newL of newLayers) {
    const oldL = oldById.get(newL.id);
    if (!oldL) {
      added.push(newL);
      continue;
    }
    const changes = diffRelevantFields(oldL, newL);
    if (Object.keys(changes).length) updated.push({ id: newL.id, changes });
    else unchangedIds.push(newL.id);
  }

  for (const oldL of oldLayers) {
    if (!newById.has(oldL.id)) removed.push(oldL);
  }

  const oldIds = oldLayers.filter(l => newById.has(l.id)).map(l => l.id);
  const newIds = newLayers.filter(l => oldById.has(l.id)).map(l => l.id);

  const seq = lcs(oldIds, newIds);
  const keep = new Set(seq);
  const moved: Array<{ id: string; from: number; to: number }> = [];

  for (const id of newIds) {
    if (!keep.has(id) && !added.find(a => a.id === id)) {
      const from = oldIds.indexOf(id);
      const to = newIds.indexOf(id);
      if (from !== -1 && to !== -1) moved.push({ id, from, to });
    }
  }

  return { added, removed, updated, moved, unchangedIds };
}
