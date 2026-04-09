<script setup lang="ts">
// Disable server-side rendering for this page. v-map is a Stencil-
// built custom-element bundle: it needs `window`, `document`, and the
// browser `customElements` registry, none of which exist in Nuxt's
// SSR sandbox. With ssr: false, Nuxt prerenders an empty shell at
// build time and the entire page hydrates client-side.
definePageMeta({
  ssr: false,
});

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

const provider = ref<Provider>('ol');
const zoom = ref(11);
const geotiffUrl = ref('');
const geotiffOpacity = ref(1.0);
const geojsonData = ref('');
const brokenWmsActive = ref(false);
const logs = ref<LogEntry[]>([]);

const GEOTIFF_SAMPLES = [
  {
    label: 'Sentinel-2 RGB',
    url: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif',
    notes: 'large external COG sample',
  },
];

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

function addLog(msg: string, kind: 'info' | 'error' = 'info') {
  const ts = new Date().toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  logs.value = [...logs.value.slice(-49), { ts, msg, kind }];
}

function applyGeoTiff(url: string) {
  geotiffUrl.value = url;
  addLog(`GeoTIFF: ${url}`);
}

function hideGeoTiff() {
  geotiffUrl.value = '';
  addLog('GeoTIFF hidden');
}

function applyGeoJSON(data: string) {
  geojsonData.value = data;
  addLog('GeoJSON applied');
}

function clearGeoJSON() {
  geojsonData.value = '';
  addLog('GeoJSON cleared');
}

function triggerBrokenWms() {
  brokenWmsActive.value = !brokenWmsActive.value;
  addLog(
    brokenWmsActive.value ? 'Broken WMS layer added' : 'Broken WMS layer removed',
  );
}

function onMapReady() {
  addLog(`map-provider-ready (${provider.value})`);
}

// Programmatic listener for vmap-error events bubbling up from any
// layer. The <v-map-error> child also renders the toasts; this handler
// additionally pushes the error into the logs panel.
function onMapError(event: Event) {
  const detail = (event as CustomEvent<VMapErrorDetail>).detail;
  if (!detail) return;
  const target =
    event.target instanceof HTMLElement
      ? event.target.tagName.toLowerCase()
      : '?';
  addLog(`[${detail.type}] ${target}: ${detail.message}`, 'error');
}

onMounted(async () => {
  // Enable debug logging for v-map (production build defaults to 'warn')
  try {
    localStorage.setItem('@pt9912/v-map:logLevel', 'debug');
  } catch {
    /* sandbox iframes may block storage */
  }

  // v-map is loaded via a <script type="module"> tag in nuxt.config /
  // app.head (see below) instead of being bundled through Vite. We
  // wait for customElements to be defined so the rest of the page can
  // rely on them being upgraded.
  await customElements.whenDefined('v-map');
  addLog('v-map custom elements registered');
});

// Inject the jsDelivr loader into <head>. Nuxt's useHead is reactive
// and resolves to a real <script> tag in the prerendered shell, which
// is exactly what we want — the browser starts fetching v-map.esm.js
// before Vue even hydrates the page.
useHead({
  title: 'v-map Nuxt Demo',
  script: [
    {
      // Pin the version explicitly so the demo behaves identically
      // across deploys; bump in lockstep with v-map releases.
      src: 'https://cdn.jsdelivr.net/npm/@npm9912/v-map@0.4.4/dist/v-map/v-map.esm.js',
      type: 'module',
      // Stencil's lazy loader uses import.meta.url to find its sibling
      // *.entry.js chunks; if a bundler ingests the loader, that URL
      // ends up under /_nuxt/... and Stencil 404s on every layer
      // chunk. The CDN script tag dodges this entirely.
    },
  ],
});
</script>

