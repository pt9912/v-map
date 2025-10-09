import * as L from 'leaflet';

import { error, log } from '../../utils/logger';

const CREATE_SESSION_URL = 'https://tile.googleapis.com/v1/createSession';
const TILE_URL_BASE = 'https://tile.googleapis.com/v1/2dtiles';
const ATTRIBUTION_URL = 'https://tile.googleapis.com/tile/v1/viewport';
const DEFAULT_MAX_ZOOM = 22;
const SESSION_REFRESH_BUFFER_MS = 60 * 1000;
const FALLBACK_TILE_SIZE = 256;

type ScaleFactor =
  | 'scaleFactor1x'
  | 'scaleFactor2x'
  | 'scaleFactor4x';

interface SessionTokenRequest {
  mapType: string;
  language: string;
  region: string;
  imageFormat?: string;
  scale?: ScaleFactor;
  highDpi?: boolean;
  layerTypes?: string[];
  overlay?: boolean;
  styles?: any[];
  apiOptions?: string[];
}

interface SessionTokenResponse {
  session: string;
  expiry: string;
  tileWidth: number;
  tileHeight: number;
  imageFormat: string;
}

interface GoogleMapTilesOptions {
  apiKey: string;
  mapType?: string;
  language?: string;
  region?: string;
  imageFormat?: string;
  scale?: ScaleFactor;
  highDpi?: boolean;
  layerTypes?: string[];
  overlay?: boolean;
  styles?: any[];
  apiOptions?: string[];
  maxZoom?: number;
  minZoom?: number;
  minNativeZoom?: number;
  maxNativeZoom?: number;
  opacity?: number;
  tileSize?: unknown;
  attribution?: unknown;
  bounds?: unknown;
  updateWhenIdle?: boolean;
  updateWhenZooming?: boolean;
  updateInterval?: number;
  className?: string;
  keepBuffer?: number;
  noWrap?: boolean;
  pane?: string;
  zIndex?: number;
  zoomOffset?: number;
  errorTileUrl?: string;
  subdomains?: unknown;
  tms?: boolean;
  detectRetina?: boolean;
  reuseTiles?: boolean;
  [key: string]: unknown;
}

export class GoogleMapTilesLayer extends L.GridLayer {
  private readonly apiKey: string;
  private readonly highDpi: boolean;
  private readonly sessionRequest: SessionTokenRequest;
  private readonly scaleFactor: number;

  private sessionToken?: string;
  private sessionPromise?: Promise<void>;
  private sessionRefreshId?: ReturnType<typeof setTimeout>;
  private previousViewport?: string;
  private currentAttribution?: string;
  private mapInstance?: L.Map;
  private readonly onMoveEnd: () => void;

  constructor(options: GoogleMapTilesOptions) {
    super();
    this.applyInitialGridOptions(options);

    const {
      apiKey,
      mapType,
      language,
      region,
      imageFormat,
      scale,
      highDpi,
      layerTypes,
      overlay,
      styles,
      apiOptions,
    } = options;

    if (!apiKey) {
      throw new Error('Google Map Tiles layer requires an apiKey');
    }

    this.apiKey = apiKey;
    this.highDpi =
      highDpi ?? (scale === undefined ? true : scale !== 'scaleFactor1x');
    this.scaleFactor = this.mapScaleToFactor(scale, this.highDpi);

    const request: SessionTokenRequest = {
      mapType: mapType ?? 'roadmap',
      language: language ?? 'en-US',
      region: region ?? 'US',
    };

    if (imageFormat) {
      request.imageFormat = imageFormat;
    }
    if (layerTypes?.length) {
      request.layerTypes = layerTypes;
    }
    if (apiOptions?.length) {
      request.apiOptions = apiOptions;
    }
    if (Array.isArray(styles) && styles.length > 0) {
      request.styles = styles;
    }
    if (overlay === true) {
      request.overlay = true;
    }

    const resolvedScale =
      scale ?? (this.scaleFactor > 1 ? this.factorToScale(this.scaleFactor) : undefined);
    if (resolvedScale) {
      request.scale = resolvedScale;
    }
    if (this.highDpi) {
      request.highDpi = true;
    }

    this.sessionRequest = request;
    this.onMoveEnd = () => {
      void this.updateAttribution();
    };

    this.sessionPromise = this.startSessionFetch();
  }

  onAdd(map: L.Map): this {
    this.mapInstance = map;
    map.on('moveend', this.onMoveEnd);
    map.on('zoomend', this.onMoveEnd);

    void this.ensureSession().then(() => this.updateAttribution());

    return super.onAdd(map);
  }

