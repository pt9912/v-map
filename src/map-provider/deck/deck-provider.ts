// DeckProvider.ts (relevante Änderungen)
import type { MapProvider, LayerUpdate } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';

import { log } from '../../utils/logger';

import { formatBbox, buildQuery } from '../../utils/spatial-utils';

import type { RenderableGroup } from './RenderableGroup';
import { LayerGroups } from './LayerGroups';
import { LayerGroupWithModel } from './LayerGroupWithModel';
import { type LayerModel } from './LayerModel';

import type { Layer, MapViewState } from '@deck.gl/core';
import type {
  TileLayer,
  _TileLoadProps,
  GeoBoundingBox,
} from '@deck.gl/geo-layers';
import type { BitmapBoundingBox } from '@deck.gl/layers';

export class DeckProvider implements MapProvider {
  private deck!: import('@deck.gl/core').Deck;
  private target!: HTMLDivElement;
  private shadowRoot!: ShadowRoot;
  private injectedStyle!: HTMLStyleElement;

  // Store arbeitet mit RenderableGroup — wir nutzen hier die modellbasierte Gruppe
  private layerGroups: LayerGroups<Layer, RenderableGroup<Layer>> =
    new LayerGroups({});

  async init(opts: ProviderOptions) {
    this.target = opts.target;
    this.shadowRoot = opts.shadowRoot;
    this.injectedStyle = await (async function injectCss(sr?: ShadowRoot) {
      const style = document.createElement('style');
      style.textContent =
        'canvas.deckgl-canvas { background:#fff !important; }';
      sr?.appendChild(style);
      return style;
    })(this.shadowRoot);

    const [{ Deck }] = await Promise.all([import('@deck.gl/core')]);

    const lon = opts.mapInitOptions?.center?.[0] ?? 8.5417;
    const lat = opts.mapInitOptions?.center?.[1] ?? 49.0069;
    const zoom = opts.mapInitOptions?.zoom ?? 5;

    let viewState: MapViewState = {
      longitude: lon,
      latitude: lat,
      zoom,
      bearing: 0,
      pitch: 0,
    };

    Object.assign(this.target.style, {
      width: '100%',
      height: '100%',
      position: 'relative',
      background: '#fff',
    });

    this.deck = new Deck({
      parent: this.target,
      controller: {
        scrollZoom: true,
        dragPan: true,
        dragRotate: true,
        touchZoom: true,
        touchRotate: true,
        doubleClickZoom: true,
        keyboard: true,
      },
      viewState,
      onViewStateChange: ({ viewState: vs }) => {
        viewState = vs;
        this.deck.setProps({ viewState });
      },
      layers: [],
      _typedArrayManagerProps: { overAlloc: 1 },
    });

    this.layerGroups.attachDeck(this.deck);
  }

  // ---------- Helpers: Modelle / Gruppen ----------

  /** Liefert (oder erzeugt) eine modellbasierte Gruppe */
  private ensureModelGroup(groupId: string): LayerGroupWithModel<Layer> {
    const g = this.layerGroups.getGroup(groupId) as
      | LayerGroupWithModel<Layer>
      | undefined;
    if (g) return g;
    const ng = new LayerGroupWithModel<Layer>({
      id: groupId,
      syncMode: 'force-model',
    });
    this.layerGroups.addGroup(ng);
    return ng;
  }

  /** Erzeugt ein LayerModel aus einem LayerConfig + Factory */
  private createLayerModel(
    layerId: string,
    make: () => Layer,
    enabled = true,
    elementId = null,
  ): LayerModel<Layer> {
    return { id: layerId, elementId, enabled, make, meta: {} };
  }

  // ---------- Layer-Factories (unverändert, geben Deck-Layer zurück) ----------

