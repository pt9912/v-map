import * as L from 'leaflet';
import { log, error } from '../../utils/logger';

export interface WCSGridLayerOptions extends L.GridLayerOptions {
  url: string;
  coverageName: string;
  version?: string;
  format?: string;
  projection?: string;
  params?: Record<string, string | number | boolean>;
}

/**
 * Custom Leaflet GridLayer for WCS (Web Coverage Service) support
 *
 * Supports:
 * - WCS 2.0.1 with subset parameters
 * - WCS 1.x.x with BBOX parameters (backward compatibility)
 * - GeoTIFF FLOAT32 format
 * - Dynamic BBOX-based requests
 */
export class WCSGridLayer extends L.GridLayer {
  private wcsOptions: WCSGridLayerOptions;

  constructor(options: WCSGridLayerOptions) {
    super(options);
    this.wcsOptions = {
      ...options,
      version: options.version ?? '2.0.1',
      format: options.format ?? 'image/tiff',
      projection: options.projection ?? 'EPSG:4326',
    };
  }

  /**
   * Build WCS GetCoverage URL for a given tile
   */
  private buildWCSUrl(coords: L.Coords): string {
    const { url, coverageName, version, format, projection, params } = this.wcsOptions;

    // Calculate tile bounds in lat/lng
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Leaflet private method not exposed in type definitions
    const tileBounds = (this as any)._tileCoordsToBounds(coords) as L.LatLngBounds;
    const southwest = tileBounds.getSouthWest();
    const northeast = tileBounds.getNorthEast();

    const minx = southwest.lng;
    const miny = southwest.lat;
    const maxx = northeast.lng;
    const maxy = northeast.lat;

    const baseParams: Record<string, string | number> = {
      SERVICE: 'WCS',
      REQUEST: 'GetCoverage',
      VERSION: version,
      FORMAT: format,
    };

    // WCS 2.0.1 uses subset parameters
    if (version.startsWith('2.0')) {
      baseParams.coverageId = coverageName;

      // Build URL with subset parameters
      // Note: We can't use the same param name twice in URLSearchParams,
      // so we'll manually construct the query string
      const extraParams = params ? { ...params } : {};
      const allParams = { ...baseParams, ...extraParams };

      // Add GeoTIFF compression if format is tiff
      if (format.includes('tiff') || format.includes('geotiff')) {
        allParams['geotiff:compression'] = 'LZW';
      }

      const query = new URLSearchParams();
      Object.entries(allParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.set(key, String(value));
        }
      });

      // Manually add subset parameters (can't use URLSearchParams for duplicate keys)
      const queryString = query.toString();
      const subsetX = `subset=X(${minx},${maxx})`;
      const subsetY = `subset=Y(${miny},${maxy})`;

      return `${url}${url.includes('?') ? '&' : '?'}${queryString}&${subsetX}&${subsetY}`;
    }
    // WCS 1.x.x uses BBOX parameter
    else {
      baseParams.COVERAGE = coverageName;
      baseParams.BBOX = `${minx},${miny},${maxx},${maxy}`;
      baseParams.CRS = projection;

      // Calculate width and height for the tile
      const tileSize = this.getTileSize();
      baseParams.WIDTH = typeof tileSize === 'number' ? tileSize : tileSize.x;
      baseParams.HEIGHT = typeof tileSize === 'number' ? tileSize : tileSize.y;

      const extraParams = params ? { ...params } : {};
      const allParams = { ...baseParams, ...extraParams };

      const query = new URLSearchParams();
      Object.entries(allParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.set(key, String(value));
        }
      });

      return `${url}${url.includes('?') ? '&' : '?'}${query.toString()}`;
    }
  }

  /**
   * Create tile element (required by GridLayer)
   */
  createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = document.createElement('img');
    const wcsUrl = this.buildWCSUrl(coords);

    log(`[WCS Tile] Loading tile at coords (${coords.x}, ${coords.y}, ${coords.z})`);
    log(`[WCS Tile] URL: ${wcsUrl}`);

    tile.onload = () => {
      done(null, tile);
    };

    tile.onerror = (err) => {
      error('[WCS Tile] Failed to load tile:', err);
      done(err instanceof Error ? err : new Error(String(err)), tile);
    };

    // Set crossOrigin for CORS support
    tile.crossOrigin = 'anonymous';
    tile.src = wcsUrl;

    return tile;
  }

  /**
   * Update WCS options and redraw
   */
  updateOptions(newOptions: Partial<WCSGridLayerOptions>): void {
    this.wcsOptions = {
      ...this.wcsOptions,
      ...newOptions,
    };
    this.redraw();
  }
}

/**
 * Factory function to create a WCS GridLayer
 */
export function createWCSGridLayer(
  options: WCSGridLayerOptions,
): WCSGridLayer {
  return new WCSGridLayer(options);
}