  onRemove(map: L.Map): this {
    map.off('moveend', this.onMoveEnd);
    map.off('zoomend', this.onMoveEnd);
    this.clearSessionRefresh();
    this.removeCurrentAttribution();
    this.mapInstance = undefined;
    return super.onRemove(map);
  }

  createTile(coords: L.Coords, done: L.DoneCallback): HTMLElement {
    const tile = document.createElement('img');
    tile.decoding = 'async';
    tile.alt = '';
    tile.crossOrigin = 'anonymous';

    const size = this.resolveTileSize();
    tile.width = size.x;
    tile.height = size.y;

    const handleError = (err: unknown) => {
      const message =
        err instanceof Error ? err.message : 'Google tile load error';
      done(new Error(message), tile);
    };

    tile.onload = () => done(null, tile);
    tile.onerror = (event) => {
      const err =
        event instanceof ErrorEvent
          ? event.error ?? new Error(event.message)
          : new Error('Google tile failed to load');
      handleError(err);
    };

    void this.ensureSession()
      .then(() => {
        if (!this.sessionToken) {
          handleError(new Error('Google Maps session unavailable'));
          return;
        }
        tile.src = this.buildTileUrl(coords);
      })
      .catch((err) => {
        handleError(err);
      });

    return tile;
  }

  private ensureSession(): Promise<void> {
    if (this.sessionToken) {
      return Promise.resolve();
    }
    if (!this.sessionPromise) {
      this.sessionPromise = this.startSessionFetch();
    }
    return this.sessionPromise;
  }

  private startSessionFetch(force: boolean = false): Promise<void> {
    if (this.sessionPromise && !force) {
      return this.sessionPromise;
    }

    const promise = this.fetchAndApplySession()
      .catch((err) => {
        const wrapped =
          err instanceof Error
            ? err
            : new Error('Failed to create Google Maps session');
        error('Google Map Tiles session error', wrapped);
        this.sessionToken = undefined;
        throw wrapped;
      })
      .finally(() => {
        if (this.sessionPromise === promise) {
          this.sessionPromise = undefined;
        }
      });

    this.sessionPromise = promise;
    return promise;
  }