<template>
  <main>
    <h1>v-map + Nuxt 4</h1>
    <p class="lead">
      Reactive Demo: jeder Steuerungs-Wert ist eine Vue
      <code>ref()</code>, die direkt als Prop an die
      <code>&lt;v-map&gt;</code>-Komponenten unten fließt. Nuxt rendert
      die Page-Shell statisch (via <code>nuxt generate</code>), die v-map-
      Inhalte hydraten dann client-side.
    </p>

    <section class="controls">
      <div class="row">
        <label>
          Provider:
          <select v-model="provider">
            <option value="ol">OpenLayers</option>
            <option value="leaflet">Leaflet</option>
            <option value="deck">Deck.gl</option>
            <option value="cesium">Cesium</option>
          </select>
        </label>

        <label class="zoom-label">
          Zoom:
          <input v-model.number="zoom" type="range" min="2" max="18" step="1" />
          <span class="zoom-value">{{ zoom }}</span>
        </label>
      </div>

      <div class="row">
        <strong>GeoTIFF:</strong>
        <button
          v-for="sample in GEOTIFF_SAMPLES"
          :key="sample.url"
          :title="sample.notes"
          @click="applyGeoTiff(sample.url)"
        >
          {{ sample.label }}
        </button>
        <button class="secondary" @click="hideGeoTiff">Hide</button>
      </div>
      <div class="row hint">
        External COG sample, gestreamed via HTTP-Range-Requests.
      </div>

      <div class="row">
        <label>
          Opacity:
          <input
            v-model.number="geotiffOpacity"
            type="range"
            min="0"
            max="1"
            step="0.1"
          />
          {{ geotiffOpacity.toFixed(1) }}
        </label>
      </div>

      <div class="row">
        <strong>GeoJSON:</strong>
        <button @click="applyGeoJSON(POINT_GEOJSON)">Point</button>
        <button @click="applyGeoJSON(POLYGON_GEOJSON)">Polygon</button>
        <button class="secondary" @click="clearGeoJSON">Clear</button>
      </div>

      <div class="row">
        <strong>Error API:</strong>
        <button class="danger" @click="triggerBrokenWms">
          {{ brokenWmsActive ? 'Remove broken WMS' : 'Add broken WMS layer' }}
        </button>
        <span class="hint">
          Adds a layer with an unreachable URL — should produce a
          <code>vmap-error</code> event and a toast.
        </span>
      </div>
    </section>

    <section class="stage">
      <div class="map-container">
        <!--
          v-map is a custom element. We declared it in
          nuxt.config.ts → vue.compilerOptions.isCustomElement so Vue
          treats <v-map> and every <v-map-*> as native HTML instead of
          trying to resolve them as components.

          Note: kebab-case attributes (like `auto-dismiss`) work
          directly because Vue passes them through verbatim for custom
          elements. Boolean and Number attribute values are also
          coerced to strings on the way out, which is what Stencil's
          @Prop reflectors expect.
        -->
        <v-map
          id="map1"
          :flavour="provider"
          :zoom="zoom"
          center="11.576,48.137"
          @map-provider-ready="onMapReady"
          @vmap-error="onMapError"
        >
          <!-- Declarative error toast — no JavaScript needed for the UI side -->
          <v-map-error position="bottom-right" auto-dismiss="6000"></v-map-error>

          <v-map-layergroup group-title="Base" basemapid="osm-base">
            <v-map-layer-osm id="osm-base" label="OpenStreetMap" z-index="0"></v-map-layer-osm>
          </v-map-layergroup>

          <v-map-layergroup v-if="geotiffUrl" group-title="Raster">
            <v-map-layer-geotiff
              id="geotiff-1"
              label="GeoTIFF"
              :url="geotiffUrl"
              :visible="true"
              :opacity="geotiffOpacity"
              nodata="0"
              z-index="10"
            ></v-map-layer-geotiff>
          </v-map-layergroup>

          <v-map-layergroup v-if="geojsonData" group-title="Vector">
            <v-map-layer-geojson
              id="geojson-1"
              label="GeoJSON"
              :geojson="geojsonData"
              z-index="100"
            ></v-map-layer-geojson>
          </v-map-layergroup>

          <v-map-layergroup v-if="brokenWmsActive" group-title="Broken">
            <v-map-layer-wms
              id="broken-wms"
              label="Intentionally broken"
              url="https://this-host-does-not-exist.invalid/wms"
              layers="nope"
              z-index="200"
            ></v-map-layer-wms>
          </v-map-layergroup>
        </v-map>
      </div>

      <aside class="log">
        <h2>
          Logs
          <button class="small secondary" @click="logs = []">Clear</button>
        </h2>
        <div class="log-entries">
          <div
            v-for="(entry, i) in logs"
            :key="i"
            class="log-entry"
            :class="`log-${entry.kind}`"
          >
            <span class="log-ts">{{ entry.ts }}</span>
            <span class="log-msg">{{ entry.msg }}</span>
          </div>
        </div>
      </aside>
    </section>
  </main>
</template>

<style>
html,
body {
  margin: 0;
  height: 100%;
  overflow: hidden;
  font-family: system-ui, sans-serif;
  background: #1a1a2e;
  color: #eee;
}

#__nuxt,
#__nuxt > div {
  height: 100%;
}

main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  height: 100dvh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

h1 {
  font-size: 1.5rem;
  margin: 0 0 0.25rem;
}

.lead {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: #b8c2d9;
}

.controls {
  background: #16213e;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.row:last-child {
  margin-bottom: 0;
}

.zoom-label {
  margin-left: 1rem;
}

.zoom-value {
  display: inline-block;
  min-width: 1.5rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.hint {
  font-size: 0.8rem;
  color: #b8c2d9;
}

code {
  font-family: monospace;
  background: rgba(255, 255, 255, 0.06);
  padding: 0 0.25rem;
  border-radius: 3px;
}

.stage {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1rem;
  flex: 1;
  min-height: 0;
}

.map-container {
  border-radius: 8px;
  overflow: hidden;
}

v-map {
  display: block;
  width: 100%;
  height: 100%;
}

.log {
  background: #16213e;
  border-radius: 8px;
  padding: 0.75rem;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.log h2 {
  font-size: 0.9rem;
  margin: 0 0 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.log-entries {
  overflow-y: auto;
  flex: 1;
  font-size: 0.75rem;
  font-family: monospace;
}

.log-entry {
  padding: 2px 0;
  border-bottom: 1px solid #1a1a2e;
  display: flex;
  gap: 6px;
}

.log-ts {
  flex: none;
  color: #6c7fa1;
}

.log-msg {
  flex: 1 1 auto;
  word-break: break-word;
}

.log-error .log-msg {
  color: #ff8a8a;
}

button {
  background: #0f3460;
  color: #eee;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

button:hover {
  background: #1a4a8a;
}

button.secondary {
  background: #333;
}

button.danger {
  background: #7a1f1f;
}

button.danger:hover {
  background: #a02828;
}

button.small {
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
}

select,
input[type='range'] {
  background: #0a0a1a;
  color: #eee;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 0.3rem;
}

label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
}

strong {
  font-size: 0.85rem;
}
</style>
