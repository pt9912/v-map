import { LitElement, html, css, type PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';

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

const SENTINEL_URL =
  'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif';

/**
 * Showcase Lit element that hosts <v-map> as a child custom element.
 *
 * This is the WC ↔ WC interop story: Lit and v-map are *both* custom-
 * element libraries, and they cooperate without any wrappers because
 * the only contract between them is the DOM itself. Lit owns the
 * shadow root for the showcase chrome (controls, log panel); v-map
 * lives inside that shadow root as a regular child element with
 * regular HTML attributes for its props.
 *
 * IMPORTANT: We do NOT use Lit's `shadow: false` here. The whole
 * point is to demonstrate that Stencil-built custom elements work
 * inside a Lit shadow root unchanged.
 */
@customElement('vmap-showcase')
export class VmapShowcase extends LitElement {
  // ---- Reactive state -------------------------------------------------
  @state() private provider: Provider = 'ol';
  @state() private zoom = 11;
  @state() private geotiffUrl = '';
  @state() private geotiffOpacity = 1.0;
  @state() private geojsonData = '';
  @state() private brokenWmsActive = false;
  @state() private logs: LogEntry[] = [];

  // ---- Lifecycle ------------------------------------------------------
  override connectedCallback(): void {
    super.connectedCallback();
    // Enable debug logging for v-map (production build defaults to 'warn')
    try {
      localStorage.setItem('@pt9912/v-map:logLevel', 'debug');
    } catch {
      /* sandbox iframes may block storage */
    }

    // Wait for the Stencil loader (jsDelivr <script> in index.html) to
    // register the <v-map> tag, then log it. We don't have to do
    // anything else — Lit's render() loop will produce the right
    // markup whether v-map is registered or not, and the upgrade
    // happens transparently when customElements.define() runs.
    customElements.whenDefined('v-map').then(() => {
      this.addLog('v-map custom elements registered');
    });
  }

  // ---- Helpers --------------------------------------------------------
  private addLog(msg: string, kind: 'info' | 'error' = 'info') {
    const ts = new Date().toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    // Lit treats array reassignment as a state change; mutation in-
    // place would not trigger a re-render.
    this.logs = [...this.logs.slice(-49), { ts, msg, kind }];
  }

  private onProviderChange(e: Event) {
    this.provider = (e.target as HTMLSelectElement).value as Provider;
    this.addLog(`provider → ${this.provider}`);
  }

  private onZoomInput(e: Event) {
    this.zoom = Number((e.target as HTMLInputElement).value);
  }

  private onOpacityInput(e: Event) {
    this.geotiffOpacity = Number((e.target as HTMLInputElement).value);
  }

  private applyGeoTiff() {
    this.geotiffUrl = SENTINEL_URL;
    this.addLog(`GeoTIFF: ${SENTINEL_URL}`);
  }

  private hideGeoTiff() {
    this.geotiffUrl = '';
    this.addLog('GeoTIFF hidden');
  }

  private applyPointGeoJSON() {
    this.geojsonData = POINT_GEOJSON;
    this.addLog('GeoJSON: point');
  }

  private applyPolygonGeoJSON() {
    this.geojsonData = POLYGON_GEOJSON;
    this.addLog('GeoJSON: polygon');
  }

  private clearGeoJSON() {
    this.geojsonData = '';
    this.addLog('GeoJSON cleared');
  }

  private toggleBrokenWms() {
    this.brokenWmsActive = !this.brokenWmsActive;
    this.addLog(
      this.brokenWmsActive
        ? 'Broken WMS layer added'
        : 'Broken WMS layer removed',
    );
  }

  private clearLogs() {
    this.logs = [];
  }

  // ---- v-map event handlers -------------------------------------------
  private onMapReady = () => {
    this.addLog(`map-provider-ready (${this.provider})`);
  };

  // Programmatic listener for vmap-error events bubbling up from any
  // layer. The <v-map-error> child element above already renders the
  // toasts; this handler additionally pushes the error into the logs
  // panel.
  private onMapError = (event: Event) => {
    const detail = (event as CustomEvent<VMapErrorDetail>).detail;
    if (!detail) return;
    const target =
      event.target instanceof HTMLElement
        ? event.target.tagName.toLowerCase()
        : '?';
    this.addLog(`[${detail.type}] ${target}: ${detail.message}`, 'error');
  };

  // ---- Cross-shadow event listeners -----------------------------------
  // v-map's events have `composed: true`, so they cross shadow DOM
  // boundaries. We can attach listeners directly via `@map-provider-
  // ready` / `@vmap-error` template bindings — Lit handles the
  // composed-event piping for us.

  protected override updated(_changedProperties: PropertyValues): void {
    // No imperative DOM work needed: every prop on <v-map> is a real
    // HTML attribute, and Lit's reactive template re-renders them
    // automatically. v-map's @Watch handlers (added in 0.4.0) react
    // to the attribute changes from the previous render pass and
    // call setView() on the underlying provider.
  }

  // ---- Render ---------------------------------------------------------
  override render() {
    return html`
      <main>
        <h1>v-map + Lit</h1>
        <p class="lead">
          Reactive Demo: Lit und v-map sind beide
          Web-Components-Bibliotheken. Diese
          <code>&lt;vmap-showcase&gt;</code> ist ein Lit-Element, das
          <code>&lt;v-map&gt;</code> als Child rendert — kein Wrapper,
          keine Brücke, nur DOM.
        </p>

        <section class="controls">
          <div class="row">
            <label>
              Provider:
              <select .value=${this.provider} @change=${this.onProviderChange}>
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
                .value=${String(this.zoom)}
                @input=${this.onZoomInput}
              />
              <span class="zoom-value">${this.zoom}</span>
            </label>
          </div>

          <div class="row">
            <strong>GeoTIFF:</strong>
            <button @click=${this.applyGeoTiff} title="large external COG sample">
              Sentinel-2 RGB
            </button>
            <button class="secondary" @click=${this.hideGeoTiff}>Hide</button>
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
                .value=${String(this.geotiffOpacity)}
                @input=${this.onOpacityInput}
              />
              ${this.geotiffOpacity.toFixed(1)}
            </label>
          </div>

          <div class="row">
            <strong>GeoJSON:</strong>
            <button @click=${this.applyPointGeoJSON}>Point</button>
            <button @click=${this.applyPolygonGeoJSON}>Polygon</button>
            <button class="secondary" @click=${this.clearGeoJSON}>Clear</button>
          </div>

          <div class="row">
            <strong>Error API:</strong>
            <button class="danger" @click=${this.toggleBrokenWms}>
              ${this.brokenWmsActive
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
            <!--
              v-map is a child custom element. Lit binds the props as
              attributes (lower-case kebab) and event listeners with
              the @event syntax. Stencil events are dispatched with
              composed: true so they cross the shadow boundary and
              reach this Lit element.
            -->
            <v-map
              id="map1"
              flavour=${this.provider}
              zoom=${String(this.zoom)}
              center="11.576,48.137"
              @map-provider-ready=${this.onMapReady}
              @vmap-error=${this.onMapError}
            >
              <!-- Declarative error toast — no JavaScript needed for the UI side -->
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

              ${this.geotiffUrl
                ? html`
                    <v-map-layergroup group-title="Raster">
                      <v-map-layer-geotiff
                        id="geotiff-1"
                        label="GeoTIFF"
                        url=${this.geotiffUrl}
                        visible="true"
                        opacity=${String(this.geotiffOpacity)}
                        nodata="0"
                        z-index="10"
                      ></v-map-layer-geotiff>
                    </v-map-layergroup>
                  `
                : ''}

              ${this.geojsonData
                ? html`
                    <v-map-layergroup group-title="Vector">
                      <v-map-layer-geojson
                        id="geojson-1"
                        label="GeoJSON"
                        geojson=${this.geojsonData}
                        z-index="100"
                      ></v-map-layer-geojson>
                    </v-map-layergroup>
                  `
                : ''}

              ${this.brokenWmsActive
                ? html`
                    <v-map-layergroup group-title="Broken">
                      <v-map-layer-wms
                        id="broken-wms"
                        label="Intentionally broken"
                        url="https://this-host-does-not-exist.invalid/wms"
                        layers="nope"
                        z-index="200"
                      ></v-map-layer-wms>
                    </v-map-layergroup>
                  `
                : ''}
            </v-map>
          </div>

          <aside class="log">
            <h2>
              Logs
              <button class="small secondary" @click=${this.clearLogs}>
                Clear
              </button>
            </h2>
            <div class="log-entries">
              ${this.logs.map(
                entry => html`
                  <div class="log-entry log-${entry.kind}">
                    <span class="log-ts">${entry.ts}</span>
                    <span class="log-msg">${entry.msg}</span>
                  </div>
                `,
              )}
            </div>
          </aside>
        </section>
      </main>
    `;
  }

  // Lit's static styles — these get attached to the shadow root
  // automatically. We use a single block here to keep the demo close
  // to the other framework showcases.
  static override styles = css`
    :host {
      display: block;
      height: 100dvh;
      overflow: hidden;
      font-family: system-ui, sans-serif;
      background: #1a1a2e;
      color: #eee;
    }

    main {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1rem;
      height: 100%;
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
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'vmap-showcase': VmapShowcase;
  }
}
