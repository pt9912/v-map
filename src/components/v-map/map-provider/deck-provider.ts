// src/components/v-map/map-provider/deck-provider.ts
import type {
  MapProvider,
  ProviderOptions,
  LayerConfig,
  LonLat,
} from './map-provider';

//type DeckModule = typeof import('@deck.gl/core');
//type JSONModule = typeof import('@deck.gl/json');

import type { Layer } from '@deck.gl/core';
import type { TileLayer } from '@deck.gl/geo-layers';
import type { BitmapBoundingBox } from '@deck.gl/layers';

//import { DECK_VERSION } from '../../../lib/versions.gen';

export class DeckProvider implements MapProvider {
  private deck!: import('@deck.gl/core').Deck;
  //private Deck!: DeckModule;
  //private JSON!: JSONModule;
  private canvas!: HTMLCanvasElement;
  private target!: HTMLElement;

  async init(opts: ProviderOptions) {
    this.target = opts.target;
    /*
    this.canvas = document.createElement('canvas');
    Object.assign(this.canvas.style, {
      position: 'absolute',
      inset: '0',
      width: '600px',
      height: '600px',
    });
    this.target.appendChild(this.canvas);
*/
    const [{ Deck }] = await Promise.all([import('@deck.gl/core')]);
    //    const [JSON] = await Promise.all([
    //    import('@deck.gl/json'),
    // ]);

    //this.Deck = { ...(await import('@deck.gl/core')) } as DeckModule;
    //this.JSON = JSON as JSONModule;

    const lon = opts.mapInitOptions?.center?.[0] ?? 8.5417;
    const lat = opts.mapInitOptions?.center?.[1] ?? 49.0069;
    const zoom = opts.mapInitOptions?.zoom ?? 5;

    let viewState = {
      longitude: lon,
      latitude: lat,
      zoom,
      bearing: 0,
      pitch: 0,
    };

    //    const { MapController } = await import('@deck.gl/core');

    this.deck = new Deck({
      parent: this.target,
      // canvas: this.canvas,
      controller: {
        // Alle üblichen Gesten aktivieren – du kannst einzelne abschalten
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
        // Deck informiert uns über jede Veränderung (Zoom, Pan, …)
        //console.log(JSON.stringify(vs));
        viewState = vs; // speichere, falls du später darauf zugreifen willst
        // optional: UI‑Updates, Persistenz, etc.
        this.deck.setProps({ viewState });
      },
      layers: [],
      _typedArrayManagerProps: { overAlloc: 1 },
    } as any);
  }

  // ---- helpers ----

