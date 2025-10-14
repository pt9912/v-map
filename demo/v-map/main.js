// Demo für V-Map: Property/Slot-Updates ohne Storybook-Remount
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const logs = $('#logs');

const opts = {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  // 3 Dezimalstellen = Millisekunden
  fractionalSecondDigits: 3,
  hour12: false, // optional – 24‑Stunden‑Format
};

/**
 * Gibt die aktuelle Uhrzeit im Format HH:mm:ss.SSS zurück
 * (24‑Stunden‑Zeit, führende Nullen, Millisekunden).
 */
function getCurrentTimeInvariant() {
  const now = new Date();

  // Einzelne Bestandteile holen
  const h = String(now.getUTCHours()).padStart(2, '0'); // Stunden (UTC)
  const m = String(now.getUTCMinutes()).padStart(2, '0'); // Minuten
  const s = String(now.getUTCSeconds()).padStart(2, '0'); // Sekunden
  const ms = String(now.getUTCMilliseconds()).padStart(3, '0'); // Millisekunden

  // Zusammensetzen
  return `${h}:${m}:${s}.${ms}`;
}

function log(scope, msg, tagClass = 'tag-sys') {
  //  const now = new Date().toLocaleTimeString('de-DE', opts);
  //const now = new Date().toLocaleTimeString(opts);
  const now = getCurrentTimeInvariant();
  const el = document.createElement('div');
  el.className = 'log-entry';
  el.innerHTML = `<span class="tag ${tagClass}">${scope}</span><strong>${now}</strong> — ${msg}`;
  logs.appendChild(el);
  logs.scrollTop = logs.scrollHeight;
}

//http://127.0.0.1:5502/demo/v-map/?bundle=esm
//http://127.0.0.1:5502/demo/v-map/?loader=../../../www/build/v-map.esm.js
//http://127.0.0.1:5502/demo/v-map/?loader=../../../loader/index.es2017.js

async function ensureCustomElementsDefined() {
  log('sys', 'ensureCustomElementsDefined');
  const url = new URL(window.location.href);
  const bundle = url.searchParams.get('bundle') || 'loader'; // 'loader' | 'custom'
  const customLoader = url.searchParams.get('loader');

  // if (bundle === 'esm-es5') {
  //   await import('../../../dist/esm-es5/v-map.js');
  //   log('sys', 'dist esm-es5 geladen', 'tag-sys');
  //   return;
  // }

  if (bundle === 'esm') {
    await import('../../../dist/esm/v-map.js');
    log('sys', 'dist esm-es5 geladen', 'tag-sys');
    return;
  }

  if (bundle === 'vmap') {
    await import('../../../dist/v-map/v-map.js');
    log('sys', 'v-map geladen', 'tag-sys');
    return;
  }

  if (bundle === 'cjs') {
    await import('../../../dist/cjs/v-map.cjs.js');
    log('sys', 'cjs geladen', 'tag-sys');
    return;
  }

  if (bundle === 'custom') {
    // Dist-Custom-Elements: definiert CE direkt, KEIN Hydrator
    await import('../../../dist-custom-elements/index.js');
    log('sys', 'dist-custom-elements geladen', 'tag-sys');
    return;
  }

  // Standard: Loader/Hydrator
  if (customLoader) {
    const mod = await import(customLoader);
    mod.defineCustomElements?.();
    log('sys', 'defineCustomElements() via loader param', 'tag-sys');
    return;
  }

  let loader;
  loader = await import('../../../loader/index.es2017.js');
  loader.defineCustomElements?.();
  log('sys', 'defineCustomElements() aufgerufen', 'tag-sys');
}

