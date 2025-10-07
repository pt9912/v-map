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
  LayerType,
} from '../../utils/diff';
import { diffLayers } from '../../utils/diff';
import { log } from '../../utils/logger';
import MSG from '../../utils/messages';

const MSG_COMPONENT: string = 'v-map-builder - ';

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

  private normalizeLayerType(rawType: any): LayerType {
    const type = String(rawType ?? '').toLowerCase();
    switch (type) {
      case 'osm':
      case 'wms':
      case 'wms-tiled':
      case 'geojson':
      case 'xyz':
      case 'terrain':
      case 'wfs':
      case 'wcs':
      case 'google':
      case 'geotiff':
      case 'tile3d':
      case 'scatterplot':
      case 'wkt':
        return type as LayerType;
      default:
        return 'custom';
    }
  }

  private toOptionalString(value: any): string | undefined {
    if (value === undefined || value === null) return undefined;
    return typeof value === 'string' ? value : String(value);
  }

  private toOptionalNumber(value: any): number | undefined {
    if (value === undefined || value === null || value === '') return undefined;
    const num = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(num) ? num : undefined;
  }

  private toOptionalBoolean(value: any): boolean | undefined {
    if (value === undefined || value === null || value === '') return undefined;
    if (typeof value === 'boolean') return value;
    const normalized = String(value).trim().toLowerCase();
    if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
    if (['false', '0', 'no', 'n'].includes(normalized)) return false;
    return undefined;
  }

  private toCsv(value: any): string | undefined {
    if (value === undefined || value === null) return undefined;
    if (Array.isArray(value)) {
      return value
        .map(entry => this.toOptionalString(entry))
        .filter((entry): entry is string => entry != null && entry !== '')
        .join(',');
    }
    return this.toOptionalString(value);
  }

  private cleanRecord(
    record?: Record<string, any>,
  ): Record<string, any> | undefined {
    if (!record) return undefined;
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(record)) {
      if (value !== undefined && value !== null) {
        result[key] = value;
      }
    }
    return Object.keys(result).length ? result : undefined;
  }

  private normalizeLayer(
    rawLayer: any,
    groupIndex: number,
    layerIndex: number,
  ): NormalizedLayer {
    const type = this.normalizeLayerType(rawLayer?.type ?? rawLayer?.layerType);
    const layerId = String(
      rawLayer?.id ?? `${groupIndex + 1}-${layerIndex + 1}`,
    );
    const base: NormalizedLayer = {
      id: layerId,
      type,
      visible: rawLayer?.visible,
      opacity: rawLayer?.opacity,
      zIndex: rawLayer?.zIndex,
    };
    if (rawLayer?.style != null) {
      base.style = rawLayer.style;
    }

    const data: Record<string, any> = {};
    const setBase = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        (base as any)[key] = value;
      }
    };

    switch (type) {
      case 'wms':
      case 'wms-tiled': {
        const url = this.toOptionalString(rawLayer?.url);
        const layers = this.toOptionalString(
          rawLayer?.layers ?? rawLayer?.sublayers,
        );
        const tiled =
          type === 'wms-tiled'
            ? true
            : this.toOptionalBoolean(rawLayer?.tiled);

        setBase('url', url);
        setBase('layers', layers);
        if (tiled !== undefined) setBase('tiled', tiled);

        const params = rawLayer?.params ?? rawLayer?.extraParams;
        Object.assign(
          data,
          this.cleanRecord({
            styles: rawLayer?.styles,
            format: rawLayer?.format,
            transparent: this.toOptionalBoolean(rawLayer?.transparent),
            tiled,
            version: rawLayer?.version,
            time: rawLayer?.time,
            params,
          }) ?? {},
        );
        break;
      }
      case 'geojson': {
        setBase('url', this.toOptionalString(rawLayer?.url));
        Object.assign(
          data,
          this.cleanRecord({
            geojson: rawLayer?.geojson ?? rawLayer?.data,
            fillColor: rawLayer?.fillColor,
            fillOpacity: this.toOptionalNumber(rawLayer?.fillOpacity),
            strokeColor: rawLayer?.strokeColor,
            strokeWidth: this.toOptionalNumber(rawLayer?.strokeWidth),
            strokeOpacity: this.toOptionalNumber(rawLayer?.strokeOpacity),
            pointRadius: this.toOptionalNumber(rawLayer?.pointRadius),
            pointColor: rawLayer?.pointColor,
            iconUrl: rawLayer?.iconUrl,
            iconSize: rawLayer?.iconSize,
            textProperty: rawLayer?.textProperty,
            textColor: rawLayer?.textColor,
            textSize: this.toOptionalNumber(rawLayer?.textSize),
          }) ?? {},
        );
        break;
      }
      case 'xyz': {
        setBase('url', this.toOptionalString(rawLayer?.url));
        Object.assign(
          data,
          this.cleanRecord({
            attributions: rawLayer?.attributions,
            maxZoom: this.toOptionalNumber(rawLayer?.maxZoom),
            tileSize: this.toOptionalNumber(rawLayer?.tileSize),
            subdomains: this.toCsv(rawLayer?.subdomains),
          }) ?? {},
        );
        break;
      }
      case 'terrain': {
        Object.assign(
          data,
          this.cleanRecord({
            elevationData:
              rawLayer?.elevationData ??
              rawLayer?.url ??
              rawLayer?.data?.elevationData,
            texture: rawLayer?.texture ?? rawLayer?.data?.texture,
            elevationDecoder:
              rawLayer?.elevationDecoder ?? rawLayer?.data?.elevationDecoder,
            wireframe: this.toOptionalBoolean(
              rawLayer?.wireframe ?? rawLayer?.data?.wireframe,
            ),
            color: rawLayer?.color ?? rawLayer?.data?.color,
            minZoom: this.toOptionalNumber(
              rawLayer?.minZoom ?? rawLayer?.data?.minZoom,
            ),
            maxZoom: this.toOptionalNumber(
              rawLayer?.maxZoom ?? rawLayer?.data?.maxZoom,
            ),
            meshMaxError: this.toOptionalNumber(
              rawLayer?.meshMaxError ?? rawLayer?.data?.meshMaxError,
            ),
          }) ?? {},
        );
        break;
      }
      case 'wfs': {
        const url = this.toOptionalString(rawLayer?.url);
        setBase('url', url);
        Object.assign(
          data,
          this.cleanRecord({
            url,
            typeName: rawLayer?.typeName ?? rawLayer?.layerName,
            version: rawLayer?.version,
            outputFormat: rawLayer?.outputFormat ?? rawLayer?.format,
            srsName: rawLayer?.srsName ?? rawLayer?.crs,
            params: rawLayer?.params,
          }) ?? {},
        );
        break;
      }
      case 'wcs': {
        const url = this.toOptionalString(rawLayer?.url);
        setBase('url', url);
        Object.assign(
          data,
          this.cleanRecord({
            url,
            coverageName: rawLayer?.coverageName,
            format: rawLayer?.format,
            version: rawLayer?.version,
            projection: rawLayer?.projection,
            resolutions: rawLayer?.resolutions,
            params: rawLayer?.params,
          }) ?? {},
        );
        break;
      }
      case 'google': {
        Object.assign(
          data,
          this.cleanRecord({
            apiKey: rawLayer?.apiKey ?? rawLayer?.api_key,
            mapType: rawLayer?.mapType,
            language: rawLayer?.language,
            region: rawLayer?.region,
            scale: rawLayer?.scale,
            libraries: this.toCsv(rawLayer?.libraries),
            maxZoom: this.toOptionalNumber(rawLayer?.maxZoom),
            styles: rawLayer?.styles,
          }) ?? {},
        );
        break;
      }
      case 'geotiff': {
        setBase('url', this.toOptionalString(rawLayer?.url));
        break;
      }
      case 'tile3d': {
        setBase('url', this.toOptionalString(rawLayer?.url));
        Object.assign(
          data,
          this.cleanRecord({
            tilesetOptions:
              rawLayer?.tilesetOptions ?? rawLayer?.options ?? rawLayer?.data,
            style: rawLayer?.style ?? rawLayer?.cesiumStyle,
          }) ?? {},
        );
        break;
      }
      case 'scatterplot': {
        Object.assign(
          data,
          this.cleanRecord({
            url: this.toOptionalString(rawLayer?.url),
            data: rawLayer?.data,
            getFillColor: rawLayer?.getFillColor,
            getRadius: this.toOptionalNumber(rawLayer?.getRadius),
          }) ?? {},
        );
        break;
      }
      case 'wkt': {
        Object.assign(
          data,
          this.cleanRecord({
            wkt: rawLayer?.wkt,
            url: this.toOptionalString(rawLayer?.url),
            fillColor: rawLayer?.fillColor,
            fillOpacity: this.toOptionalNumber(rawLayer?.fillOpacity),
            strokeColor: rawLayer?.strokeColor,
            strokeWidth: this.toOptionalNumber(rawLayer?.strokeWidth),
            strokeOpacity: this.toOptionalNumber(rawLayer?.strokeOpacity),
            pointRadius: this.toOptionalNumber(rawLayer?.pointRadius),
            pointColor: rawLayer?.pointColor,
            iconUrl: rawLayer?.iconUrl,
            iconSize: rawLayer?.iconSize,
            textProperty: rawLayer?.textProperty,
            textColor: rawLayer?.textColor,
            textSize: this.toOptionalNumber(rawLayer?.textSize),
          }) ?? {},
        );
        break;
      }
      case 'osm':
        // already handled by base fields
        break;
      default: {
        const payload =
          rawLayer?.data && typeof rawLayer.data === 'object'
            ? rawLayer.data
            : rawLayer;
        if (payload && typeof payload === 'object') {
          Object.assign(data, this.cleanRecord(payload) ?? {});
        }
      }
    }

    base.data = this.cleanRecord(data);
    return base;
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
          groupTitle: g.groupTitle ?? g.group ?? g.title ?? `Group ${gi + 1}`,
          visible: g.visible,
          layers: (g.layers ?? []).map((l: any, li: number) =>
            this.normalizeLayer(l, gi, li),
          ),
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

  private normalizeStyle(
    entry: any,
    index: number,
  ): NormalizedStyle | undefined {
    if (entry == null) return undefined;

    const raw = typeof entry === 'object' ? entry : { content: entry };
    const keySource = raw.key ?? raw.id ?? raw.name;
    const key = String(keySource != null ? keySource : `style-${index + 1}`);

    const format = String(raw.format ?? 'sld').toLowerCase();

    let layerTargets: string | undefined;
    if (Array.isArray(raw.layerTargets)) {
      const targets = raw.layerTargets
        .map((target: any) => String(target).trim())
        .filter(Boolean);
      layerTargets = targets.length ? targets.join(',') : undefined;
    } else if (typeof raw.layerTargets === 'string') {
      const targets = raw.layerTargets
        .split(',')
        .map(target => target.trim())
        .filter(Boolean);
      layerTargets = targets.length ? targets.join(',') : undefined;
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
        if (
          /^(https?:)?\/\//.test(source) ||
          source.startsWith('/') ||
          source.startsWith('./') ||
          source.startsWith('../')
        ) {
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
      if (style.autoApply !== undefined) {
        (el as any).autoApply = style.autoApply;
      } else {
        (el as any).autoApply = true;
      }
      const autoApplyAttr = style.autoApply === true ? '' : undefined;
      this.ensureAttr(el, 'auto-apply', autoApplyAttr);
      this.ensureAttr(el, 'id', style.id);
      this.ensureAttr(el, 'src', style.src);
      this.ensureAttr(el, 'content', style.content);

      const reference =
        anchor && anchor.parentElement === mapEl ? anchor : null;
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

  private toKebabCase(value: string): string {
    return value
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  private createLayerEl(layer: NormalizedLayer): HTMLElement {
    const data = (layer.data || {}) as Record<string, any>;
    const common: Record<string, any> = {
      id: layer.id,
      visible: layer.visible,
      opacity: layer.opacity,
      'z-index': layer.zIndex,
      ...(layer.style ? { style: JSON.stringify(layer.style) } : {}),
    };

    const add = (attribute: string, value: any, opts?: { json?: boolean }) => {
      if (value === undefined || value === null) return;
      if (opts?.json && typeof value !== 'string') {
        try {
          common[attribute] = JSON.stringify(value);
        } catch {
          common[attribute] = String(value);
        }
      } else {
        common[attribute] = value;
      }
    };

    let el: HTMLElement;
    switch (layer.type) {
      case 'osm':
        el = document.createElement('v-map-layer-osm') as HTMLElement;
        break;
      case 'wms':
      case 'wms-tiled': {
        el = document.createElement('v-map-layer-wms') as HTMLElement;
        add('url', layer.url ?? data.url);
        add('layers', layer.layers ?? data.layers);
        const tiledValue =
          layer.type === 'wms-tiled'
            ? true
            : data.tiled ?? layer.tiled ?? undefined;
        add('tiled', tiledValue);
        add('styles', data.styles);
        add('format', data.format);
        add('transparent', data.transparent);
        add('version', data.version);
        add('time', data.time);
        if (data.params)
          add(
            'params',
            typeof data.params === 'string'
              ? data.params
              : JSON.stringify(data.params),
          );
        break;
      }
      case 'geojson': {
        el = document.createElement('v-map-layer-geojson') as HTMLElement;
        add('url', layer.url ?? data.url);
        const geojsonPayload = data.geojson ?? data.data;
        if (geojsonPayload !== undefined) {
          add(
            'geojson',
            typeof geojsonPayload === 'string'
              ? geojsonPayload
              : JSON.stringify(geojsonPayload),
          );
        }
        add('fill-color', data.fillColor);
        add('fill-opacity', data.fillOpacity);
        add('stroke-color', data.strokeColor);
        add('stroke-width', data.strokeWidth);
        add('stroke-opacity', data.strokeOpacity);
        add('point-radius', data.pointRadius);
        add('point-color', data.pointColor);
        add('icon-url', data.iconUrl);
        add('icon-size', data.iconSize);
        add('text-property', data.textProperty);
        add('text-color', data.textColor);
        add('text-size', data.textSize);
        break;
      }
      case 'xyz': {
        el = document.createElement('v-map-layer-xyz') as HTMLElement;
        add('url', layer.url ?? data.url);
        add('attributions', data.attributions);
        add('max-zoom', data.maxZoom);
        add('tile-size', data.tileSize);
        add('subdomains', data.subdomains);
        break;
      }
      case 'terrain': {
        el = document.createElement('v-map-layer-terrain') as HTMLElement;
        add('elevation-data', data.elevationData);
        add('texture', data.texture);
        if (data.elevationDecoder)
          add(
            'elevation-decoder',
            data.elevationDecoder,
            { json: typeof data.elevationDecoder !== 'string' },
          );
        add('wireframe', data.wireframe);
        if (data.color) {
          add(
            'color',
            Array.isArray(data.color) ? JSON.stringify(data.color) : data.color,
          );
        }
        add('min-zoom', data.minZoom);
        add('max-zoom', data.maxZoom);
        add('mesh-max-error', data.meshMaxError);
        break;
      }
      case 'wfs': {
        el = document.createElement('v-map-layer-wfs') as HTMLElement;
        add('url', data.url ?? layer.url);
        add('type-name', data.typeName);
        add('version', data.version);
        add('output-format', data.outputFormat);
        add('srs-name', data.srsName);
        if (data.params)
          add(
            'params',
            typeof data.params === 'string'
              ? data.params
              : JSON.stringify(data.params),
          );
        break;
      }
      case 'wcs': {
        el = document.createElement('v-map-layer-wcs') as HTMLElement;
        add('url', data.url ?? layer.url);
        add('coverage-name', data.coverageName);
        add('format', data.format);
        add('version', data.version);
        add('projection', data.projection);
        if (data.resolutions)
          add(
            'resolutions',
            typeof data.resolutions === 'string'
              ? data.resolutions
              : JSON.stringify(data.resolutions),
          );
        if (data.params)
          add(
            'params',
            typeof data.params === 'string'
              ? data.params
              : JSON.stringify(data.params),
          );
        break;
      }
      case 'google': {
        el = document.createElement('v-map-layer-google') as HTMLElement;
        add('api-key', data.apiKey);
        add('map-type', data.mapType);
        add('language', data.language);
        add('region', data.region);
        add('scale', data.scale);
        add('libraries', data.libraries);
        add('max-zoom', data.maxZoom);
        if (data.styles)
          add(
            'styles',
            typeof data.styles === 'string'
              ? data.styles
              : JSON.stringify(data.styles),
          );
        break;
      }
      case 'geotiff': {
        el = document.createElement('v-map-layer-geotiff') as HTMLElement;
        add('url', layer.url ?? data.url);
        break;
      }
      case 'tile3d': {
        el = document.createElement('v-map-layer-tile3d') as HTMLElement;
        add('url', layer.url ?? data.url);
        if (data.tilesetOptions)
          add(
            'tileset-options',
            typeof data.tilesetOptions === 'string'
              ? data.tilesetOptions
              : JSON.stringify(data.tilesetOptions),
          );
        break;
      }
      case 'scatterplot': {
        el = document.createElement('v-map-layer-scatterplot') as HTMLElement;
        add('url', data.url);
        if (data.data)
          add(
            'data',
            typeof data.data === 'string'
              ? data.data
              : JSON.stringify(data.data),
          );
        add('get-fill-color', data.getFillColor);
        add('get-radius', data.getRadius);
        break;
      }
      case 'wkt': {
        el = document.createElement('v-map-layer-wkt') as HTMLElement;
        if (data.wkt)
          add(
            'wkt',
            typeof data.wkt === 'string' ? data.wkt : JSON.stringify(data.wkt),
          );
        add('url', data.url);
        add('fill-color', data.fillColor);
        add('fill-opacity', data.fillOpacity);
        add('stroke-color', data.strokeColor);
        add('stroke-width', data.strokeWidth);
        add('stroke-opacity', data.strokeOpacity);
        add('point-radius', data.pointRadius);
        add('point-color', data.pointColor);
        add('icon-url', data.iconUrl);
        add('icon-size', data.iconSize);
        add('text-property', data.textProperty);
        add('text-color', data.textColor);
        add('text-size', data.textSize);
        break;
      }
      default: {
        el = document.createElement('v-map-layer-custom') as HTMLElement;
        el.setAttribute('type', layer.type);
        if (data && typeof data === 'object') {
          for (const [key, value] of Object.entries(data)) {
            add(
              this.toKebabCase(key),
              typeof value === 'object' && value !== null
                ? JSON.stringify(value)
                : value,
            );
          }
        }
      }
    }

    for (const [key, value] of Object.entries(common)) {
      this.ensureAttr(el, key, value);
    }
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
          if (
            [
              'terrain',
              'wfs',
              'wcs',
              'wms',
              'wms-tiled',
              'geojson',
              'xyz',
              'google',
              'tile3d',
              'scatterplot',
              'wkt',
            ].includes(next.type)
          ) {
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
