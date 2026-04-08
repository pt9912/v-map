import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
} from '@angular/core';

// Mirrors src/utils/events.ts in v-map. The package exports types via
// `@npm9912/v-map/loader` but not via the bare `@npm9912/v-map`
// specifier yet, so we keep this small enough to inline.
interface VMapErrorDetail {
  type: 'network' | 'validation' | 'parse' | 'provider';
  message: string;
  attribute?: string;
  cause?: unknown;
}

type Provider = 'ol' | 'leaflet' | 'deck' | 'cesium';

interface LogEntry {
  ts: string;
  msg: string;
  kind: 'info' | 'error';
}

const GEOTIFF_SAMPLES = [
  {
    label: 'Local CEA Grayscale',
    url: '/geotiff/cea.tif',
    notes: 'small local sample, no external range requests',
  },
  {
    label: 'Sentinel-2 RGB',
    url: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif',
    notes: 'large external COG sample',
  },
] as const;

const POINT_GEOJSON = JSON.stringify({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'München' },
      geometry: { type: 'Point', coordinates: [11.576, 48.137] },
    },
  ],
});

const POLYGON_GEOJSON = JSON.stringify({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { name: 'Area' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [11.55, 48.12],
            [11.6, 48.12],
            [11.6, 48.15],
            [11.55, 48.15],
            [11.55, 48.12],
          ],
        ],
      },
    },
  ],
});

@Component({
  selector: 'app-root',
  standalone: true,
  // CUSTOM_ELEMENTS_SCHEMA tells the Angular template compiler to allow
  // unknown HTML tags (the v-map* custom elements). Without this Angular
  // throws a compile-time error like "v-map is not a known element".
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  // Angular signals - the modern reactive primitive (Angular 16+).
  // Each setter call automatically marks any template binding that
  // reads the signal as dirty.
  readonly provider = signal<Provider>('ol');
  readonly zoom = signal(11);
  readonly geotiffUrl = signal('');
  readonly geotiffOpacity = signal(1.0);
  readonly geojson = signal('');
  readonly brokenWmsActive = signal(false);
  readonly logs = signal<LogEntry[]>([]);

  readonly geotiffSamples = GEOTIFF_SAMPLES;

  constructor() {
    this.addLog('v-map custom elements registered');
  }

  addLog(msg: string, kind: LogEntry['kind'] = 'info') {
    const ts = new Date().toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    this.logs.update(prev => [...prev.slice(-49), { ts, msg, kind }]);
  }

  onProviderChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as Provider;
    this.provider.set(value);
  }

  onZoomChange(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    this.zoom.set(value);
  }

  onOpacityChange(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    this.geotiffOpacity.set(value);
  }

  applyGeoTiff(url: string) {
    this.geotiffUrl.set(url);
    this.addLog(`GeoTIFF: ${url}`);
  }

  clearGeoTiff() {
    this.geotiffUrl.set('');
    this.addLog('GeoTIFF cleared');
  }

  applyGeoJSON(data: string, label: string) {
    this.geojson.set(data);
    this.addLog(`GeoJSON: ${label}`);
  }

  applyPoint() {
    this.applyGeoJSON(POINT_GEOJSON, 'Point');
  }

  applyPolygon() {
    this.applyGeoJSON(POLYGON_GEOJSON, 'Polygon');
  }

  clearGeoJSON() {
    this.geojson.set('');
    this.addLog('GeoJSON cleared');
  }

  toggleBrokenWms() {
    this.brokenWmsActive.update(v => !v);
    this.addLog(
      this.brokenWmsActive() ? 'Broken WMS layer added' : 'Broken WMS layer removed',
    );
  }

  // Programmatic vmap-error listener bound declaratively in the template
  // via `(vmap-error)="onMapError($event)"`. Angular's template binding
  // works for any DOM event name, including hyphenated ones, so this is
  // the same ergonomics as Vue's @vmap-error and SvelteKit's onvmap-error.
  onMapError(event: Event) {
    const detail = (event as CustomEvent<VMapErrorDetail>).detail;
    if (!detail) return;
    const target =
      event.target instanceof HTMLElement ? event.target.tagName.toLowerCase() : '?';
    this.addLog(`[${detail.type}] ${target}: ${detail.message}`, 'error');
  }

  onMapReady() {
    this.addLog(`map-provider-ready (${this.provider()})`);
  }

  clearLogs() {
    this.logs.set([]);
  }
}