  private async fetchAndApplySession(): Promise<void> {
    const url = `${CREATE_SESSION_URL}?key=${this.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.sessionRequest),
    });

    if (!response.ok) {
      let details: string | undefined;
      try {
        const body = await response.json();
        details = body?.error?.message;
      } catch {
        // ignore JSON parse errors
      }
      throw new Error(
        details ?? `Google Maps session request failed (${response.status})`,
      );
    }

    const data = (await response.json()) as SessionTokenResponse;

    this.sessionToken = data.session;
    this.applyTileSize(data);
    this.scheduleSessionRefresh(this.parseExpiry(data.expiry));

    if (this.mapInstance) {
      void this.updateAttribution();
      this.redrawLayer();
    }

    log('Google Map Tiles session established');
  }

  private scheduleSessionRefresh(expiryMs: number): void {
    if (!isFinite(expiryMs)) return;
    const refreshInMs = Math.max(
      expiryMs - Date.now() - SESSION_REFRESH_BUFFER_MS,
      1000,
    );
    this.clearSessionRefresh();
    this.sessionRefreshId = setTimeout(() => {
      void this.startSessionFetch(true).then(() => {
        if (this.mapInstance) {
          void this.updateAttribution();
          this.redrawLayer();
        }
      });
    }, refreshInMs);
  }

  private clearSessionRefresh(): void {
    if (this.sessionRefreshId !== undefined) {
      clearTimeout(this.sessionRefreshId);
      this.sessionRefreshId = undefined;
    }
  }

  private async updateAttribution(): Promise<void> {
    if (!this.mapInstance || !this.sessionToken) return;
    const bounds = this.mapInstance.getBounds();
    if (!bounds?.isValid()) return;

    const zoom = this.mapInstance.getZoom();
    const viewport = `zoom=${zoom}&north=${bounds.getNorth()}&south=${bounds.getSouth()}&east=${bounds.getEast()}&west=${bounds.getWest()}`;

    if (this.previousViewport === viewport) {
      return;
    }

    this.previousViewport = viewport;

    try {
      const response = await fetch(
        `${ATTRIBUTION_URL}?session=${this.sessionToken}&key=${this.apiKey}&${viewport}`,
      );
      if (!response.ok) {
        throw new Error(`Attribution request failed (${response.status})`);
      }
      const json = await response.json();
      const copyright = json?.copyright;
      if (typeof copyright === 'string' && copyright.length > 0) {
        this.applyAttribution(copyright);
      }
    } catch (err) {
      error('Failed to fetch Google attribution', err);
    }
  }

  private applyAttribution(value: string): void {
    const map = this.mapInstance;
    if (!map?.attributionControl) return;

    if (this.currentAttribution && this.currentAttribution !== value) {
      map.attributionControl.removeAttribution(this.currentAttribution);
    }
    if (!this.currentAttribution || this.currentAttribution !== value) {
      map.attributionControl.addAttribution(value);
      this.currentAttribution = value;
    }
  }

  private removeCurrentAttribution(): void {
    const map = this.mapInstance;
    if (!map?.attributionControl || !this.currentAttribution) return;
    map.attributionControl.removeAttribution(this.currentAttribution);
    this.currentAttribution = undefined;
  }

  private applyTileSize(data: SessionTokenResponse): void {
    const width = Math.max(
      1,
      Math.round(data.tileWidth / this.scaleFactor),
    );
    const height = Math.max(
      1,
      Math.round(data.tileHeight / this.scaleFactor),
    );

    const tileSize = L.point(width, height);
    this.setGridOptions({ tileSize });
  }

  private parseExpiry(expiry: string): number {
    const asInt = parseInt(expiry, 10);
    return Number.isFinite(asInt) ? asInt * 1000 : Number.NaN;
  }

  private buildTileUrl(coords: L.Coords): string {
    if (!this.sessionToken) {
      throw new Error('Google Maps session missing');
    }
    const z = coords.z;
    const x = coords.x;
    const y = coords.y;
    return `${TILE_URL_BASE}/${z}/${x}/${y}?session=${this.sessionToken}&key=${this.apiKey}`;
  }

  private mapScaleToFactor(
    scale: ScaleFactor | undefined,
    highDpi: boolean,
  ): number {
    switch (scale) {
      case 'scaleFactor4x':
        return 4;
      case 'scaleFactor2x':
        return 2;
      case 'scaleFactor1x':
        return 1;
      default:
        return highDpi ? 2 : 1;
    }
  }

  private factorToScale(factor: number): ScaleFactor | undefined {
    switch (factor) {
      case 4:
        return 'scaleFactor4x';
      case 2:
        return 'scaleFactor2x';
      case 1:
        return 'scaleFactor1x';
      default:
        return undefined;
    }
  }

  private applyInitialGridOptions(
    options: GoogleMapTilesOptions,
  ): void {
    const payload: Record<string, unknown> = {};
    const keys = [
      'attribution',
      'bounds',
      'className',
      'detectRetina',
      'errorTileUrl',
      'keepBuffer',
      'maxNativeZoom',
      'maxZoom',
      'minNativeZoom',
      'minZoom',
      'noWrap',
      'opacity',
      'pane',
      'reuseTiles',
      'subdomains',
      'tileSize',
      'tms',
      'updateInterval',
      'updateWhenIdle',
      'updateWhenZooming',
      'zIndex',
      'zoomOffset',
    ] as const;

    for (const key of keys) {
      const value = options[key as keyof GoogleMapTilesOptions];
      if (value !== undefined) {
        payload[key] = value;
      }
    }

    if (payload.maxZoom === undefined) {
      payload.maxZoom = DEFAULT_MAX_ZOOM;
    }

    this.setGridOptions(payload);
  }

  private setGridOptions(options: Record<string, unknown>): void {
    const setOptionsFn = (L.Util as any)?.setOptions;
    if (typeof setOptionsFn === 'function') {
      setOptionsFn(this, options);
    } else {
      (this as any).options = {
        ...(this as any).options,
        ...options,
      };
    }
  }

  private resolveTileSize(): L.Point {
    const raw = (this as any)?.options?.tileSize;
    if (raw && typeof raw === 'object') {
      if (Array.isArray(raw) && raw.length === 2) {
        const [x, y] = raw;
        return L.point(Number(x) || FALLBACK_TILE_SIZE, Number(y) || FALLBACK_TILE_SIZE);
      }
      if ('x' in raw && 'y' in raw) {
        return L.point(
          Number((raw as any).x) || FALLBACK_TILE_SIZE,
          Number((raw as any).y) || FALLBACK_TILE_SIZE,
        );
      }
    }
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      return L.point(raw, raw);
    }
    return L.point(FALLBACK_TILE_SIZE, FALLBACK_TILE_SIZE);
  }

  private redrawLayer(): void {
    const redraw = (this as any)?.redraw;
    if (typeof redraw === 'function') {
      redraw.call(this);
    }
  }
}
