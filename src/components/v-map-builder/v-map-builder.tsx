import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  //Listen,
  Prop,
  Watch,
} from '@stencil/core';
import { load as loadYaml } from 'js-yaml';
import type { NormalizedLayer, BuilderConfig } from '../../utils/diff';
import { diffLayers } from '../../utils/diff';
import { log } from '../../utils/logger';
import MSG from '../../utils/messages';

const MSG_COMPONENT: string = 'v-map-builder - ';

type LayerType = 'osm' | 'wms' | 'wms-tiled' | 'geojson' | 'xyz' | 'custom';

@Component({
  tag: 'v-map-builder',
  shadow: true,
  styleUrl: 'v-map-builder.css',
})
export class VMapBuilder {
  @Element() hostEl!: HTMLElement;

  @Prop({ mutable: true }) mapconfig?: unknown;

  @Event({ eventName: 'configReady' })
  configReady!: EventEmitter<BuilderConfig>;
  @Event({ eventName: 'configError' }) configError!: EventEmitter<{
    message: string;
    errors?: string[];
  }>;

  private mount?: HTMLElement;
  private current?: BuilderConfig;

  private refMount = (el?: HTMLElement) => (this.mount = el || undefined);

  //componentWillLoad() {
  async componentDidLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);
    this.parseFromSlot();
  }

  @Watch('mapconfig')
  async onMapConfigChanged(_oldValue: string, _newValue: string) {
    log(MSG_COMPONENT + 'onMapConfigChanged');
    this.parseFromSlot();
  }

  private parseFromSlot() {
    log(MSG_COMPONENT + 'parseFromSlot');
    try {
      const script = this.hostEl.querySelector<HTMLScriptElement>(
        'script[type*="json"], script[type*="yaml"], script[type*="yml"]',
      );
      if (!script) throw new Error('No configuration <script> found.');
      const mime = (script.type || '').toLowerCase();
      const text = script.textContent ?? '';
      const raw = mime.includes('json') ? JSON.parse(text) : loadYaml(text);
      const cfg = this.normalize(raw);
      this.applyDiff(this.current, cfg);
      this.current = cfg;
      log(MSG_COMPONENT + 'emit configReady');
      this.configReady.emit(cfg);
    } catch (e: any) {
      this.configError.emit({
        message: e?.message || 'Unknown error',
        errors: e?.errors,
      });
    }
  }

  private normalize(raw: any): BuilderConfig {
    const map = raw?.map ?? raw ?? {};
    const norm: BuilderConfig = {
      map: {
        flavour: String(map.flavour ?? 'ol'),
        zoom: Number(map.zoom ?? 2),
        center: String(map.center ?? '0,0'),
        style: String(map.style ?? ''),
        layerGroups: (map.layerGroups ?? []).map((g: any, gi: number) => ({
          groupTitle: g.groupTitle ?? g.group ?? g.title ?? `Gruppe ${gi + 1}`,
          visible: g.visible,
          layers: (g.layers ?? []).map((l: any, li: number) => {
            const type: LayerType = (l.type ??
              l.layerType ??
              'custom') as LayerType;
            const base: any = {
              id: String(l.id ?? `${gi + 1}-${li + 1}`),
              type,
              visible: l.visible,
              opacity: l.opacity,
              zIndex: l.zIndex,
              style: l.style,
            };
            if (type === 'wms' || type === 'wms-tiled') {
              const isTiled =
                type === 'wms-tiled' || l.tiled === true || l.tiled === 'true';
              return {
                ...base,
                url: String(l.url ?? ''),
                layers: String(l.layers ?? l.sublayers ?? ''),
                tiled: String(isTiled),
              } as NormalizedLayer;
            }
            if (type === 'xyz')
              return { ...base, url: String(l.url ?? '') } as NormalizedLayer;
            if (type === 'geojson')
              return { ...base, url: l.url, data: l.data } as NormalizedLayer;
            return base as NormalizedLayer;
          }),
        })),
      },
    };
    return norm;
  }

  private ensureAttr(el: Element, name: string, value?: any) {
    const v = value == null ? undefined : String(value);
    const cur = el.getAttribute(name);
    if (v == null) {
      if (cur != null) el.removeAttribute(name);
      return;
    }
    if (cur !== v) el.setAttribute(name, v);
  }

  private ensureGroup(
    mapEl: Element,
    title: string,
    visible?: any,
    index?: number,
  ): HTMLElement {
    let el = Array.from(mapEl.children).find(
      ch =>
        ch.tagName.toLowerCase() === 'v-map-layergroup' &&
        (ch as Element).getAttribute('group-title') === title,
    ) as HTMLElement | undefined;
    if (!el) {
      el = document.createElement('v-map-layergroup') as HTMLElement;
      el.setAttribute('group-title', title);
      mapEl.insertBefore(
        el,
        (index != null ? mapEl.children[index] : null) || null,
      );
    }
    this.ensureAttr(el, 'visible', visible);
    return el;
  }

  private createLayerEl(layer: NormalizedLayer): HTMLElement {
    const common: Record<string, any> = {
      'id': layer.id,
      'visible': layer.visible,
      'opacity': layer.opacity,
      'z-index': layer.zIndex,
      ...(layer.style ? { style: JSON.stringify(layer.style) } : {}),
    };
    let el: HTMLElement;
    switch (layer.type) {
      case 'osm':
        el = document.createElement('v-map-layer-osm') as HTMLElement;
        break;
      case 'wms':
      case 'wms-tiled':
        el = document.createElement('v-map-layer-wms') as HTMLElement;
        common.url = layer.url;
        common.layers = layer.layers;
        common.tiled = layer.tiled;
        break;
      case 'geojson':
        el = document.createElement('v-map-layer-geojson') as HTMLElement;
        common.url = layer.url;
        common.data =
          typeof layer.data === 'object'
            ? JSON.stringify(layer.data)
            : (layer.data as any);
        break;
      case 'xyz':
        el = document.createElement('v-map-layer-xyz') as HTMLElement;
        common.url = layer.url;
        break;
      default:
        el = document.createElement('v-map-layer-custom') as HTMLElement;
        el.setAttribute('type', layer.type);
    }
    for (const [k, v] of Object.entries(common)) this.ensureAttr(el, k, v);
    return el;
  }

  private patchLayer(
    el: Element,
    patch: Record<string, { old: any; new: any }>,
    next: NormalizedLayer,
  ) {
    for (const [field, change] of Object.entries(patch)) {
      const nv = (change as any).new;
      switch (field) {
        case 'visible':
          this.ensureAttr(el, 'visible', nv);
          break;
        case 'opacity':
          this.ensureAttr(el, 'opacity', nv);
          break;
        case 'zIndex':
          this.ensureAttr(el, 'z-index', nv);
          break;
        case 'url':
          this.ensureAttr(el, 'url', nv);
          break;
        case 'layers':
          this.ensureAttr(el, 'layers', nv);
          break;
        case 'tiled':
          this.ensureAttr(el, 'tiled', nv);
          break;
        case 'style':
          this.ensureAttr(el, 'style', nv ? JSON.stringify(nv) : undefined);
          break;
        case 'data':
          (el as any).setData?.(nv);
          if (!(el as any).setData) {
            const s = typeof nv === 'object' ? JSON.stringify(nv) : nv;
            this.ensureAttr(el, 'data', s);
          }
          break;
        case 'type':
          const parent = el.parentElement!;
          const newEl = this.createLayerEl(next);
          parent.replaceChild(newEl, el);
          return;
      }
    }
  }

  private applyDiff(_prev: BuilderConfig | undefined, next: BuilderConfig) {
    if (!this.mount) return;
    let mapEl = this.mount.querySelector('v-map') as HTMLElement | null;
    if (!mapEl) {
      mapEl = document.createElement('v-map');
      this.mount.appendChild(mapEl);
    }
    this.ensureAttr(mapEl, 'flavour', next.map.flavour);
    this.ensureAttr(mapEl, 'zoom', String(next.map.zoom));
    this.ensureAttr(mapEl, 'center', next.map.center);
    this.ensureAttr(mapEl, 'style', next.map.style);

    const nextTitles = new Set(next.map.layerGroups.map(g => g.groupTitle));
    Array.from(mapEl.children).forEach(ch => {
      if (ch.tagName.toLowerCase() !== 'v-map-layergroup') return;
      const t = (ch as Element).getAttribute('group-title') || '';
      if (!nextTitles.has(t)) mapEl!.removeChild(ch);
    });

    next.map.layerGroups.forEach((group, gi) => {
      const groupEl = this.ensureGroup(
        mapEl!,
        group.groupTitle,
        group.visible,
        gi,
      );

      const oldLayers: NormalizedLayer[] = [];
      Array.from(groupEl.children).forEach(ch => {
        const id = (ch as Element).getAttribute('id') || '';
        const type = (ch as Element).tagName
          .toLowerCase()
          .replace('v-map-layer-', '') as LayerType;
        oldLayers.push({ id, type } as NormalizedLayer);
      });

      const { removed, updated, moved } = diffLayers(
        oldLayers,
        group.layers as NormalizedLayer[],
      );

      for (const r of removed) {
        const el = Array.from(groupEl.children).find(
          ch => (ch as Element).getAttribute('id') === r.id,
        );
        if (el) groupEl.removeChild(el);
      }

      for (const m of moved) {
        const el = Array.from(groupEl.children).find(
          ch => (ch as Element).getAttribute('id') === m.id,
        );
        if (el) groupEl.insertBefore(el, groupEl.children[m.to] || null);
      }

      for (const u of updated) {
        const el = Array.from(groupEl.children).find(
          ch => (ch as Element).getAttribute('id') === u.id,
        );
        if (!el) continue;
        const nextLayer = group.layers.find(l => l.id === u.id)!;
        this.patchLayer(el as Element, u.changes as any, nextLayer);
      }

      group.layers.forEach((l, idx) => {
        const exists = Array.from(groupEl.children).some(
          ch => (ch as Element).getAttribute('id') === l.id,
        );
        if (!exists) {
          const el = this.createLayerEl(l);
          groupEl.insertBefore(el, groupEl.children[idx] || null);
        }
      });
    });
  }

  private onSlotChange = () => {
    log(MSG_COMPONENT + 'onSlotChange');
    this.parseFromSlot();
    //this.observeAssignedNodes();
    //this.readGeoJsonFromSlot();
  };

  render() {
    log(MSG_COMPONENT + MSG.COMPONENT_RENDER);

    return (
      <div class="root">
        <slot name="mapconfig" onSlotchange={this.onSlotChange}></slot>
        <div part="mount" ref={this.refMount}></div>
      </div>
    );
  }
}
