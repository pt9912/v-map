import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';

import '../v-map/v-map';
import '../v-map-layergroup/v-map-layergroup';
import '../v-map-layer-osm/v-map-layer-osm';
import '../v-map-layer-wms/v-map-layer-wms';
import { log } from '../../utils/logger';

const setupBuilder = () => {
  const builder = document.getElementById('builder') as HTMLElement;
  if (builder === null) {
    log('setupBuilder - builder is null.');
    return;
  }
  const ta = document.getElementById('ta') as HTMLTextAreaElement;
  const btn = document.getElementById('apply') as HTMLButtonElement;
  const logElem = document.getElementById('log') as HTMLDivElement;
  let cfg = document.getElementById('cfg') as HTMLElement;

  function logLine(msg) {
    log('logLine - ' + msg);
    const t = new Date().toLocaleTimeString();
    logElem.textContent += '[' + t + '] ' + msg + '\n';
    logElem.scrollTop = logElem.scrollHeight;
  }

  const onConfigReady = () => logLine('configReady');
  const onConfigError = (e: any) =>
    logLine('configError: ' + (e.detail?.message || 'unknown'));

  // Guard‑Variable
  if (!(builder as any).__listenersAttached) {
    builder.addEventListener('configReady', onConfigReady);
    builder.addEventListener('configError', onConfigError);
    (builder as any).__listenersAttached = true;
  }

  // initial textarea
  if (ta && !ta.value) ta.value = cfg.textContent?.trim() ?? '';

  btn?.addEventListener('click', () => {
    cfg.textContent = ta.value;
    const clone = cfg.cloneNode(true) as HTMLElement;
    cfg.replaceWith(clone);
    clone.id = 'cfg';
    cfg = clone;
  });
};

const defaultYaml = `map:
  flavour: ol
  zoom: 12
  center: "11.08,49.45"
  style: "height: 400px; width: 100%"
  layerGroups:
    - groupTitle: Basis-Layer
      visible: true
      layers:
        - id: osm
          type: osm
          zIndex: 0
          visible: true          
    - groupTitle: Daten
      visible: true
      layers:
        - id: wms1
          type: wms
          zIndex: 20
          url: https://ahocevar.com/geoserver/wms
          layers: opengeo:countries
          opacity: 0.7
          visible: true          
`;

const meta: Meta = {
  title: 'Builder/v-map-builder',
  args: { yaml: defaultYaml },
  argTypes: { yaml: { control: 'text' } },
};

export default meta;
type Story = StoryObj<{ yaml: string }>;

export const Playground: Story = {
  render: ({ yaml }) => (
    <div>
      <style>
        {`
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
        textarea{width:100%;height:400px;font-family:ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;}
        .log {
          /* Damit Zeilenumbrüche (\n) im Text sichtbar werden */
          white-space: pre-wrap;   /* oder pre-line */
          overflow-y: auto;        /* Scroll‑Leiste bei vielen Zeilen */
          max-height: 300px;       /* Beispielhöhe, nach Bedarf anpassen */
          padding: 0.5rem;
          background: #f8f8f8;
          border: 1px solid #ddd;
          font-family: monospace;
        }          
        v-map{display:block;border:1px dashed #bbb;min-height:320px;}
        `}
      </style>
      <div class="grid">
        <div>
          <textarea id="ta">{yaml}</textarea>
          <button id="apply">Apply</button>
          <div class="log" id="log"></div>
        </div>
        <div>
          <v-map-builder id="builder">
            <script slot="mapconfig" type="application/yaml" id="cfg">
              {yaml}
            </script>
          </v-map-builder>
        </div>
      </div>
      <script>{setupBuilder()}</script>
    </div>
  ),
};
