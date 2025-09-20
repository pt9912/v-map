import type { MapProvider, LayerUpdate } from '../../types/mapprovider';
import type { ProviderOptions } from '../../types/provideroptions';
import type { LayerConfig } from '../../types/layerconfig';
import type { LonLat } from '../../types/lonlat';

import type { Layer, LayerProps, MapViewState } from '@deck.gl/core';
import type { TileLayer } from '@deck.gl/geo-layers';
import type { BitmapBoundingBox } from '@deck.gl/layers';

async function injectCss(
  shadowRoot?: ShadowRoot,
): Promise<HTMLStyleElement | null> {
  const style = document.createElement('style');
  style.textContent = 'canvas.deckgl-canvas { background:#fff !important; }';
  shadowRoot.appendChild(style);
  return style;
}

async function removeInjectedCss(
  shadowRoot: ShadowRoot,
  injectedStyle: HTMLStyleElement,
) {
  if (!shadowRoot || !injectedStyle) return;
  // Das <style>-Element aus dem Shadow‑DOM entfernen
  injectedStyle.remove(); // moderne API
}

export class DeckProvider implements MapProvider {
  private deck!: import('@deck.gl/core').Deck;
  private canvas!: HTMLCanvasElement;
  private target!: HTMLDivElement;
  private shadowRoot: ShadowRoot;
  private injectedStyle: HTMLStyleElement;