async function createMap(flavour) {
  await customElements.whenDefined('v-map');

  const map = document.createElement('v-map');
  map.setAttribute('flavour', flavour);
  map.setAttribute('id', 'map1');
  map.style.display = 'block';
  map.style.width = '100%';
  map.style.height = '560px';

  //base layer
  const groupBaseMap = document.createElement('v-map-layergroup');
  groupBaseMap.setAttribute('group-title', 'Base-Layer');
  groupBaseMap.setAttribute('basemapid', 'OSM-1');

  //osm 1
  const layerOsm = document.createElement('v-map-layer-osm');
  layerOsm.setAttribute('id', 'OSM-1');
  layerOsm.setAttribute('label', 'OSM');
  layerOsm.setAttribute('z-index', '0');
  layerOsm.setAttribute('opacity', '1.0');
  groupBaseMap.appendChild(layerOsm);

  //osm de
  const layerOsmDe = document.createElement('v-map-layer-osm');
  layerOsmDe.setAttribute('id', 'OSM-DE');
  layerOsmDe.setAttribute('url', 'https://tile.openstreetmap.de/');
  layerOsmDe.setAttribute('label', 'OSM de');
  layerOsmDe.setAttribute('z-index', '0');
  layerOsmDe.setAttribute('opacity', '1.0');
  groupBaseMap.appendChild(layerOsmDe);

  map.appendChild(groupBaseMap);

  //raster group
  const groupRaster = document.createElement('v-map-layergroup');
  groupRaster.setAttribute('group-title', 'Raster-Layer');

  //geotiff
  const layerGeoTIFF = document.createElement('v-map-layer-geotiff');
  layerGeoTIFF.setAttribute('id', 'GEOTIFF-1');
  layerGeoTIFF.setAttribute('label', 'GeoTIFF');
  layerGeoTIFF.setAttribute('opacity', '1.0');
  layerGeoTIFF.setAttribute('z-index', '10');
  layerGeoTIFF.setAttribute('visible', 'false');
  layerGeoTIFF.setAttribute('nodata', '0');
  layerGeoTIFF.setAttribute(
    'url',
    'https://mikenunn.net/data/MiniScale_(std_with_grid)_R23.tif',
  );

  groupRaster.appendChild(layerGeoTIFF);
  map.appendChild(groupRaster);

  //wms
  const groupMap = document.createElement('v-map-layergroup');
  groupMap.setAttribute('group-title', 'WMS-Layer');

  const layerWms = document.createElement('v-map-layer-wms');
  layerWms.setAttribute('id', 'WMS-1');
  layerWms.setAttribute('url', 'https://ahocevar.com/geoserver/wms');
  layerWms.setAttribute(
    'layers',
    'opengeo:countries,ne:ne_10m_admin_0_boundary_lines_land,topp:states,ne:ne_10m_populated_places',
  );
  layerWms.setAttribute('label', 'WMS-ahocevar');
  layerWms.setAttribute('z-index', '20');
  layerWms.setAttribute('opacity', '1.0');
  groupMap.appendChild(layerWms);

  map.appendChild(groupMap);

  //geojson
  const group = document.createElement('v-map-layergroup');
  group.setAttribute('group-title', 'Vector-Layer');

  const layer = document.createElement('v-map-layer-geojson');
  layer.setAttribute('label', 'GeoJSON');
  layer.setAttribute('opacity', '1.0');
  layer.setAttribute('z-index', '100');

  const slotDiv = document.createElement('div');
  slotDiv.setAttribute('slot', 'geojson');

  layer.appendChild(slotDiv);
  group.appendChild(layer);
  map.appendChild(group);

  // Logs & Events
  map.addEventListener('map-provider-ready', e => {
    log('map', 'map-provider-ready', 'tag-map');
  });

  // Beobachter für Slot-Änderungen
  const mo = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'childList' || m.type === 'characterData') {
        log('slot', 'Slot-Content geändert', 'tag-slot');
      }
      if (m.type === 'attributes') {
        log('layer', `Attribut geändert: ${m.attributeName}`, 'tag-layer');
      }
    }
  });
  mo.observe(slotDiv, { childList: true, characterData: true, subtree: true });
  mo.observe(layer, { attributes: true });

  return { map, group, layer, layerOsm, slotDiv, layerGeoTIFF };
}

function setGeoTIFFUrl(layer, url) {
  if (url) {
    layer.setAttribute('url', url);
    layer.setAttribute('visible', 'true');
    $('#geotiffUrl').value = url;
    log('layer', 'GeoTIFF URL gesetzt: ' + url, 'tag-layer');
  } else {
    layer.removeAttribute('url');
    layer.setAttribute('visible', 'false');
    $('#geotiffUrl').value = '';
    log('layer', 'GeoTIFF Layer deaktiviert', 'tag-layer');
  }
}

function setGeoJSON({ mode, layer, slotDiv, data }) {
  if (mode === 'slot') {
    slotDiv.textContent = JSON.stringify(data);
    // optionales Ping falls eine Komponente auf 'slotchange' hört
    const ev = new Event('slotchange', { bubbles: true, composed: true });
    slotDiv.dispatchEvent(ev);
    log('slot', 'GeoJSON in Slot gesetzt', 'tag-slot');
  } else {
    // Property-Mode: direkt auf die CE-Instanz setzen
    layer.geojson = data;
    log('layer', 'layer.geojson (Property) gesetzt', 'tag-layer');
  }
}

