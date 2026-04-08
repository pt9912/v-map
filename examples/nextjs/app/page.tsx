'use client';

// 'use client' is essential: this page touches the DOM (custom elements,
// addEventListener, customElements.whenDefined). Next.js' App Router
// defaults every component to server, so without this directive Next.js
// would try to prerender the page on the server with no DOM available
// and fail at build time.

import { useEffect, useRef, useState } from 'react';
import './page.css';

// Mirrors src/utils/events.ts in v-map. The package exports types via
// `@npm9912/v-map/loader` but not via the bare `@npm9912/v-map`
// specifier yet, so we keep this small enough to inline.
type VMapErrorDetail = {
  type: 'network' | 'validation' | 'parse' | 'provider';
  message: string;
  attribute?: string;
  cause?: unknown;
};

type Provider = 'ol' | 'leaflet' | 'deck' | 'cesium';

type LogEntry = {
  ts: string;
  msg: string;
  kind: 'info' | 'error';
};

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

export default function Page() {
  const [provider, setProvider] = useState<Provider>('ol');
  const [zoom, setZoom] = useState(11);
  const [geotiffUrl, setGeotiffUrl] = useState('');
  const [geotiffOpacity, setGeotiffOpacity] = useState(1.0);
  const [geojson, setGeojson] = useState('');
  const [brokenWmsActive, setBrokenWmsActive] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [ready, setReady] = useState(false);

  const mapRef = useRef<HTMLElement>(null);

  function addLog(msg: string, kind: LogEntry['kind'] = 'info') {
    const ts = new Date().toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs(prev => [...prev.slice(-49), { ts, msg, kind }]);
  }

  // Wait for v-map custom elements to be defined before rendering the
  // <v-map> tree. The <script type="module"> in app/layout.tsx loads
  // them async, so on first paint they may not be registered yet.
  useEffect(() => {
    let cancelled = false;
    customElements.whenDefined('v-map').then(() => {
      if (cancelled) return;
      setReady(true);
      addLog('v-map custom elements registered');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Programmatic vmap-error listener. Same pattern as the React (Vite)
  // example: useEffect + ref + addEventListener. Hyphenated event names
  // like vmap-error work the same way regardless of bundler.
  useEffect(() => {
    if (!ready) return;
    const map = mapRef.current;
    if (!map) return;

    const onError = (event: Event) => {
      const detail = (event as CustomEvent<VMapErrorDetail>).detail;
      if (!detail) return;
      const target =
        event.target instanceof HTMLElement
          ? event.target.tagName.toLowerCase()
          : '?';
      addLog(`[${detail.type}] ${target}: ${detail.message}`, 'error');
    };

    const onReady = () => addLog(`map-provider-ready (${provider})`);

    map.addEventListener('vmap-error', onError);
    map.addEventListener('map-provider-ready', onReady);

    return () => {
      map.removeEventListener('vmap-error', onError);
      map.removeEventListener('map-provider-ready', onReady);
    };
  }, [ready, provider]);

  function applyGeoTiff(url: string) {
    setGeotiffUrl(url);
    addLog(`GeoTIFF: ${url}`);
  }

  function applyGeoJSON(data: string, label: string) {
    setGeojson(data);
    addLog(`GeoJSON: ${label}`);
  }

  function toggleBrokenWms() {
    setBrokenWmsActive(prev => {
      addLog(prev ? 'Broken WMS layer removed' : 'Broken WMS layer added');
      return !prev;
    });
  }

  return (
    <main>
      <h1>v-map + Next.js</h1>
      <p className="lead">
        Reactive Demo: jeder Steuerungs-Wert ist React-State und fließt direkt
        als Prop in die <code>&lt;v-map&gt;</code>-Komponenten unten. Das
        ganze ist eine <code>&apos;use client&apos;</code> Component im
        Next.js App Router.
      </p>

      <section className="controls">
        <div className="row">
          <label>
            Provider:
            <select
              value={provider}
              onChange={e => setProvider(e.target.value as Provider)}
            >
              <option value="ol">OpenLayers</option>
              <option value="leaflet">Leaflet</option>
              <option value="deck">Deck.gl</option>
              <option value="cesium">Cesium</option>
            </select>
          </label>

          <label className="zoom-label">
            Zoom:
            <input
              type="range"
              min={2}
              max={18}
              step={1}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
            />
            <span className="zoom-value">{zoom}</span>
          </label>
        </div>

        <div className="row">
          <strong>GeoTIFF:</strong>
          {GEOTIFF_SAMPLES.map(sample => (
            <button
              key={sample.url}
              onClick={() => applyGeoTiff(sample.url)}
              title={sample.notes}
            >
              {sample.label}
            </button>
          ))}
          <button
            className="secondary"
            onClick={() => {
              setGeotiffUrl('');
              addLog('GeoTIFF cleared');
            }}
          >
            Clear
          </button>
        </div>

        <div className="row">
          <label>
            Opacity:
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={geotiffOpacity}
              onChange={e => setGeotiffOpacity(Number(e.target.value))}
            />
            {geotiffOpacity.toFixed(1)}
          </label>
        </div>

        <div className="row">
          <strong>GeoJSON:</strong>
          <button onClick={() => applyGeoJSON(POINT_GEOJSON, 'Point')}>
            Point
          </button>
          <button onClick={() => applyGeoJSON(POLYGON_GEOJSON, 'Polygon')}>
            Polygon
          </button>
          <button
            className="secondary"
            onClick={() => {
              setGeojson('');
              addLog('GeoJSON cleared');
            }}
          >
            Clear
          </button>
        </div>

        <div className="row">
          <strong>Error API:</strong>
          <button className="danger" onClick={toggleBrokenWms}>
            {brokenWmsActive ? 'Remove broken WMS' : 'Add broken WMS layer'}
          </button>
          <span className="hint">
            Adds a layer with an unreachable URL — should produce a{' '}
            <code>vmap-error</code> event and a toast.
          </span>
        </div>
      </section>

      <section className="stage">
        <div className="map-container">
          {ready && (
            <v-map
              ref={mapRef}
              flavour={provider}
              zoom={String(zoom)}
              center="11.576,48.137"
              id="map1"
            >
              <v-map-error
                position="bottom-right"
                auto-dismiss="6000"
              ></v-map-error>

              <v-map-layergroup group-title="Base" basemapid="osm-base">
                <v-map-layer-osm
                  id="osm-base"
                  label="OpenStreetMap"
                  z-index="0"
                ></v-map-layer-osm>
              </v-map-layergroup>

              {geotiffUrl && (
                <v-map-layergroup group-title="Raster">
                  <v-map-layer-geotiff
                    id="geotiff-1"
                    label="GeoTIFF"
                    url={geotiffUrl}
                    visible
                    opacity={geotiffOpacity}
                    nodata="0"
                    z-index="10"
                  ></v-map-layer-geotiff>
                </v-map-layergroup>
              )}

              {geojson && (
                <v-map-layergroup group-title="Vector">
                  <v-map-layer-geojson
                    id="geojson-1"
                    label="GeoJSON"
                    geojson={geojson}
                    z-index="100"
                  ></v-map-layer-geojson>
                </v-map-layergroup>
              )}

              {brokenWmsActive && (
                <v-map-layergroup group-title="Broken">
                  <v-map-layer-wms
                    id="broken-wms"
                    label="Intentionally broken"
                    url="https://this-host-does-not-exist.invalid/wms"
                    layers="nope"
                    z-index="200"
                  ></v-map-layer-wms>
                </v-map-layergroup>
              )}
            </v-map>
          )}
        </div>

        <aside className="log">
          <h2>
            Logs
            <button className="small secondary" onClick={() => setLogs([])}>
              Clear
            </button>
          </h2>
          <div className="log-entries">
            {logs.map((entry, i) => (
              <div key={i} className={`log-entry log-${entry.kind}`}>
                <span className="log-ts">{entry.ts}</span>
                <span className="log-msg">{entry.msg}</span>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}
