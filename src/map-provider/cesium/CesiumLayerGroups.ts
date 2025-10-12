// CesiumLayerGroups.ts
import type { Color } from 'cesium';

import { ILayer } from './i-layer';

export interface I3DTilesLayer extends ILayer {
  setColor(color: string | Color, opacity?: number): void;
  setStyle(style: any): void;
}

export type AnyLayer = ILayer | I3DTilesLayer;

interface CesiumLayerRef {
  /** interne Layer-ID (dein layerId) */
  id: string;
  /** optionale Basemap-Key (z. B. "osm", "satellite") */
  elementId?: string | null;
  /** Wrapper aus LayerManager */
  layer: AnyLayer;
}

/**
 * Eine Gruppe verwaltet Sichtbarkeit & Basemap-Filter ihrer Cesium-Layer.
 * - group.visible = false  => Alle Layer der Gruppe unsichtbar.
 * - group.basemap = "X"    => Nur Layer mit elementId==="X" in der Gruppe sichtbar.
 * - Der ursprüngliche Sichtbarkeitszustand jedes Layers wird gemerkt und bei
 *   Re-Aktivierung wiederhergestellt.
 */
export class CesiumLayerGroup {
  readonly id: string;

  private _visible = true;
  private _basemap: string | null = null;
  private _layers = new Map<string, CesiumLayerRef>();
  private _originalVisible = new Map<string, boolean>();
  private _dirty = true;

  constructor(id: string, visible = true) {
    this.id = id;
    this._visible = visible;
  }

  get visible() {
    return this._visible;
  }
  set visible(v: boolean) {
    if (this._visible === v) return;
    this._visible = v;
    this._dirty = true;
  }

  get basemap(): string | null {
    return this._basemap;
  }
  set basemap(b: string | null) {
    if (this._basemap === b) return;
    this._basemap = b;
    this._dirty = true;
  }

  isDirty(): boolean {
    return this._dirty;
  }

  addLayer(ref: CesiumLayerRef): void {
    if (this._layers.has(ref.id)) return;
    this._layers.set(ref.id, ref);
    this._originalVisible.set(ref.id, ref.layer.getVisible());
    this._dirty = true;
  }

  /** optional zum Nachziehen von elementId (z. B. wenn erst später bekannt) */
  setLayerElementId(layerId: string, elementId?: string | null) {
    const r = this._layers.get(layerId);
    if (!r) return;
    if (r.elementId === elementId) return;
    r.elementId = elementId ?? null;
    this._dirty = true;
  }

  removeLayer(layerId: string): boolean {
    const had = this._layers.delete(layerId);
    this._originalVisible.delete(layerId);
    if (had) this._dirty = true;
    return had;
  }

  clear(): void {
    this._layers.clear();
    this._originalVisible.clear();
    this._dirty = true;
  }

  /** zentrale Logik: Basemap/Visibility anwenden */
  apply(): void {
    if (!this._dirty) return;

    for (const [id, ref] of this._layers) {
      const original = this._originalVisible.get(id) ?? true;

      // effektive Sichtbarkeit nach Gruppenregeln
      let effective = this._visible && original;
      if (effective && this._basemap) {
        // innerhalb der Gruppe nur Layer mit passender elementId anzeigen
        effective = ref.elementId === this._basemap;
      }

      // Nur dann setzen, wenn sich etwas ändert
      if (ref.layer.getVisible() !== effective) {
        ref.layer.setVisible(effective);
      }
    }

    this._dirty = false;
  }
}

/**
 * Root-Store für mehrere Cesium-Gruppen.
 * - Ordnung/Z-Index übernimmst du weiterhin im LayerManager pro Layer.
 * - Diese Klasse kümmert sich um Gruppensichtbarkeit & Basemap-Filter.
 */
export class CesiumLayerGroups {
  private _groups: CesiumLayerGroup[] = [];
  private _dirty = true;

  get groups(): readonly CesiumLayerGroup[] {
    return [...this._groups];
  }
  getGroup(id: string): CesiumLayerGroup | undefined {
    return this._groups.find(g => g.id === id);
  }
  hasGroup(id: string): boolean {
    return this._groups.some(g => g.id === id);
  }

  ensureGroup(id: string, visible = true): CesiumLayerGroup {
    let g = this.getGroup(id);
    if (g) return g;
    g = new CesiumLayerGroup(id, visible);
    this._groups.push(g);
    this._dirty = true;
    return g;
  }

  addLayerToGroup(
    groupId: string,
    visible: boolean,
    ref: CesiumLayerRef,
  ): void {
    const g = this.ensureGroup(groupId, visible);
    g.addLayer(ref);
    this._dirty = true;
  }

  removeLayer(layerId: string, removeFromAll = true): boolean {
    let removed = false;
    for (const g of this._groups) {
      if (g.removeLayer(layerId)) {
        removed = true;
        if (!removeFromAll) break;
      }
    }
    if (removed) this._dirty = true;
    return removed;
  }

  setGroupVisible(groupId: string, visible: boolean): void {
    const g = this.getGroup(groupId);
    if (!g) throw new Error(`CesiumLayerGroup "${groupId}" nicht gefunden`);
    g.visible = visible;
    this._dirty = true;
  }

  setBasemap(groupId: string, basemap: string | null): void {
    const g = this.getGroup(groupId);
    if (!g) throw new Error(`CesiumLayerGroup "${groupId}" nicht gefunden`);
    g.basemap = basemap;
    this._dirty = true;
  }

  /** Wendet alle Gruppenregeln an (sichtbar/basemap). */
  apply(): void {
    if (!this._dirty && !this._groups.some(g => g.isDirty())) return;
    for (const g of this._groups) g.apply();
    this._dirty = false;
  }

  clear(): void {
    this._groups = [];
    this._dirty = true;
  }
}