function samplesGeoTIFF(kind) {
  switch (kind) {
    case 'geotiff1':
      // Sentinel-2 COG from AWS (used in OpenLayers examples)
      return 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif';
    case 'geotiff2':
      // OpenLayers test data (CORS-enabled)
      return 'https://openlayers.org/data/raster/no-overviews.tif';
    default:
      return '';
  }
}

function samples(kind) {
  switch (kind) {
    case 'point':
      return {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'München' },
            geometry: { type: 'Point', coordinates: [11.576124, 48.137154] },
          },
        ],
      };
    case 'line':
      return {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Sample Line' },
            geometry: {
              type: 'LineString',
              coordinates: [
                [11.56, 48.12],
                [11.57, 48.13],
                [11.58, 48.135],
              ],
            },
          },
        ],
      };
    case 'polygon':
      return {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { name: 'Sample Polygon' },
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
      };
    case 'cluster':
      const features = [];
      for (let i = 0; i < 200; i++) {
        const dx = (Math.random() - 0.5) * 0.2;
        const dy = (Math.random() - 0.5) * 0.2;
        features.push({
          type: 'Feature',
          properties: { i },
          geometry: {
            type: 'Point',
            coordinates: [11.576124 + dx, 48.137154 + dy],
          },
        });
      }
      return { type: 'FeatureCollection', features };
    default:
      return { type: 'FeatureCollection', features: [] };
  }
}

// ---- Resizer (drag to adjust sidebar width) ----
(function setupResizer() {
  const resizer = document.getElementById('resizer');
  if (resizer) {
    const root = document.documentElement;
    const STORAGE_KEY = 'vmap:logWidth';

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    // restore previous width
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      root.style.setProperty('--log-width', saved + 'px');
    }

    let startX = 0;
    let startW = 0;
    function onPointerMove(e) {
      const dx = e.clientX - startX;
      const newW = clamp(startW - dx, 240, 900); // invert because handle sits left of aside
      root.style.setProperty('--log-width', newW + 'px');
    }
    function onPointerUp() {
      document.getElementById('resizer')?.classList.remove('active');
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      // persist
      const widthPx = getComputedStyle(
        document.querySelector('.stage'),
      ).gridTemplateColumns.split(' ')[1];
      const parsed = parseFloat(widthPx);
      if (!Number.isNaN(parsed)) {
        localStorage.setItem(STORAGE_KEY, String(parsed));
      }
    }
    resizer.addEventListener('pointerdown', e => {
      startX = e.clientX;
      // compute current sidebar width
      const cols = getComputedStyle(
        document.querySelector('.stage'),
      ).gridTemplateColumns.split(' ');
      startW = parseFloat(cols[1]); // second column
      resizer.classList.add('active');
      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    });
    // double-click to toggle widths
    resizer.addEventListener('dblclick', () => {
      const current = parseFloat(
        getComputedStyle(
          document.querySelector('.stage'),
        ).gridTemplateColumns.split(' ')[1],
      );
      const next = current < 360 ? 480 : 320;
      root.style.setProperty('--log-width', next + 'px');
      localStorage.setItem(STORAGE_KEY, String(next));
    });
  }
})();