  /**
   * Lädt ein PNG (oder jedes Bildformat) und gibt ein ImageBitmap zurück.
   *
   * @param url          URL zum PNG‑Bild
   * @param abortSignal  optionales AbortSignal zum Abbrechen des Fetches
   * @returns            Promise<ImageBitmap>
   */
  /*
  private async loadImageBitmap(
    url: string,
    abortSignal?: AbortSignal,
  ): Promise<ImageBitmap> {
    // 1️⃣ fetch
    const resp = await fetch(url, { signal: abortSignal });

    // 2️⃣ HTTP‑Status prüfen
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} – ${resp.statusText}`);
    }

    // 3️⃣ Blob aus dem Stream erzeugen (internes Lesen des ReadableStreams)
    const blob = await resp.blob(); // Blob ist vom MIME‑Typ "image/png"

    // 4️⃣ ImageBitmap erzeugen
    //    Optional: resizeWidth/resizeHeight, colorSpaceConversion, premultiplyAlpha …
    const bitmap = await createImageBitmap(blob, {
      // Beispiel‑Optionen (kann weggelassen werden)
      // resizeWidth: 800,
      // resizeHeight: 600,
      // colorSpaceConversion: "default", // "none" für sRGB‑Preserve
      // premultiplyAlpha: "premultiply", // "none" | "default"
    });

    return bitmap;
  }
*/
  private async buildXyzTileLayer(cfg: any): Promise<TileLayer> {
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
      id: (cfg.id || 'xyz-') + Math.random().toString(36).slice(2),
      data: [cfg.url],
      maxRequests: 20,
      tileSize,
      minZoom: cfg.minZoom ?? 0,
      maxZoom: cfg.maxZoom ?? 19,
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
      renderSubLayers: sl => {
        const { west, south, east, north } = sl.tile.bbox;
        const bounds: BitmapBoundingBox = [west, south, east, north];
        //const data = sl.data && sl.data.url ? [sl.data] : [];
        const { data, ...otherProps } = sl;
        return new BitmapLayer(otherProps, {
          //pickable
          image: [data], //(d: any) => d.url,
          bounds,
          opacity: cfg.opacity ?? 1,
        });
      },
    } as any);
  }

  private async buildOsmLayer(cfg: Extract<LayerConfig, { type: 'osm' }>) {
    return this.buildXyzTileLayer({
      ...cfg,
      url: cfg.url || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      // subdomains: cfg.subdomains || 'a,b,c',
      id: 'osm-',
    });
  }

  async buildScatterPlot(
    layerConfig: Extract<LayerConfig, { type: 'scatterplot' }>,
  ): Promise<Layer> {
    const { ScatterplotLayer } = await import('@deck.gl/layers');
    const data = layerConfig.data;
    const scatterLayer: Layer = new ScatterplotLayer<any>({
      id: layerConfig.id,
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
        if (info.object) console.log('Hover:', info.object);
      },

      // Wichtig für Deck.gl, damit es erkennt, wann sich etwas ändert
      updateTriggers: {
        getPosition: data,
        getRadius: data,
        getFillColor: data,
      },
    });
    return scatterLayer;

    /*
    {
          '@@type': 'ScatterplotLayer',
          'id': 'scatterplot-' + Math.random().toString(36).slice(2),
          'data': dataSource,
          'getFillColor': this.getFillColor as any,
          'getRadius': this.getRadius,
          'opacity': this.opacity,
          'visible': this.visible,
        },

    const maybeObjects = layerConfig.layers;
     '@@type': 'ScatterplotLayer',
    const needsJson = maybeObjects.some(
      l =>
        l && typeof l === 'object' && !l.id && ('@@type' in l || 'data' in l),
    );
    if (needsJson) {
      const { JSONConverter } = this.JSON;
      const converter = new JSONConverter({ configuration: { classes: {} } });
      nextLayers = converter.convert(maybeObjects);
    } else {
      nextLayers = maybeObjects as any[];
    }
    return nextLayers;
    */
  }

  private async createLayer(layerConfig: LayerConfig): Promise<Layer> {
    //a: DeckProps;
    switch (layerConfig.type) {
      /*
      case 'geojson':
        return this.createGeoJSONLayer(
          layerConfig as Extract<LayerConfig, { type: 'geojson' }>,
        );
      case 'xyz':
        return this.createXYZLayer(
          layerConfig as Extract<LayerConfig, { type: 'xyz' }>,
        );
      case 'google':
        return this.createGoogleLayer(
          layerConfig as Extract<LayerConfig, { type: 'google' }>,
        );
        */
      case 'osm':
        return await this.buildOsmLayer(
          layerConfig as Extract<LayerConfig, { type: 'osm' }>,
        );
      case 'xyz':
        return await this.buildXyzTileLayer(
          layerConfig as Extract<LayerConfig, { type: 'xyz' }>,
        );
      /*
      case 'wms':
        return this.createWMSLayer(
          layerConfig as Extract<LayerConfig, { type: 'wms' }>,
        );
        */
      case 'scatterplot':
        return await this.buildScatterPlot(
          layerConfig as Extract<LayerConfig, { type: 'scatterplot' }>,
        );
      default:
        console.log(`Unsupported layer type: ${(layerConfig as any).type}`);
        //throw new Error(`Unsupported layer type: ${(layerConfig as any).type}`);
        break;
    }
  }

  // ---- API ----
  async addLayer(layerConfig: LayerConfig) {
    const layer: Layer = await this.createLayer(layerConfig);
    const current = (this.deck.props.layers as any[]) ?? [];
    this.deck.setProps({
      layers: [...current, layer],

      getTooltip: (layerConfig as any).getTooltip,
      onClick: (layerConfig as any).onClick,
      onHover: (layerConfig as any).onHover,
    });
    return;
  }

  async addLayerToGroup(_groupId: string, layerConfig: LayerConfig) {
    return this.addLayer(layerConfig);
  }

  async destroy() {
    try {
      this.deck?.finalize();
    } catch {}
    this.canvas?.remove();
  }

  async setView([lon, lat]: LonLat, zoom: number) {
    this.deck?.setProps({
      viewState: { longitude: lon, latitude: lat, zoom, bearing: 0, pitch: 0 },
    });
  }

  getMap() {
    return this.deck;
  }
}
export default DeckProvider;
