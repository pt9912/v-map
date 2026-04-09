import { createSignal, For, onMount, Show } from 'solid-js';
import './Showcase.css';

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

const SENTINEL_URL =
  'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif';

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

export default function Showcase() {
  const [provider, setProvider] = createSignal<Provider>('ol');
  const [zoom, setZoom] = createSignal(11);
  const [geotiffUrl, setGeotiffUrl] = createSignal('');
  const [geotiffOpacity, setGeotiffOpacity] = createSignal(1.0);
  const [geojsonData, setGeojsonData] = createSignal('');
  const [brokenWmsActive, setBrokenWmsActive] = createSignal(false);
  const [logs, setLogs] = createSignal<LogEntry[]>([]);

  function addLog(msg: string, kind: 'info' | 'error' = 'info') {
    const ts = new Date().toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs(prev => [...prev.slice(-49), { ts, msg, kind }]);
  }

  function onMapReady() {
    addLog(`map-provider-ready (${provider()})`);
  }

  function onMapError(event: Event) {
    const detail = (event as CustomEvent<VMapErrorDetail>).detail;
    if (!detail) return;
    const target =
      event.target instanceof HTMLElement
        ? event.target.tagName.toLowerCase()
        : '?';
    addLog(`[${detail.type}] ${target}: ${detail.message}`, 'error');
  }

  onMount(async () => {
    try {
      localStorage.setItem('@pt9912/v-map:logLevel', 'debug');
    } catch {
      /* sandbox iframes may block storage */
    }
    await customElements.whenDefined('v-map');
    addLog('v-map custom elements registered');
  });

  return (
    <main>
      <h1>v-map + SolidStart</h1>
      <p class="lead">
        Reactive Demo: SolidStart rendert die Page-Shell via SSR,
        die v-map-Inhalte hydraten dann client-side. Jeder
        Steuerungs-Wert ist ein Solid-Signal — fine-grained,
        kein Virtual DOM.
      </p>

      <section class="controls">
        <div class="row">
          <label>
            Provider:
            <select
              value={provider()}
              onChange={e => {
                setProvider(e.currentTarget.value as Provider);
                addLog(`provider → ${e.currentTarget.value}`);
              }}
            >
              <option value="ol">OpenLayers</option>
              <option value="leaflet">Leaflet</option>
              <option value="deck">Deck.gl</option>
              <option value="cesium">Cesium</option>
            </select>
          </label>

          <label class="zoom-label">
            Zoom:
            <input
              type="range"
              min="2"
              max="18"
              step="1"
              value={zoom()}
              onInput={e => setZoom(Number(e.currentTarget.value))}
            />
            <span class="zoom-value">{zoom()}</span>
          </label>
        </div>

        <div class="row">
          <strong>GeoTIFF:</strong>
          <button
            onClick={() => {
              setGeotiffUrl(SENTINEL_URL);
              addLog(`GeoTIFF: ${SENTINEL_URL}`);
            }}
            title="large external COG sample"
          >
            Sentinel-2 RGB
          </button>
          <button
            class="secondary"
            onClick={() => {
              setGeotiffUrl('');
              addLog('GeoTIFF hidden');
            }}
          >
            Hide
          </button>
        </div>
        <div class="row hint">
          External COG sample, gestreamed via HTTP-Range-Requests.
        </div>

        <div class="row">
          <label>
            Opacity:
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={geotiffOpacity()}
              onInput={e => setGeotiffOpacity(Number(e.currentTarget.value))}
            />
            {geotiffOpacity().toFixed(1)}
          </label>
        </div>

        <div class="row">
          <strong>GeoJSON:</strong>
          <button
            onClick={() => {
              setGeojsonData(POINT_GEOJSON);
              addLog('GeoJSON: point');
            }}
          >
            Point
          </button>
          <button
            onClick={() => {
              setGeojsonData(POLYGON_GEOJSON);
              addLog('GeoJSON: polygon');
            }}
          >
            Polygon
          </button>
          <button
            class="secondary"
            onClick={() => {
              setGeojsonData('');
              addLog('GeoJSON cleared');
            }}
          >
            Clear
          </button>
        </div>

        <div class="row">
          <strong>Error API:</strong>
          <button
            class="danger"
            onClick={() => {
              setBrokenWmsActive(prev => {
                const next = !prev;
                addLog(
                  next
                    ? 'Broken WMS layer added'
                    : 'Broken WMS layer removed',
                );
                return next;
              });
            }}
          >
            {brokenWmsActive()
              ? 'Remove broken WMS'
              : 'Add broken WMS layer'}
          </button>
          <span class="hint">
            Adds a layer with an unreachable URL — should produce a
            <code>vmap-error</code> event and a toast.
          </span>
        </div>
      </section>

      <section class="stage">
        <div class="map-container">
          <v-map
            id="map1"
            flavour={provider()}
            zoom={zoom()}
            center="11.576,48.137"
            on:map-provider-ready={onMapReady}
            on:vmap-error={onMapError}
            on:vmap-view-change={(e: Event) => {
              const d = (e as CustomEvent).detail;
              if (d) setZoom(Math.round(d.zoom));
            }}
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

            <Show when={geotiffUrl()}>
              <v-map-layergroup group-title="Raster">
                <v-map-layer-geotiff
                  id="geotiff-1"
                  label="GeoTIFF"
                  url={geotiffUrl()}
                  visible="true"
                  opacity={geotiffOpacity()}
                  nodata="0"
                  z-index="10"
                ></v-map-layer-geotiff>
              </v-map-layergroup>
            </Show>

            <Show when={geojsonData()}>
              <v-map-layergroup group-title="Vector">
                <v-map-layer-geojson
                  id="geojson-1"
                  label="GeoJSON"
                  geojson={geojsonData()}
                  z-index="100"
                ></v-map-layer-geojson>
              </v-map-layergroup>
            </Show>

            <Show when={brokenWmsActive()}>
              <v-map-layergroup group-title="Broken">
                <v-map-layer-wms
                  id="broken-wms"
                  label="Intentionally broken"
                  url="https://this-host-does-not-exist.invalid/wms"
                  layers="nope"
                  z-index="200"
                ></v-map-layer-wms>
              </v-map-layergroup>
            </Show>
          </v-map>
        </div>

        <aside class="log">
          <h2>
            Logs
            <button class="small secondary" onClick={() => setLogs([])}>
              Clear
            </button>
          </h2>
          <div class="log-entries">
            <For each={logs()}>
              {entry => (
                <div class={`log-entry log-${entry.kind}`}>
                  <span class="log-ts">{entry.ts}</span>
                  <span class="log-msg">{entry.msg}</span>
                </div>
              )}
            </For>
          </div>
        </aside>
      </section>
    </main>
  );
}