async function main() {
  console.log('main');

  await ensureCustomElementsDefined();

  const host = $('#map-host');
  let { map, group, layer, layerOsm, slotDiv, layerGeoTIFF } = await createMap(
    $('#flavour').value,
  );
  host.appendChild(map);

  // Initial GeoJSON im Textfeld
  const init = samples('point');
  $('#geojsonInput').value = JSON.stringify(init, null, 2);
  setGeoJSON({ mode: 'slot', layer, slotDiv, data: init });

  // UI Bindings
  $('#flavour').addEventListener('change', async e => {
    const flavour = e.target.value;
    log('map', 'Flavour gewechselt → ' + flavour, 'tag-map');
    if (true) {
      map.setAttribute('flavour', flavour);
    } else {
      // Map neu aufbauen, Layer & Slot bleiben frisch
      host.innerHTML = '';
      ({ map, group, layer, layerOsm, slotDiv, layerGeoTIFF } = await createMap(
        flavour,
      ));
      host.appendChild(map);
      // Aktuelles GeoJSON wieder setzen
      try {
        const data = JSON.parse($('#geojsonInput').value);
        setGeoJSON({
          mode: $('input[name="mode"]:checked').value,
          layer,
          slotDiv,
          data,
        });
      } catch {}
    }
  });

  $$('#samplePointBtn')[0].addEventListener('click', () => {
    const init = samples('point');
    $('#geojsonInput').value = JSON.stringify(init, null, 2);
    setGeoJSON({ mode: 'slot', layer, slotDiv, data: init });
  });

  $$('#sampleLineBtn')[0].addEventListener('click', () => {
    const init = samples('line');
    $('#geojsonInput').value = JSON.stringify(init, null, 2);
    setGeoJSON({ mode: 'slot', layer, slotDiv, data: init });
  });

  $$('#samplePolygonBtn')[0].addEventListener('click', () => {
    const init = samples('polygon');
    $('#geojsonInput').value = JSON.stringify(init, null, 2);
    setGeoJSON({ mode: 'slot', layer, slotDiv, data: init });
  });

  $$('#sampleClusterBtn')[0].addEventListener('click', () => {
    const init = samples('cluster');
    $('#geojsonInput').value = JSON.stringify(init, null, 2);
    setGeoJSON({ mode: 'slot', layer, slotDiv, data: init });
  });

  // GeoTIFF Controls
  $('#sampleGeoTiffBtn1').addEventListener('click', () => {
    const url = samplesGeoTIFF('geotiff1');
    setGeoTIFFUrl(layerGeoTIFF, url);
  });

  $('#sampleGeoTiffBtn2').addEventListener('click', () => {
    const url = samplesGeoTIFF('geotiff2');
    setGeoTIFFUrl(layerGeoTIFF, url);
  });

  $('#applyGeoTiffBtn').addEventListener('click', () => {
    const url = $('#geotiffUrl').value.trim();
    if (url) {
      setGeoTIFFUrl(layerGeoTIFF, url);
    }
  });

  $('#clearGeoTiffBtn').addEventListener('click', () => {
    setGeoTIFFUrl(layerGeoTIFF, null);
  });

  $$('#applyBtn')[0].addEventListener('click', () => {
    const mode = $('input[name="mode"]:checked').value;
    try {
      const data = JSON.parse($('#geojsonInput').value);
      setGeoJSON({ mode, layer, slotDiv, data });
      $('#status').textContent = 'OK';
      $('#status').style.color = 'var(--ok)';
    } catch (err) {
      $('#status').textContent = 'Invalid JSON';
      $('#status').style.color = 'var(--err)';
    }
  });

  $('#validateBtn').addEventListener('click', () => {
    try {
      JSON.parse($('#geojsonInput').value);
      $('#status').textContent = 'Valid JSON';
      $('#status').style.color = 'var(--ok)';
    } catch (e) {
      $('#status').textContent = 'Invalid JSON';
      $('#status').style.color = 'var(--err)';
    }
  });

  $('#slotPingBtn').addEventListener('click', () => {
    const ev = new Event('slotchange', { bubbles: true, composed: true });
    slotDiv.dispatchEvent(ev);
    log('slot', 'slotchange manuell ausgelöst', 'tag-slot');
  });

  $('#resetBtn').addEventListener('click', async () => {
    log('sys', 'Reset Map angefordert', 'tag-sys');
    host.innerHTML = '';
    ({ map, group, layer, layerOsm, slotDiv, layerGeoTIFF } = await createMap(
      $('#flavour').value,
    ));
    host.appendChild(map);
    try {
      const data = JSON.parse($('#geojsonInput').value);
      setGeoJSON({
        mode: $('input[name="mode"]:checked').value,
        layer,
        slotDiv,
        data,
      });
    } catch {}
  });

  // Clear logs
  document.getElementById('clearLogsBtn')?.addEventListener('click', () => {
    const container = document.getElementById('logs');
    if (container) container.innerHTML = '';
  });

  // Optional: Lifecycle-Console passthrough
  const origLog = console.log;
  console.log = (...args) => {
    try {
      const first = String(args[0] ?? '');
      if (first.includes('v-map') || first.includes('v-map-layer')) {
        let tag = first.includes('v-map-layer') ? 'tag-layer' : 'tag-map';
        if (first.includes('v-map-layergroup')) {
          tag = 'tag-group';
        }
        if (first.includes('v-map - provider ')) {
          tag = 'tag-map-provider';
        }
        log(
          'console',
          args
            .map(x => (typeof x === 'string' ? x : JSON.stringify(x)))
            .join(' '),
          tag,
        );
      } else {
        origLog(...args);
      }
    } catch {
      origLog(...args);
    }
  };
}

main().catch(err => {
  log('sys', 'Fatal: ' + err.message, 'tag-sys');
});