  private async buildXyzTileLayer(
    cfg: any,
    layerId: string,
  ): Promise<TileLayer> {
    const { BitmapLayer } = await import('@deck.gl/layers');
    const { TileLayer } = await import('@deck.gl/geo-layers');
    const tileSize = cfg.tileSize ?? 256;
    /*
    const subdomains: string[] = Array.isArray(cfg.subdomains)
      ? cfg.subdomains
      : typeof cfg.subdomains === 'string' && cfg.subdomains.length
      ? cfg.subdomains.split(',')
      : ['a', 'b', 'c'];
    const makeUrl = (z: number, x: number, y: number) => {
      const s = subdomains.length
        ? subdomains[(x + y + z) % subdomains.length]
        : '';
      return (cfg.url as string)
        .replace('{z}', String(z))
        .replace('{x}', String(x))
        .replace('{y}', String(y))
        .replace('{s}', s);
    };

*/
    /*
    const makeUrl = (z: number, x: number, y: number) => {
      return (cfg.url as string)
        .replace('{z}', String(z))
        .replace('{x}', String(x))
        .replace('{y}', String(y));
    };
*/
    //    return new TileLayer<ImageBitmap>({
    return new TileLayer({
      id: layerId,
      data: [cfg.url],
      zIndex: 100,
      maxRequests: 20,
      tileSize,
      minZoom: cfg.minZoom ?? 0,
      maxZoom: cfg.maxZoom ?? 19,
      opacity: cfg.opacity,
      /*
      getTileData: async ({ signal, index }) => {
        const { x, y, z } = index;
        const yXYZ = (1 << z) - 1 - y; // flip TMS to XYZ
        const data = await this.loadImageBitmap(makeUrl(z, x, yXYZ), signal);
        if (signal.aborted) {
          return null;
        }
        return data;
      },
      */
      /*      getTileData: async ({ index }) => {
        const { x, y, z } = index;
        const yXYZ = (1 << z) - 1 - y; // flip TMS to XYZ
        const tile = { url: makeUrl(z, x, yXYZ) };
        if (fetch && tile.url) {
          return fetch(tile.url, {propName: 'data', layer: this, signal});
        }
        return null;        
      },
      */
      onTileError: err => {
        log(`v-map - provider - deck - Tile Error: ${err}`);
      },

      renderSubLayers: sl => {
        const { west, south, east, north } = sl.tile.bbox;
        const bounds: BitmapBoundingBox = [west, south, east, north];
        //const data = sl.data && sl.data.url ? [sl.data] : [];
        const { data, ...otherProps } = sl;
        if (data == null) {
          const canvas = document.createElement('canvas');
          canvas.width = sl.tile.width;
          canvas.height = sl.tile.height;
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, sl.tile.width, sl.tile.height); // Transparenter Hintergrund
          return new BitmapLayer({
            id: `dynamic-transparent-bitmap-${sl.tile.index.x}-${sl.tile.index.y}-${sl.tile.index.z}`, // Eindeutige ID!
            image: canvas,
            coordinates: 'pixel',
            bounds: [0, 0, sl.tile.width, sl.tile.height],
          });
        }
        return new BitmapLayer(otherProps, {
          //pickable
          image: [data], //(d: any) => d.url,
          bounds,
          opacity: sl.opacity ?? 1,
        });
      },
      updateTriggers: {
        renderSubLayers: ['sl.props.opacity'],
      },
    } as any);
  }

  private async buildOsmLayer(
    cfg: Extract<LayerConfig, { type: 'osm' }>,
    layerId: string,
  ) {
    let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    if (cfg.url) {
      url = cfg.url + '/{z}/{x}/{y}.png';
    }
    return this.buildXyzTileLayer(
      {
        ...cfg,
        url: url,
        // subdomains: cfg.subdomains || 'a,b,c',
      },
      layerId,
    );
  }

  async buildScatterPlot(
    layerConfig: Extract<LayerConfig, { type: 'scatterplot' }>,
    layerId: string,
  ): Promise<Layer> {
    const { ScatterplotLayer } = await import('@deck.gl/layers');
    const data = layerConfig.data;
    const scatterLayer: Layer = new ScatterplotLayer<any>({
      id: layerId,
      data, // <- dein Array von Punkten (any[] oder ein konkretes Interface)
      getPosition: d => d.position,
      getRadius: d => d.radius,
      getFillColor: d => d.color,
      radiusMinPixels: 2,
      radiusMaxPixels: 30,
      pickable: true,
      autoHighlight: true,
      highlightColor: [255, 255, 0, 128],

      // optional – wenn du Hover‑Infos brauchst
      onHover: info => {
        if (info.object) log('v-map - provider - deck - Hover:', info.object);
      },

      // Wichtig für Deck.gl, damit es erkennt, wann sich etwas ändert
      updateTriggers: {
        getPosition: data,
        getRadius: data,
        getFillColor: data,
      },
    });
    return scatterLayer;
  }

  private async createGeoJSONLayer(
    config: Extract<LayerConfig, { type: 'geojson' }>,
    layerId: string,
  ): Promise<Layer> {
    const { GeoJsonLayer } = await import('@deck.gl/layers');
    let layer = null;
    // if (layer != null) {
    //   layer = new GeoJsonLayer({
    //     id: layerId,
    //     data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json',
    //     opacity: 0.8,
    //     stroked: false,
    //     filled: true,
    //     extruded: true,
    //     wireframe: true,

    //     getElevation: f => Math.sqrt(f.properties.valuePerSqm) * 10,
    //     getFillColor: f => this._colorScale(f.properties.growth),
    //     getLineColor: [255, 255, 255],

    //     pickable: true,
    //   });
    //   if (layer !== null) {
    //     return layer;
    //   }
    // }
    let geojson_or_url = null;
    if (config.geojson) {
      geojson_or_url = JSON.parse(config.geojson);
    } else {
      geojson_or_url = config.url;
    }
    if (geojson_or_url) {
      layer = new GeoJsonLayer({
        id: layerId,
        data: geojson_or_url, // kann auch eine URL sein, z. B. '/data/file.geojson'
        filled: true,
        pointType: 'circle',
        //getText: (f: Feature<Geometry, PropertiesType>) => f.properties.name,
        pointRadiusMinPixels: 4,
        //pointRadiusScale: 2000,
        getPointRadius: 10,
        getFillColor: [200, 0, 80, 180],
        getLineColor: [0, 0, 0, 255],
        lineWidthMinPixels: 2,
        zIndex: 100,
      });
    }
    return layer;
  }

  // --- innerhalb der DeckProvider-Klasse ---
  private async buildWmsTileLayer(
    cfg: Extract<LayerConfig, { type: 'wms' }>,
    // cfg2: {
    //   url: string; // Basis-URL ohne Query (z.B. https://server/wms)
    //   layers: string; // Pflicht: WMS-Layers (kommagetrennt möglich)
    //   styles?: string; // optional
    //   format?: string; // default image/png
    //   transparent?: boolean; // default true
    //   version?: '1.1.1' | '1.3.0'; // default 1.3.0
    //   crs?: WmsCrs; // default 'EPSG:3857'
    //   tileSize?: number; // default 256
    //   minZoom?: number; // default 0
    //   maxZoom?: number; // default 19
    //   opacity?: number; // optional
    //   time?: string; // optional WMS TIME=
    //   extraParams?: Record<string, string | number | boolean>; // optional Zusatz-Parameter
    // },
    layerId: string,
  ) {
    const { BitmapLayer } = await import('@deck.gl/layers');
    const { TileLayer } = await import('@deck.gl/geo-layers');

    const tileSize = cfg.tileSize ?? 256;
    const version = cfg.version ?? '1.3.0';
    const crs: string = cfg.crs ?? 'EPSG:3857';
    const format = cfg.format ?? 'image/png';
    const transparent = cfg.transparent ?? true;

    const crsParamKey = version === '1.1.1' ? 'SRS' : 'CRS';
    const baseParams = {
      SERVICE: 'WMS',
      REQUEST: 'GetMap',
      VERSION: version,
      LAYERS: cfg.layers,
      STYLES: cfg.styles ?? '',
      FORMAT: format,
      TRANSPARENT: transparent ? 'TRUE' : 'FALSE',
      [crsParamKey]: crs,
      TILED: 'true', // oder 'TRUE'
    };

    return new TileLayer<ImageBitmap | HTMLCanvasElement>({
      id: layerId,
      data: [cfg.url],
      zIndex: 100,
      tileSize,
      minZoom: cfg.minZoom ?? 0,
      maxZoom: cfg.maxZoom ?? 19,
      opacity: cfg.opacity,
      maxRequests: 20,

      // Für jeden Tile-Index die passende GetMap-URL bauen und Bild laden
      getTileData: async (tile: _TileLoadProps) => {
        /*
export type TileLoadProps = {
  index: TileIndex;
  id: string;
  bbox: TileBoundingBox;
  url?: string | null;
  signal?: AbortSignal;
  userData?: Record<string, any>;
  zoom?: number;
};
*/
        const { west, south, east, north } = tile.bbox as GeoBoundingBox; // lon/lat (WGS84)
        const bbox = formatBbox(west, south, east, north, version, crs);

        const params = {
          ...baseParams,
          BBOX: bbox,
          WIDTH: tileSize, //tile.width,
          HEIGHT: tileSize, //tile.height,
          TIME: cfg.time,
          ...cfg.extraParams,
        };

        const url = `${cfg.url}${buildQuery(params)}`;

        try {
          const res = await fetch(url, {
            /*signal,*/ mode: 'cors' as RequestMode,
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          // Bei Image/* → ImageBitmap. Bei Fehlern transparente Kachel zurückgeben.
          return await createImageBitmap(blob);
        } catch (e) {
          // Transparente Fallback-Kachel, damit Deck sauber weiterzeichnet
          const canvas = document.createElement('canvas');
          canvas.width = tileSize; //tile.width;
          canvas.height = tileSize; //tile.height;
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
          return canvas;
        }
      },

      onTileError: err => {
        log(`v-map - provider - deck - WMS Tile Error: ${err}`);
      },

      renderSubLayers: sl => {
        const { west, south, east, north } = sl.tile.bbox;
        if (sl.data instanceof HTMLCanvasElement) {
          return new BitmapLayer({
            id: `${layerId}-bmp-${sl.tile.index.x}-${sl.tile.index.y}-${sl.tile.index.z}`, // Eindeutige ID!
            image: sl.data,
            coordinates: 'pixel',
            bounds: [0, 0, sl.tile.width, sl.tile.height],
          });
        }
        return new BitmapLayer({
          id: `${layerId}-bmp-${sl.tile.index.x}-${sl.tile.index.y}-${sl.tile.index.z}`,
          image: [sl.data], // ImageBitmap | Canvas
          bounds: [west, south, east, north],
          opacity: sl.opacity ?? 1,
          pickable: false,
        });
      },

      updateTriggers: {
        // Neurendern, wenn sich Zeit/Styles/Opacity etc. ändern
        getTileData: [
          cfg.layers,
          cfg.styles,
          cfg.format,
          cfg.transparent,
          cfg.version,
          cfg.crs,
          cfg.time,
          JSON.stringify(cfg.extraParams ?? {}),
        ],
        renderSubLayers: ['sl.props.opacity'],
      },
    } as any);
  }

  private async createLayer(
    layerConfig: LayerConfig,
    layerId: string,
  ): Promise<Layer> {
    switch (layerConfig.type) {
      case 'geojson':
        return this.createGeoJSONLayer(layerConfig as any, layerId);
      case 'osm':
        return this.buildOsmLayer(layerConfig as any, layerId);
      case 'wms':
        return this.buildWmsTileLayer(
          layerConfig as Extract<LayerConfig, { type: 'wms' }>,
          layerId,
        );
      case 'xyz':
        return this.buildXyzTileLayer(layerConfig as any, layerId);
      case 'scatterplot':
        return this.buildScatterPlot(layerConfig as any, layerId);
      default:
        log(
          `v-map - provider - deck - Unsupported layer type: ${
            (layerConfig as any).type
          }`,
        );
        return null as any;
    }
  }

  // ---------- Provider-API: nutzt NUR Model/Store ----------

  // async addLayer(config: LayerConfig): Promise<string> {
  //   const groupId = config.groupId ?? 'default';
  //   const group = this.ensureModelGroup(groupId);

  //   const layerId = crypto.randomUUID();
  //   const make = async () => this.createLayer(config, layerId);
  //   const model = this.createLayerModel(layerId, () => null as any, true);

  //   // make() lazy auflösen (async Factory umwickeln)
  //   model.make = () => {
  //     // Achtung: Factory muss sync sein → wir „promoten“ hier bekannte Layer
  //     // Lösung: createLayer bei add* schon aufrufen:
  //     throw new Error('model.make should not be async');
  //   };

  //   // Besser: Layer jetzt schon erstellen, damit make() sync bleibt:
  //   const layer = await this.createLayer(config, layerId);
  //   model.make = () => layer;

  //   group.addModel(model);

  //   // Overrides aus config übernehmen
  //   const ov: any = {};
  //   if ((config as any).opacity !== undefined)
  //     ov.opacity = (config as any).opacity;
  //   if ((config as any).zIndex !== undefined)
  //     ov.zIndex = (config as any).zIndex;
  //   if ((config as any).visible === true) ov.visible = true;
  //   if ((config as any).visible === false) ov.visible = false;
  //   if (Object.keys(ov).length) group.setModelOverrides(layerId, ov);

  //   // Render
  //   this.layerGroups.applyToDeck();
  //   return layerId;
  // }

  async addLayerToGroup(
    layerConfig: LayerConfig,
    groupId: string,
  ): Promise<string> {
    const group = this.ensureModelGroup(groupId);
    const layerId = crypto.randomUUID();
    const template = await this.createLayer(layerConfig, layerId);
    if (!template) return null;
    const model = this.createLayerModel(
      layerId,
      () => template.clone({}),
      (layerConfig as any).visible ?? true, // Model-Visibility (enabled)
    );
    group.addModel(model);

    const ov: any = {};
    if ((layerConfig as any).opacity !== undefined)
      ov.opacity = (layerConfig as any).opacity;
    if ((layerConfig as any).zIndex !== undefined)
      ov.zIndex = (layerConfig as any).zIndex;
    if ((layerConfig as any).visible === true) ov.visible = true;
    if ((layerConfig as any).visible === false) ov.visible = false;
    if (Object.keys(ov).length) group.setModelOverrides(layerId, ov);

    this.layerGroups.applyToDeck();
    return layerId;
  }

  async addBaseLayer(
    layerConfig: LayerConfig,
    basemapid: string,
    layerElementId: string,
  ): Promise<string> {
    if (!layerElementId || !basemapid) {
      log('ol - addBaseLayer - ids missing');
      return null;
    }

    const group = this.ensureModelGroup(layerConfig.groupId ?? 'basemap');
    (group as LayerGroupWithModel<Layer>).basemap = basemapid;

    const layerId = crypto.randomUUID();
    const layer = await this.createLayer(layerConfig, layerId);
    if (!layer) return null;

    const model = this.createLayerModel(
      layerId,
      () => layer,
      true,
      layerElementId,
    );
    group.addModel(model);

    // Overrides aus config
    const ov: any = {};
    if ((layerConfig as any).opacity !== undefined)
      ov.opacity = (layerConfig as any).opacity;
    if ((layerConfig as any).zIndex !== undefined)
      ov.zIndex = (layerConfig as any).zIndex;
    if ((layerConfig as any).visible === true) ov.visible = true;
    if ((layerConfig as any).visible === false) ov.visible = false;
    if (Object.keys(ov).length)
      (group as LayerGroupWithModel<Layer>).setModelOverrides(layerId, ov);

    this.layerGroups.applyToDeck();
    return layerId;
  }

  async setBaseLayer(groupId: string, layerElementId: string): Promise<void> {
    const group = this.ensureModelGroup(groupId);
    group.basemap = layerElementId ?? null;
    this.layerGroups.applyToDeck();
  }

  // ------ Updates: ausschließlich via Model-Overrides / Model-Factory ------

  async updateLayer(layerId: string, update: LayerUpdate): Promise<void> {
    // Finde die Gruppe, die das Model hat
    const group = this.layerGroups.groups.find(g =>
      (g as any).getModel?.(layerId),
    ) as LayerGroupWithModel<Layer> | undefined;
    if (!group) return;

    switch (update.type) {
      case 'geojson': {
        const data = update.data?.geojson
          ? JSON.parse(update.data.geojson)
          : update.data?.url;
        if (data) group.setModelOverrides(layerId, { data });
        break;
      }
      case 'osm': {
        if (update.data?.url)
          group.setModelOverrides(layerId, {
            url: `${update.data.url}/{z}/{x}/{y}.png`,
          });
        break;
      }
      case 'wms': {
        const ov: any = {};
        if (update.data?.url) ov.url = update.data.url; // Basis-URL
        if (update.data?.layers) ov.layers = update.data.layers;
        if (update.data?.styles !== undefined) ov.styles = update.data.styles;
        if (update.data?.format) ov.format = update.data.format;
        if (update.data?.transparent !== undefined)
          ov.transparent = update.data.transparent;
        if (update.data?.version) ov.version = update.data.version;
        if (update.data?.crs) ov.crs = update.data.crs;
        if (update.data?.time !== undefined) ov.time = update.data.time;
        if (update.data?.extraParams) ov.extraParams = update.data.extraParams;
        if (Object.keys(ov).length) group.setModelOverrides(layerId, ov);
        break;
      }
    }
    this.layerGroups.applyToDeck();
  }

  async removeLayer(layerId: string): Promise<void> {
    // Modellbasiert: Model entfernen → apply
    for (const g of this.layerGroups.groups) {
      const removeModel = (g as any).removeModel?.bind(g);
      const getModel = (g as any).getModel?.bind(g);
      if (typeof getModel === 'function' && getModel(layerId)) {
        removeModel(layerId);
        this.layerGroups.applyToDeck();
        return;
      }
    }
    // Fallback: falls nicht modellbasiert vorhanden, klassisch entfernen
    this.layerGroups.removeLayer(layerId, { removeFromAll: true });
  }

  async setOpacity(layerId: string, opacity: number): Promise<void> {
    const g = this.layerGroups.groups.find(grp =>
      (grp as any).getModel?.(layerId),
    ) as LayerGroupWithModel<Layer> | undefined;
    if (!g) return;
    g.setModelOverrides(layerId, { opacity });
    this.layerGroups.applyToDeck();
  }

  async setZIndex(layerId: string, zIndex: number): Promise<void> {
    const g = this.layerGroups.groups.find(grp =>
      (grp as any).getModel?.(layerId),
    ) as LayerGroupWithModel<Layer> | undefined;
    if (!g) return;
    g.setModelOverrides(layerId, { zIndex });
    this.layerGroups.applyToDeck();
  }

  async setVisible(layerId: string, visible: boolean): Promise<void> {
    const g = this.layerGroups.groups.find(grp =>
      (grp as any).getModel?.(layerId),
    ) as LayerGroupWithModel<Layer> | undefined;
    if (!g) return;
    // zwei Ebenen: Model.enabled (dein "Layer visible") und Deck-Visible
    g.setModelEnabled(layerId, visible); // Model-Visibility
    g.setModelOverrides(layerId, { visible }); // Deck-Override (optional)
    this.layerGroups.applyToDeck();
  }

  async setGroupVisible(groupId: string, visible: boolean): Promise<void> {
    this.layerGroups.setGroupVisible(groupId, visible);
  }

  async setView([lon, lat]: LonLat, zoom: number) {
    this.deck?.setProps({
      viewState: { longitude: lon, latitude: lat, zoom, bearing: 0, pitch: 0 },
    });
  }

  async destroy() {
    try {
      this.layerGroups.clear({ destroy: true });
      this.shadowRoot && this.injectedStyle?.remove();
      this.deck?.finalize();
    } catch {}
  }

  getMap() {
    return this.deck;
  }
}
export default DeckProvider;
