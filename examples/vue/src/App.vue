<script setup lang="ts">
import { ref } from 'vue';

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

const provider = ref<Provider>('ol');
const zoom = ref(11);
const geotiffUrl = ref('');
const geotiffOpacity = ref(1.0);
const geojson = ref('');
const brokenWmsActive = ref(false);
const logs = ref<LogEntry[]>([]);

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

function addLog(msg: string, kind: LogEntry['kind'] = 'info') {
  const ts = new Date().toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  logs.value = [...logs.value.slice(-49), { ts, msg, kind }];
}

addLog('v-map custom elements registered');

function applyGeoTiff(url: string) {
  geotiffUrl.value = url;
  addLog(`GeoTIFF: ${url}`);
}

function applyGeoJSON(data: string, label: string) {
  geojson.value = data;
  addLog(`GeoJSON: ${label}`);
}

function toggleBrokenWms() {
  brokenWmsActive.value = !brokenWmsActive.value;
  addLog(brokenWmsActive.value ? 'Broken WMS layer added' : 'Broken WMS layer removed');
}

// Vue 3 binds DOM events declaratively via @event-name. For custom
// element events with hyphens like vmap-error, the @vmap-error syntax
// in the template below works directly — no useEffect / addEventListener
// dance required (unlike React 18).
function onMapError(event: Event) {
  const detail = (event as CustomEvent<VMapErrorDetail>).detail;
  if (!detail) return;
  const target = event.target instanceof HTMLElement ? event.target.tagName.toLowerCase() : '?';
  addLog(`[${detail.type}] ${target}: ${detail.message}`, 'error');
}

function onMapReady() {
  addLog(`map-provider-ready (${provider.value})`);
}

function onViewChange(event: Event) {
  const detail = (event as CustomEvent).detail;
  if (detail) zoom.value = Math.round(detail.zoom);
}
</script>

<template>
  <main>
    <h1>v-map + Vue 3</h1>
    <p class="lead">
      Reactive Demo: jeder Steuerungs-Wert ist ein Vue <code>ref()</code> und
      fließt über <code>v-bind</code> direkt als Prop in die
      <code>&lt;v-map&gt;</code>-Komponenten unten. Kein
      <code>map.setView()</code>, kein imperatives Layer-Adding.
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
          <input type="range" min="2" max="18" step="1" v-model.number="zoom" />
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
        <button
          class="secondary"
          @click="
            geotiffUrl = '';
            addLog('GeoTIFF cleared');
          "
        >
          Clear
        </button>
      </div>

      <div class="row">
        <label>
          Opacity:
          <input type="range" min="0" max="1" step="0.1" v-model.number="geotiffOpacity" />
          {{ geotiffOpacity.toFixed(1) }}
        </label>
      </div>

      <div class="row">
        <strong>GeoJSON:</strong>
        <button @click="applyGeoJSON(POINT_GEOJSON, 'Point')">Point</button>
        <button @click="applyGeoJSON(POLYGON_GEOJSON, 'Polygon')">Polygon</button>
        <button
          class="secondary"
          @click="
            geojson = '';
            addLog('GeoJSON cleared');
          "
        >
          Clear
        </button>
      </div>

      <div class="row">
        <strong>Error API:</strong>
        <button class="danger" @click="toggleBrokenWms">
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
        <v-map
          :flavour="provider"
          :zoom="zoom"
          center="11.576,48.137"
          id="map1"
          @vmap-error="onMapError"
          @map-provider-ready="onMapReady"
          @vmap-view-change="onViewChange"
        >
          <v-map-error position="bottom-right" auto-dismiss="6000"></v-map-error>

          <v-map-layergroup group-title="Base" basemapid="osm-base">
            <v-map-layer-osm id="osm-base" label="OpenStreetMap" z-index="0"></v-map-layer-osm>
          </v-map-layergroup>

          <v-map-layergroup v-if="geotiffUrl" group-title="Raster">
            <v-map-layer-geotiff
              id="geotiff-1"
              label="GeoTIFF"
              :url="geotiffUrl"
              :opacity="geotiffOpacity"
              visible
              nodata="0"
              z-index="10"
            ></v-map-layer-geotiff>
          </v-map-layergroup>

          <v-map-layergroup v-if="geojson" group-title="Vector">
            <v-map-layer-geojson
              id="geojson-1"
              label="GeoJSON"
              :geojson="geojson"
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

<style scoped>
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
  font-family: ui-monospace, Menlo, Consolas, monospace;
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