  async init(opts: ProviderOptions) {
    this.target = opts.target;
    this.shadowRoot = opts.shadowRoot;

    this.injectedStyle = await injectCss(this.shadowRoot);

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
    });
  }

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
        console.log(`v-map - provider - deck - Tile Error: ${err}`);
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
        if (info.object)
          console.log('v-map - provider - deck - Hover:', info.object);
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

  // private COLOR_SCALE = [
  //   // negative
  //   [65, 182, 196],
  //   [127, 205, 187],
  //   [199, 233, 180],
  //   [237, 248, 177],

  //   // positive
  //   [255, 255, 204],
  //   [255, 237, 160],
  //   [254, 217, 118],
  //   [254, 178, 76],
  //   [253, 141, 60],
  //   [252, 78, 42],
  //   [227, 26, 28],
  //   [189, 0, 38],
  //   [128, 0, 38],
  // ];

  // private _colorScale(x): any {
  //   const i = Math.round(x * 7) + 4;
  //   if (x < 0) {
  //     return this.COLOR_SCALE[i] || this.COLOR_SCALE[0];
  //   }
  //   return this.COLOR_SCALE[i] || this.COLOR_SCALE[this.COLOR_SCALE.length - 1];
  // }
  /*
  private async createGeoTIFFLayer(
    config: Extract<LayerConfig, { type: 'geotiff' }>,
    layerId: string,
  ) {
    const { GeoTIFFLayer } = await import('@deck.gl/geo-layers/dist/experimental');
    const { TIFFLoader } = await import('@loaders.gl/tiff');
    const layer = new GeoTIFFLayer({
      id: 'cog-layer',
      data: config.cogUrl,
      // COG-spezifische Optimierungen:
      tiffOptions: {
        pool: true, // Web Worker verwenden
        cache: true, // Kacheln cachen
        maxCacheSize: 10, // Cache-Limit in MB
      },
      // Styling (anpassen an deine Daten!)
      colorRange: {
        colors: [
          [65, 182, 196], // Wasser (niedrig)
          [254, 224, 139], // Land (mittel)
          [217, 95, 2], // Berge (hoch)
        ],
        min: 0,
        max: 3000, // Anpassen an deine Höhenwerte!
      },
      opacity: 0.8,
      // Performance:
      resamplingMode: 'nearest', // 'bilinear' für glattere Ergebnisse (langsamer)
      // Optional: Nur bei Bedarf laden (z. B. für Überlagerungen)
      visible: true,
      // Koordinatenbegrenzung (falls bekannt)
      bounds: [8.5, 49.0, 8.6, 49.1], // [minLng, minLat, maxLng, maxLat]
    });

    return layer;
  }
*/
  private async createGeoJSONLayer(
    config: Extract<LayerConfig, { type: 'geojson' }>,
    layerId: string,
  ) {
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

  private async updateGeoJSONLayer(layer: Layer, data: any): Promise<void> {
    let geojson_or_url = null;
    if (data.geojson) {
      geojson_or_url = JSON.parse(data.geojson);
    } else {
      geojson_or_url = data.url;
    }
    if (geojson_or_url) {
      const layers = this.deck.props.layers;
      this.deck.setProps({
        layers: layers.map((l: Layer) =>
          l.id === layer.id ? l.clone({ data: geojson_or_url }) : l,
        ),
      });
    }
  }

  private async updateOsmLayer(layer: Layer, data: any): Promise<void> {
    if (data.url) {
      let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      if (data.url) {
        url = data.url + '/{z}/{x}/{y}.png';
      }
      const layers = this.deck.props.layers;
      this.deck.setProps({
        layers: layers.map((l: Layer) =>
          l.id === layer.id
            ? l.clone({ url: url } as Partial<LayerProps> & {
                url?: string;
              })
            : l,
        ),
      });
    }
  }

  private async createLayer(
    layerConfig: LayerConfig,
    layerId: string,
  ): Promise<Layer> {
    //a: DeckProps;
    switch (layerConfig.type) {
      /*      case 'geotiff':
        return await this.createGeoTIFFLayer(
          layerConfig as Extract<LayerConfig, { type: 'geojson' }>,
          layerId,
        );
  */ case 'geojson':
        return await this.createGeoJSONLayer(
          layerConfig as Extract<LayerConfig, { type: 'geojson' }>,
          layerId,
        );
      /*
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
          layerId,
        );
      case 'xyz':
        return await this.buildXyzTileLayer(
          layerConfig as Extract<LayerConfig, { type: 'xyz' }>,
          layerId,
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
          layerId,
        );
      default:
        console.log(
          `v-map - provider - deck - Unsupported layer type: ${
            (layerConfig as any).type
          }`,
        );
        //throw new Error(`Unsupported layer type: ${(layerConfig as any).type}`);
        break;
    }
  }

  // ---- API ----
  async updateLayer(layerId: string, update: LayerUpdate): Promise<void> {
    const layer = await this._getLayerById(layerId);
    switch (update.type) {
      case 'geojson':
        await this.updateGeoJSONLayer(layer, update.data);
        break;
      case 'osm':
        await this.updateOsmLayer(layer, update.data);
        break;
    }
  }

  async addLayer(config: LayerConfig): Promise<string> {
    const layerId = crypto.randomUUID();
    let layer: Layer = await this.createLayer(config, layerId);
    const current = (this.deck.props.layers as any[]) ?? [];
    this.deck.setProps({
      layers: [...current, layer],

      getTooltip: (config as any).getTooltip,
      onClick: (config as any).onClick,
      onHover: (config as any).onHover,
    });
    if (layer) {
      if ((config as any).opacity !== undefined) {
        layer = await this._setOpacity(layer, (config as any).opacity);
      }
      if ((config as any).zIndex !== undefined) {
        layer = await this._setZIndex(layer, (config as any).zIndex);
      }
      if ((config as any).visible) {
        layer = await this._setVisible(layer, true);
      } else if ((config as any).visible === false) {
        layer = await this._setVisible(layer, false);
      }
      return layerId;
    }

    return null;
  }

  async addLayerToGroup(_groupId: string, layerConfig: LayerConfig) {
    return this.addLayer(layerConfig);
  }

  async destroy() {
    try {
      await removeInjectedCss(this.shadowRoot, this.injectedStyle);
      this.deck?.finalize();
    } catch {}
    this.canvas?.remove();
  }

  async setView([lon, lat]: LonLat, zoom: number) {
    this.deck?.setProps({
      viewState: { longitude: lon, latitude: lat, zoom, bearing: 0, pitch: 0 },
    });
  }

  private async _getLayerById(layerId): Promise<Layer | undefined> {
    if (!this.deck) {
      return null;
    }

    const layers = this.deck.props.layers;
    if (!layers) return undefined; // Falls layers `false` ist

    // LayersList ist ein Array-ähnliches Objekt, das wir als Array behandeln können
    const layersArray = Array.isArray(layers) ? layers : [layers];
    return layersArray.find((layer): layer is Layer =>
      Boolean(layer && 'id' in layer && layer.id === layerId),
    );
  }

  /**
   * Setzt den zIndex für einen bestimmten Layer.
   * @param layer Der Layer, dessen zIndex geändert werden soll.
   * @param zIndex Der neue zIndex-Wert (höhere Werte = weiter oben).
   */
  private async _setZIndex(layer: Layer, zIndex: number): Promise<Layer> {
    if (!layer) {
      console.warn('Ungültiger Layer.');
      return;
    }

    // Definiere einen Typ für deine Layer, der LayerProps und deine Custom Props kombiniert
    type CustomLayer = Layer & {
      props: LayerProps & { zIndex?: number };
    };

    const layers = this.deck.props.layers;
    if (!layers) return undefined;

    const updatedLayer = layer.clone({
      zIndex: zIndex,
    } as Partial<LayerProps> & {
      zIndex?: number;
    });

    this.deck.setProps({
      layers: layers.map((l: Layer) =>
        l.id === layer.id ? updatedLayer : l,
      ) as CustomLayer[],
    });

    const layersArray = this.deck.props.layers as Array<
      Layer & { props: { zIndex?: number } }
    >;

    layersArray.sort((a, b) => {
      const aZ = (a.props as { zIndex?: number }).zIndex || 0;
      const bZ = (b.props as { zIndex?: number }).zIndex || 0;
      return aZ - bZ;
    });

    this.deck.setProps({ layers: layersArray });
    return updatedLayer;
  }

  /**
   * Setzt die Sichtbarkeit für einen bestimmten Layer.
   * @param layer Der Layer, dessen Sichtbarkeit geändert werden soll.
   * @param visible Ob der Layer sichtbar sein soll (true/false).
   */
  private async _setVisible(layer: Layer, visible: boolean): Promise<Layer> {
    if (!layer) {
      console.warn('Ungültiger Layer.');
      return;
    }

    // Klone den Layer mit der neuen Sichtbarkeit
    const updatedLayer = layer.clone({ visible });

    // Aktualisiere die Layer in der Deck-Instanz
    const layers = this.deck.props.layers;
    if (!layers) return;

    const layersArray = Array.isArray(layers) ? layers : [layers];
    const updatedLayers = layersArray.map((l: Layer) =>
      l.id === layer.id ? updatedLayer : l,
    );

    this.deck.setProps({ layers: updatedLayers });
    return updatedLayer;
  }

  /**
   * Setzt die Opazität für einen bestimmten Layer.
   * @param layer Der Layer, dessen Opazität geändert werden soll.
   * @param opacity Die gewünschte Opazität (0.0 bis 1.0).
   */
  private async _setOpacity(layer: Layer, opacity: number): Promise<Layer> {
    //const { TileLayer } = await import('@deck.gl/geo-layers');

    if (!layer || opacity < 0 || opacity > 1) {
      console.warn('Ungültige Parameter für setOpacityForLayer.');
      return layer;
    }

    const updatedLayer: Layer = layer.clone({ opacity });

    // Aktualisiere die Layer in der Deck-Instanz
    const layers = this.deck.props.layers;
    if (!layers) return;

    const layersArray = Array.isArray(layers) ? layers : [layers];
    const updatedLayers = layersArray.map((l: Layer) =>
      l.id === layer.id ? updatedLayer : l,
    );

    this.deck.setProps({ layers: updatedLayers });
    return updatedLayer;
  }

  /**
   * Entfernt einen Layer aus der deck.gl-Instanz.
   * @param layer Der zu entfernende Layer.
   */
  private async _removeLayer(layer: Layer): Promise<void> {
    if (!layer) {
      console.warn('Ungültiger Layer.');
      return;
    }

    const layers = this.deck.props.layers;
    if (!layers) return;

    const layersArray = Array.isArray(layers) ? layers : [layers];
    const updatedLayers = layersArray.filter((l: Layer) => l.id !== layer.id);

    this.deck.setProps({ layers: updatedLayers });
  }

  async removeLayer(layerId: string): Promise<void> {
    if (!layerId) {
      return;
    }
    const layer = await this._getLayerById(layerId);
    if (layer) {
      await this._removeLayer(layer);
    }
  }

  async setOpacity(layerId: string, opacity: number): Promise<void> {
    if (!layerId) {
      return;
    }
    const layer = await this._getLayerById(layerId);
    if (layer) {
      await this._setOpacity(layer, opacity);
    }
  }

  async setZIndex(layerId: string, zIndex: number): Promise<void> {
    if (!layerId) {
      return;
    }
    const layer = await this._getLayerById(layerId);
    if (layer) {
      await this._setZIndex(layer, zIndex);
    }
  }

  async setVisible(layerId: string, visible: boolean): Promise<void> {
    if (!layerId) {
      return;
    }
    const layer = await this._getLayerById(layerId);
    if (layer) {
      await this._setVisible(layer, visible);
    }
  }

  getMap() {
    return this.deck;
  }
}
export default DeckProvider;
