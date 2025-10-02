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
import type {
  NormalizedLayer,
  BuilderConfig,
  NormalizedStyle,
} from '../../utils/diff';
import { diffLayers } from '../../utils/diff';
import { log } from '../../utils/logger';
import MSG from '../../utils/messages';

const MSG_COMPONENT: string = 'v-map-builder - ';

type LayerType = 'osm' | 'wms' | 'wms-tiled' | 'geojson' | 'xyz' | 'custom';

/**
 * A component that builds map configurations dynamically from JSON/YAML configuration scripts.
 *
 * @part mount - The container element where the generated map and layers are mounted.
 */
@Component({
  tag: 'v-map-builder',
  shadow: true,
  styleUrl: 'v-map-builder.css',
})
export class VMapBuilder {
  @Element() hostEl!: HTMLElement;

  /**
   * Configuration object for the map builder. Can be any structure that will be normalized to BuilderConfig.
   */
  @Prop({ mutable: true }) mapconfig?: unknown;

  /**
   * Event emitted when the map configuration has been successfully parsed and is ready to use.
   */
  @Event({ eventName: 'configReady' })
  configReady!: EventEmitter<BuilderConfig>;

  /**
   * Event emitted when there is an error parsing the map configuration.
   */
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
        styles: this.normalizeStyles(map.styles),
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

  private normalizeStyles(input: any): NormalizedStyle[] {
    const list = Array.isArray(input) ? input : input ? [input] : [];
    return list
      .map((entry, index) => this.normalizeStyle(entry, index))
      .filter((style): style is NormalizedStyle => Boolean(style));
  }

  private normalizeStyle(entry: any, index: number): NormalizedStyle | undefined {
    if (entry == null) return undefined;

    const raw = typeof entry === 'object' ? entry : { content: entry };
    const keySource = raw.key ?? raw.id ?? raw.name;
    const key = String(
      keySource != null ? keySource : `style-${index + 1}`,
    );

    const format = String(raw.format ?? 'sld').toLowerCase();

    let layerTargets: string | undefined;
    if (Array.isArray(raw.layerTargets)) {
      layerTargets = raw.layerTargets
        .map((target: any) => String(target).trim())
        .filter(Boolean)
        .join(',');
    } else if (typeof raw.layerTargets === 'string') {
      layerTargets = raw.layerTargets;
    }

    const autoApply =
      raw.autoApply == null
        ? undefined
        : typeof raw.autoApply === 'boolean'
          ? raw.autoApply
          : String(raw.autoApply).toLowerCase() !== 'false';

    let src: string | undefined =
      raw.src != null ? String(raw.src).trim() : undefined;
    if (src === '') src = undefined;
    let content: string | undefined =
      raw.content != null ? String(raw.content) : undefined;

    if (!src && !content && typeof raw.source === 'string') {
      const source = raw.source.trim();
      if (source) {
        if (/^(https?:)?\/\//.test(source) || source.startsWith('/') || source.startsWith('./') || source.startsWith('../')) {
          src = source;
        } else {
          content = source;
        }
      }
    }

    if (!src && !content) {
      if (typeof entry === 'string') {
        content = String(entry);
      } else {
        log(
          `${MSG_COMPONENT}normalizeStyle: skipping style without src/content (key=${key})`,
        );
        return undefined;
      }
    }

    return {
      key,
      format,
      src,
      content,
      layerTargets,
      autoApply,
      id: raw.id != null ? String(raw.id) : undefined,
    };
  }

  private syncStyles(mapEl: HTMLElement, styles: NormalizedStyle[]) {
    const selector = 'v-map-style[data-builder-style="true"]';
    const existing = Array.from(
      mapEl.querySelectorAll(selector),
    ) as HTMLElement[];

    const existingByKey = new Map<string, HTMLElement>();
    for (const el of existing) {
      const key = el.getAttribute('data-builder-style-id');
      if (key) existingByKey.set(key, el);
    }

    const processed = new Set<string>();
    const anchor = Array.from(mapEl.children).find(child => {
      if (child.tagName.toLowerCase() !== 'v-map-style') return true;
      return (
        (child as HTMLElement).getAttribute('data-builder-style') !== 'true'
      );
    }) as HTMLElement | undefined;

    styles.forEach((style, index) => {
      const key = style.key || `style-${index + 1}`;
      let el = existingByKey.get(key);
      if (!el || el.parentElement !== mapEl) {
        el = document.createElement('v-map-style') as HTMLElement;
        el.setAttribute('data-builder-style', 'true');
        el.setAttribute('data-builder-style-id', key);
      } else {
        el.setAttribute('data-builder-style', 'true');
        el.setAttribute('data-builder-style-id', key);
      }

      processed.add(key);

      this.ensureAttr(el, 'format', style.format);
      this.ensureAttr(el, 'layer-targets', style.layerTargets);
      this.ensureAttr(el, 'auto-apply', style.autoApply);
      this.ensureAttr(el, 'id', style.id);
      this.ensureAttr(el, 'src', style.src);
      this.ensureAttr(el, 'content', style.content);

      const reference = anchor && anchor.parentElement === mapEl ? anchor : null;
      if (!el.isConnected || el.parentElement !== mapEl) {
        mapEl.insertBefore(el, reference);
      } else if (reference) {
        mapEl.insertBefore(el, reference);
      }
    });

    for (const el of existing) {
      const key = el.getAttribute('data-builder-style-id') || '';
      if (!processed.has(key)) {
        mapEl.removeChild(el);
      }
    }
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
      case 'terrain': {
        el = document.createElement('v-map-layer-terrain') as HTMLElement;
        const cfg = (layer.data || {}) as Record<string, any>;
        common['elevation-data'] = cfg.elevationData;
        common['texture'] = cfg.texture;
        common['elevation-decoder'] = cfg.elevationDecoder
          ? JSON.stringify(cfg.elevationDecoder)
          : undefined;
        common['wireframe'] = cfg.wireframe;
        common['color'] = cfg.color
          ? Array.isArray(cfg.color)
            ? JSON.stringify(cfg.color)
            : cfg.color
          : undefined;
        common['min-zoom'] = cfg.minZoom;
        common['max-zoom'] = cfg.maxZoom;
        common['mesh-max-error'] = cfg.meshMaxError;
        break;
      }
      case 'wfs': {
        el = document.createElement('v-map-layer-wfs') as HTMLElement;
        const cfg = (layer.data || {}) as Record<string, any>;
        common['url'] = cfg.url ?? layer.url;
        common['type-name'] = cfg.typeName;
        common['version'] = cfg.version;
        common['output-format'] = cfg.outputFormat;
        common['srs-name'] = cfg.srsName;
        common['params'] = cfg.params ? JSON.stringify(cfg.params) : undefined;
        break;
      }
      case 'wcs': {
        el = document.createElement('v-map-layer-wcs') as HTMLElement;
        const cfg = (layer.data || {}) as Record<string, any>;
        common['url'] = cfg.url ?? layer.url;
        common['coverage-name'] = cfg.coverageName;
        common['format'] = cfg.format;
        common['version'] = cfg.version;
        common['projection'] = cfg.projection;
        common['resolutions'] = cfg.resolutions
          ? JSON.stringify(cfg.resolutions)
          : undefined;
        common['params'] = cfg.params ? JSON.stringify(cfg.params) : undefined;
        break;
      }
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
        if (['terrain', 'wfs', 'wcs'].includes(next.type)) {
          const parent = el.parentElement!;
          const newEl = this.createLayerEl(next);
          parent.replaceChild(newEl, el);
          return;
        }
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
    this.syncStyles(mapEl, next.map.styles || []);

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
