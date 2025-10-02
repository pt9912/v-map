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

  // ========== Enhanced Styling Helper Methods ==========

  /**
   * Convert a Geostyler style to Deck.gl style configuration
   */
  private createGeostylerDeckGLStyle(geostylerStyle: any) {
    // Helper to extract static value from GeoStyler property
    const getValue = (prop: any, defaultValue: any = undefined) => {
      if (prop === undefined || prop === null) return defaultValue;
      // If it's a GeoStyler function object, we can't evaluate it here - return default
      if (typeof prop === 'object' && prop.name) return defaultValue;
      return prop;
    };

    const defaultFillColor: [number, number, number, number] = [0, 100, 255, 76];
    const defaultStrokeColor: [number, number, number, number] = [0, 100, 255, 255];
    const defaultPointColor: [number, number, number, number] = [0, 100, 255, 255];

    let fillColorValue = defaultFillColor;
    let strokeColorValue = defaultStrokeColor;
    let pointColorValue = defaultPointColor;
    let pointRadiusValue = 8;
    let lineWidthValue = 2;

    // Extract styles from rules
    if (geostylerStyle.rules) {
      for (const rule of geostylerStyle.rules) {
        if (rule.symbolizers) {
          for (const symbolizer of rule.symbolizers) {
            switch (symbolizer.kind) {
              case 'Fill':
                const fillColor = getValue(symbolizer.color, 'rgba(0,100,255,0.3)') as string;
                const fillOpacity = getValue(symbolizer.opacity, 0.3) as number;
                fillColorValue = this.parseColor(fillColor, defaultFillColor);
                if (fillOpacity !== undefined) {
                  fillColorValue = this.applyOpacity(fillColorValue, fillOpacity);
                }

                const outlineColor = getValue(symbolizer.outlineColor) as string | undefined;
                if (outlineColor) {
                  strokeColorValue = this.parseColor(outlineColor, defaultStrokeColor);
                }
                const outlineWidth = getValue(symbolizer.outlineWidth, 1) as number;
                if (outlineWidth !== undefined) {
                  lineWidthValue = outlineWidth;
                }
                break;

              case 'Line':
                const lineColor = getValue(symbolizer.color, 'rgba(0,100,255,1)') as string;
                strokeColorValue = this.parseColor(lineColor, defaultStrokeColor);
                const lineWidth = getValue(symbolizer.width, 2) as number;
                if (lineWidth !== undefined) {
                  lineWidthValue = lineWidth;
                }
                break;

              case 'Mark':
                const markColor = getValue(symbolizer.color, 'rgba(0,100,255,1)') as string;
                pointColorValue = this.parseColor(markColor, defaultPointColor);
                const markRadius = getValue(symbolizer.radius, 6) as number;
                if (markRadius !== undefined) {
                  pointRadiusValue = markRadius;
                }
                break;

              case 'Icon':
                // Icon handling would require custom IconLayer implementation
                // For now, we'll use Mark as fallback
                const iconSize = getValue(symbolizer.size, 32) as number;
                if (iconSize !== undefined) {
                  pointRadiusValue = iconSize / 2; // Convert size to radius
                }
                break;
            }
          }
        }
      }
    }

    return {
      getFillColor: () => fillColorValue,
      getLineColor: () => strokeColorValue,
      getPointRadius: () => pointRadiusValue,
      getPointFillColor: () => pointColorValue,
      lineWidthMinPixels: lineWidthValue,
      pointRadiusMinPixels: 2,
      pointRadiusMaxPixels: 100,
    };
  }

  /**
   * Convert CSS color to Deck.gl RGBA array
   */
  private parseColor(color: string | undefined, defaultColor: [number, number, number, number]): [number, number, number, number] {
    if (!color) return defaultColor;

    // Handle hex colors
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return [r, g, b, 255];
    }

    // Handle rgba/rgb colors
    const rgbaMatch = color.match(/rgba?\(([^)]+)\)/);
    if (rgbaMatch) {
      const values = rgbaMatch[1].split(',').map(v => parseFloat(v.trim()));
      return [
        values[0] || 0,
        values[1] || 0,
        values[2] || 0,
        values[3] !== undefined ? Math.round(values[3] * 255) : 255
      ];
    }

    return defaultColor;
  }

  /**
   * Apply opacity to color array
   */
  private applyOpacity(color: [number, number, number, number], opacity: number): [number, number, number, number] {
    return [color[0], color[1], color[2], Math.round(opacity * 255)];
  }

  /**
   * Create Deck.gl style configuration from StyleConfig
   */
  private createDeckGLStyle(style: any = {}) {
    // Default colors
    const defaultFillColor: [number, number, number, number] = [0, 100, 255, 76];
    const defaultStrokeColor: [number, number, number, number] = [0, 100, 255, 255];
    const defaultPointColor: [number, number, number, number] = [0, 100, 255, 255];

    // Parse colors
    const fillColor = this.parseColor(style.fillColor, defaultFillColor);
    const strokeColor = this.parseColor(style.strokeColor, defaultStrokeColor);
    const pointColor = this.parseColor(style.pointColor, defaultPointColor);

    // Apply opacity
    const finalFillColor = style.fillOpacity !== undefined
      ? this.applyOpacity(fillColor, style.fillOpacity)
      : fillColor;

    const finalStrokeColor = style.strokeOpacity !== undefined
      ? this.applyOpacity(strokeColor, style.strokeOpacity)
      : strokeColor;

    const finalPointColor = style.pointOpacity !== undefined
      ? this.applyOpacity(pointColor, style.pointOpacity)
      : pointColor;

    return {
      getFillColor: (feature: any) => {
        // Apply conditional styling if styleFunction exists
        if (style.styleFunction) {
          const conditionalStyle = style.styleFunction(feature);
          if (conditionalStyle.fillColor) {
            const conditionalFillColor = this.parseColor(conditionalStyle.fillColor, finalFillColor);
            return conditionalStyle.fillOpacity !== undefined
              ? this.applyOpacity(conditionalFillColor, conditionalStyle.fillOpacity)
              : conditionalFillColor;
          }
        }
        return finalFillColor;
      },

      getLineColor: (feature: any) => {
        if (style.styleFunction) {
          const conditionalStyle = style.styleFunction(feature);
          if (conditionalStyle.strokeColor) {
            const conditionalStrokeColor = this.parseColor(conditionalStyle.strokeColor, finalStrokeColor);
            return conditionalStyle.strokeOpacity !== undefined
              ? this.applyOpacity(conditionalStrokeColor, conditionalStyle.strokeOpacity)
              : conditionalStrokeColor;
          }
        }
        return finalStrokeColor;
      },

      getPointRadius: (feature: any) => {
        if (style.styleFunction) {
          const conditionalStyle = style.styleFunction(feature);
          if (conditionalStyle.pointRadius !== undefined) {
            return conditionalStyle.pointRadius;
          }
        }
        return style.pointRadius ?? 8;
      },

      getPointFillColor: (feature: any) => {
        if (style.styleFunction) {
          const conditionalStyle = style.styleFunction(feature);
          if (conditionalStyle.pointColor) {
            const conditionalPointColor = this.parseColor(conditionalStyle.pointColor, finalPointColor);
            return conditionalStyle.pointOpacity !== undefined
              ? this.applyOpacity(conditionalPointColor, conditionalStyle.pointOpacity)
              : conditionalPointColor;
          }
        }
        return finalPointColor;
      },

      lineWidthMinPixels: style.strokeWidth ?? 2,
      pointRadiusMinPixels: 2,
      pointRadiusMaxPixels: 100,
    };
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

  private async buildGoogleTileLayer(
    cfg: Extract<LayerConfig, { type: 'google' }>,
    layerId: string,
  ): Promise<Layer> {
    if (!cfg.apiKey) {
      throw new Error("Google-Layer benötigt 'apiKey' (Google Maps Platform).");
    }

    // Load Google Maps JavaScript API
    await this.loadGoogleMapsApi(cfg.apiKey, {
      language: cfg.language,
      region: cfg.region,
      libraries: cfg.libraries,
    });

    // For deck.gl, we'll use a simplified approach with TileLayer
    // that uses Google Static Maps API for better compatibility
    const { TileLayer } = await import('@deck.gl/geo-layers');
    const { BitmapLayer } = await import('@deck.gl/layers');

    const mapType = cfg.mapType || 'roadmap';
    const googleMapTypeId = this.getGoogleMapTypeId(mapType);

    return new TileLayer({
      id: layerId,
      data: ['placeholder'], // Will be overridden by getTileData
      opacity: cfg.opacity ?? 1,
      visible: cfg.visible ?? true,
      minZoom: 0,
      maxZoom: cfg.maxZoom ?? 19,
      tileSize: 256,

      getTileData: async ({ index }: any) => {
        const { x, y, z } = index;

        // Build Google Static Maps API URL for this tile
        const tilingScheme = { tileXYToNativeRectangle: (x: number, y: number, level: number) => {
          const n = Math.pow(2, level);
          const lonLeft = (x / n) * 360 - 180;
          const lonRight = ((x + 1) / n) * 360 - 180;
          const latBottom = Math.atan(Math.sinh(Math.PI * (1 - 2 * (y + 1) / n))) * 180 / Math.PI;
          const latTop = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI;
          return { west: lonLeft, south: latBottom, east: lonRight, north: latTop };
        }};

        const rect = tilingScheme.tileXYToNativeRectangle(x, y, z);
        const centerLat = (rect.south + rect.north) / 2;
        const centerLng = (rect.west + rect.east) / 2;

        const params = new URLSearchParams({
          center: `${centerLat},${centerLng}`,
          zoom: z.toString(),
          size: '256x256',
          scale: cfg.scale === 'scaleFactor1x' ? '1' : '2',
          maptype: googleMapTypeId,
          key: cfg.apiKey,
          format: 'png'
        });

        if (cfg.language) params.set('language', cfg.language);
        if (cfg.region) params.set('region', cfg.region);

        const url = `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;

        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.blob();
        } catch (error) {
          console.warn('Failed to load Google tile:', error);
          return null;
        }
      },

      renderSubLayers: (sl: any) => {
        const { data, tile } = sl;
        if (!data) return null;

        const { west, south, east, north } = tile.bbox;
        return new BitmapLayer({
          id: `${layerId}-bitmap-${tile.index.x}-${tile.index.y}-${tile.index.z}`,
          image: data,
          bounds: [west, south, east, north],
          opacity: sl.opacity ?? 1,
        });
      },

      onTileLoad: () => {
        // Add Google logo for compliance when first tile loads
        this.ensureGoogleLogo(this.target);
      },
    });
  }

  private getGoogleMapTypeId(mapType: string): string {
    switch (mapType) {
      case 'roadmap': return 'roadmap';
      case 'satellite': return 'satellite';
      case 'terrain': return 'terrain';
      case 'hybrid': return 'hybrid';
      default: return 'roadmap';
    }
  }

  /**
   * Load Google Maps JavaScript API
   */
  private async loadGoogleMapsApi(
    apiKey: string,
    opts?: { language?: string; region?: string; libraries?: string[] },
  ): Promise<void> {
    if ((window as any).google?.maps) return;

    await new Promise<void>((resolve, reject) => {
      const cbName = '___deckGoogleInit___' + Math.random().toString(36).slice(2);
      (window as any)[cbName] = () => resolve();

      const script = document.createElement('script');
      const params = new URLSearchParams({
        key: apiKey,
        callback: cbName,
        v: 'weekly',
      });
      if (opts?.language) params.set('language', opts.language);
      if (opts?.region) params.set('region', opts.region);
      if (opts?.libraries?.length)
        params.set('libraries', opts.libraries.join(','));

      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
      script.async = true;
      script.onerror = () =>
        reject(new Error('Google Maps JS API failed to load'));
      document.head.appendChild(script);
    });
  }

  /**
   * Add Google logo for compliance
   */
  private ensureGoogleLogo(container: HTMLElement): void {
    if ((container as any)._googleLogoAdded) return;

    const logo = document.createElement('img');
    logo.src = 'https://developers.google.com/static/maps/documentation/images/google_on_white.png';
    logo.alt = 'Google';
    logo.style.position = 'absolute';
    logo.style.bottom = '6px';
    logo.style.left = '6px';
    logo.style.height = '18px';
    logo.style.pointerEvents = 'none';
    logo.style.zIndex = '1000';

    container.appendChild(logo);
    (container as any)._googleLogoAdded = true;
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

    let geojson_or_url = null;
    if (config.geojson) {
      geojson_or_url = JSON.parse(config.geojson);
    } else {
      geojson_or_url = config.url;
    }
    if (geojson_or_url) {
      // Use geostyler style if available, otherwise use default style
      let deckStyle: any;

      if ((config as any).geostylerStyle) {
        deckStyle = this.createGeostylerDeckGLStyle((config as any).geostylerStyle);
      } else {
        deckStyle = this.createDeckGLStyle(config.style);
      }

      layer = new GeoJsonLayer({
        id: layerId,
        data: geojson_or_url,
        filled: true,
        stroked: true,
        pointType: 'circle',
        pickable: true,

        // Enhanced styling
        ...deckStyle,

        opacity: config.opacity ?? 1,
        visible: config.visible ?? true,

        // Update triggers for dynamic styling
        updateTriggers: {
          getFillColor: [config.style, (config as any).geostylerStyle],
          getLineColor: [config.style, (config as any).geostylerStyle],
          getPointRadius: [config.style, (config as any).geostylerStyle],
          data: [config.geojson, config.url],
        },
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
      case 'google':
        return this.buildGoogleTileLayer(
          layerConfig as Extract<LayerConfig, { type: 'google' }>,
          layerId,
        );
      case 'wms':
        return this.buildWmsTileLayer(
          layerConfig as Extract<LayerConfig, { type: 'wms' }>,
          layerId,
        );
      case 'xyz':
        return this.buildXyzTileLayer(layerConfig as any, layerId);
      case 'scatterplot':
        return this.buildScatterPlot(layerConfig as any, layerId);
      case 'wkt':
        return this.createWKTLayer(layerConfig as any, layerId);
      case 'geotiff':
        return this.createGeoTIFFLayer(layerConfig as any, layerId);
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
      case 'google': {
        // Google maps updates would require rebuilding the layer
        // as tile URLs are constructed dynamically
        if (update.data?.mapType || update.data?.apiKey) {
          // For now, log that Google updates aren't fully supported
          console.warn('Google Maps layer updates require full layer recreation');
        }
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
      case 'wkt': {
        const data = update.data?.wkt
          ? this.wktToGeoJSON(update.data.wkt)
          : update.data?.url;
        if (data) group.setModelOverrides(layerId, { data });
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

  private async createWKTLayer(
    config: Extract<LayerConfig, { type: 'wkt' }>,
    layerId: string,
  ): Promise<Layer> {
    let geoJsonData = null;

    if (config.wkt) {
      geoJsonData = this.wktToGeoJSON(config.wkt);
    } else if (config.url) {
      try {
        const response = await fetch(config.url);
        if (!response.ok) throw new Error(`Failed to fetch WKT: ${response.status}`);
        const wktText = await response.text();
        geoJsonData = this.wktToGeoJSON(wktText);
      } catch (e) {
        log('Failed to load WKT from URL:', e);
        geoJsonData = { type: 'FeatureCollection', features: [] };
      }
    } else {
      geoJsonData = { type: 'FeatureCollection', features: [] };
    }

    const { GeoJsonLayer } = await import('@deck.gl/layers');

    // Use geostyler style if available, otherwise use default style
    let deckStyle: any;

    if ((config as any).geostylerStyle) {
      deckStyle = this.createGeostylerDeckGLStyle((config as any).geostylerStyle);
    } else {
      deckStyle = this.createDeckGLStyle(config.style);
    }

    return new GeoJsonLayer({
      id: layerId,
      data: geoJsonData,
      filled: true,
      stroked: true,
      pointType: 'circle',
      pickable: true,

      // Enhanced styling
      ...deckStyle,

      opacity: config.opacity ?? 1,
      visible: config.visible ?? true,

      // Update triggers for dynamic styling
      updateTriggers: {
        getFillColor: [config.style, (config as any).geostylerStyle],
        getLineColor: [config.style, (config as any).geostylerStyle],
        getPointRadius: [config.style, (config as any).geostylerStyle],
        data: [config.wkt, config.url],
      },
    });
  }

  private wktToGeoJSON(wkt: string): any {
    const s = wkt.trim().toUpperCase();

    if (s.startsWith('POINT')) {
      const inside = wkt
        .substring(wkt.indexOf('(') + 1, wkt.lastIndexOf(')'))
        .trim();
      const [x, y] = inside.split(/[\s]+/).map(parseFloat);
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [x, y] },
        properties: {},
      };
    }

    if (s.startsWith('LINESTRING')) {
      const inside = wkt
        .substring(wkt.indexOf('(') + 1, wkt.lastIndexOf(')'))
        .trim();
      const coords = inside
        .split(',')
        .map(p => p.trim().split(/[\s]+/).map(parseFloat));
      return {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: coords },
        properties: {},
      };
    }

    if (s.startsWith('POLYGON')) {
      const inside = wkt
        .substring(wkt.indexOf('(') + 1, wkt.lastIndexOf(')'))
        .trim();
      const rings = inside.split('),(').map(r => r.replace(/[()]/g, '').trim());
      const coords = rings.map(r =>
        r.split(',').map(p => p.trim().split(/[\s]+/).map(parseFloat)),
      );
      return {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: coords },
        properties: {},
      };
    }

    // If unrecognized WKT format, return empty FeatureCollection
    return { type: 'FeatureCollection', features: [] };
  }

  private async createGeoTIFFLayer(
    config: Extract<LayerConfig, { type: 'geotiff' }>,
    layerId: string,
  ): Promise<Layer> {
    if (!config.url) {
      throw new Error('GeoTIFF layer requires a URL');
    }

    try {
      // Using BitmapLayer for basic GeoTIFF display
      // For more advanced GeoTIFF support, consider using deck.gl-raster or similar
      const { BitmapLayer } = await import('@deck.gl/layers');

      // For now, we'll create a basic bitmap layer
      // Note: This assumes the GeoTIFF can be displayed directly as an image
      // For COG (Cloud Optimized GeoTIFF) support, you might want to use
      // specialized libraries like deck.gl-raster

      const layer = new BitmapLayer({
        id: layerId,
        image: config.url,
        bounds: [
          // Default bounds - ideally these should come from GeoTIFF metadata
          -180, -85.051129, 180, 85.051129
        ],
        opacity: config.opacity ?? 1.0,
        visible: config.visible ?? true,
        parameters: {
          depthTest: false,
        },
      });

      return layer;
    } catch (error) {
      log('v-map - provider - deck - Failed to create GeoTIFF layer:', error);

      // Return a placeholder/empty layer in case of error
      const { GeoJsonLayer } = await import('@deck.gl/layers');
      return new GeoJsonLayer({
        id: layerId,
        data: { type: 'FeatureCollection', features: [] },
        opacity: 0,
      });
    }
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
