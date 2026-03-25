// Demo für v-map-layer-terrain-geotiff
const $ = sel => document.querySelector(sel);

const logs = $('#logs');

function getCurrentTimeInvariant() {
  const now = new Date();
  const h = String(now.getUTCHours()).padStart(2, '0');
  const m = String(now.getUTCMinutes()).padStart(2, '0');
  const s = String(now.getUTCSeconds()).padStart(2, '0');
  const ms = String(now.getUTCMilliseconds()).padStart(3, '0');
  return `${h}:${m}:${s}.${ms}`;
}

function log(scope, msg, tagClass = 'tag-sys') {
  const now = getCurrentTimeInvariant();
  const el = document.createElement('div');
  el.className = 'log-entry';
  el.innerHTML = `<span class="tag ${tagClass}">${scope}</span><strong>${now}</strong> — ${msg}`;
  logs.appendChild(el);
  logs.scrollTop = logs.scrollHeight;
}

async function ensureCustomElementsDefined() {
  log('sys', 'Lade Stencil Loader...');
  const url = new URL(window.location.href);
  const customLoader = url.searchParams.get('loader');

  if (customLoader) {
    const mod = await import(customLoader);
    mod.defineCustomElements?.();
    log('sys', 'defineCustomElements() via loader param', 'tag-sys');
    return;
  }

  let loader;
  loader = await import('../../loader/index.es2017.js');
  loader.defineCustomElements?.();
  log('sys', 'defineCustomElements() aufgerufen', 'tag-sys');
}

async function createMap(provider) {
  await customElements.whenDefined('v-map');

  const map = document.createElement('v-map');
  map.setAttribute('flavour', provider);
  map.setAttribute('id', 'terrain-map');
  map.style.display = 'block';
  map.style.width = '100%';
  map.style.height = '600px';

  // Base Layer (OSM)
  const baseGroup = document.createElement('v-map-layergroup');
  baseGroup.setAttribute('group-title', 'Base Layer');
  baseGroup.setAttribute('basemapid', 'OSM-BASE');

  const osmLayer = document.createElement('v-map-layer-osm');
  osmLayer.setAttribute('id', 'OSM-BASE');
  osmLayer.setAttribute('label', 'OpenStreetMap');
  osmLayer.setAttribute('z-index', '0');
  osmLayer.setAttribute('opacity', '1.0');
  baseGroup.appendChild(osmLayer);
  map.appendChild(baseGroup);

  // Terrain Layer Group
  const terrainGroup = document.createElement('v-map-layergroup');
  terrainGroup.setAttribute('group-title', 'Terrain');

  const terrainLayer = document.createElement('v-map-layer-terrain-geotiff');
  terrainLayer.setAttribute('id', 'TERRAIN-1');
  terrainLayer.setAttribute('label', 'GeoTIFF Terrain');
  terrainLayer.setAttribute('opacity', '1.0');
  terrainLayer.setAttribute('z-index', '100');
  terrainLayer.setAttribute('elevation-scale', '1.0');
  terrainLayer.setAttribute('mesh-max-error', '4.0');
  terrainLayer.setAttribute('visible', 'false');

  terrainGroup.appendChild(terrainLayer);
  map.appendChild(terrainGroup);

  // Events
  map.addEventListener('map-provider-ready', () => {
    log('map', 'map-provider-ready', 'tag-map');
  });

  terrainLayer.addEventListener('ready', () => {
    log('terrain', 'Terrain-Layer ready', 'tag-layer');
  });

  return { map, terrainLayer };
}

function setTerrainUrl(layer, url) {
  if (url) {
    layer.setAttribute('url', url);
    layer.setAttribute('visible', 'true');
    $('#demUrl').value = url;
    log('terrain', 'URL gesetzt: ' + url, 'tag-layer');
  } else {
    layer.removeAttribute('url');
    layer.setAttribute('visible', 'false');
    $('#demUrl').value = '';
    log('terrain', 'Terrain deaktiviert', 'tag-layer');
  }
}

function getSampleUrl(kind) {
  switch (kind) {
    case 'local1':
      return './test-dems/i30dem.tif';
    case 'local2':
      return './test-dems/m30dem.tif';
    case 'online1':
      return 'https://s3.amazonaws.com/elevation-tiles-prod/geotiff/10/163/395.tif';
    case 'online2':
      // Alternative AWS terrain tile (different location)
      return 'https://s3.amazonaws.com/elevation-tiles-prod/geotiff/10/163/396.tif';
    default:
      return '';
  }
}

async function main() {
  console.log('Terrain GeoTIFF Demo');

  await ensureCustomElementsDefined();

  const host = $('#map-host');
  let { map, terrainLayer } = await createMap($('#provider').value);
  host.appendChild(map);

  // UI Bindings

  // Provider ändern
  $('#provider').addEventListener('change', async e => {
    const provider = e.target.value;
    log('map', 'Provider gewechselt → ' + provider, 'tag-map');
    host.innerHTML = '';
    ({ map, terrainLayer } = await createMap(provider));
    host.appendChild(map);
  });

  // URL anwenden
  $('#applyUrlBtn').addEventListener('click', () => {
    const url = $('#demUrl').value.trim();
    if (url) {
      setTerrainUrl(terrainLayer, url);
    }
  });

  // Sample URLs
  $('#sampleLocal1').addEventListener('click', () => {
    const url = getSampleUrl('local1');
    setTerrainUrl(terrainLayer, url);
  });

  $('#sampleLocal2').addEventListener('click', () => {
    const url = getSampleUrl('local2');
    setTerrainUrl(terrainLayer, url);
  });

  $('#sampleOnline1').addEventListener('click', () => {
    const url = getSampleUrl('online1');
    setTerrainUrl(terrainLayer, url);
  });

  $('#sampleOnline2').addEventListener('click', () => {
    const url = getSampleUrl('online2');
    setTerrainUrl(terrainLayer, url);
  });

  // Elevation Scale
  $('#elevationScale').addEventListener('input', e => {
    const value = e.target.value;
    terrainLayer.setAttribute('elevation-scale', value);
    $('#elevationValue').textContent = value;
    log('terrain', `elevationScale = ${value}`, 'tag-layer');
  });

  // Mesh Max Error
  $('#meshMaxError').addEventListener('input', e => {
    const value = e.target.value;
    terrainLayer.setAttribute('mesh-max-error', value);
    $('#meshMaxErrorValue').textContent = value;
    log('terrain', `meshMaxError = ${value}`, 'tag-layer');
  });

  // Wireframe
  $('#wireframe').addEventListener('change', e => {
    const enabled = e.target.checked;
    terrainLayer.setAttribute('wireframe', enabled ? 'true' : 'false');
    log('terrain', `wireframe = ${enabled}`, 'tag-layer');
  });

  // Opacity
  $('#opacity').addEventListener('input', e => {
    const value = e.target.value;
    terrainLayer.setAttribute('opacity', value);
    $('#opacityValue').textContent = value;
    log('terrain', `opacity = ${value}`, 'tag-layer');
  });

  // Download DEMs
  $('#downloadDems').addEventListener('click', async () => {
    const command = 'bash ../../scripts/download-test-dems.sh';

    try {
      await navigator.clipboard.writeText(command);
      log('sys', 'Download-Befehl in Zwischenablage kopiert', 'tag-sys');
      $('#status').textContent = `Kopiert: ${command}`;
      $('#status').style.color = 'var(--ok, #0f0)';
    } catch (err) {
      log(
        'sys',
        'Zwischenablage nicht verfügbar, manueller Download nötig',
        'tag-sys',
      );
      $('#status').textContent = `Bitte manuell ausführen: ${command}`;
      $('#status').style.color = 'var(--warn, #ffa500)';
    }
  });

  // Reset Map
  $('#resetMap').addEventListener('click', async () => {
    log('sys', 'Karte zurücksetzen...', 'tag-sys');
    host.innerHTML = '';
    ({ map, terrainLayer } = await createMap($('#provider').value));
    host.appendChild(map);
  });

  // Clear Logs
  $('#clearLogsBtn').addEventListener('click', () => {
    logs.innerHTML = '';
  });

  // Console passthrough für v-map Logs
  const origLog = console.log;
  console.log = (...args) => {
    try {
      const first = String(args[0] ?? '');
      if (first.includes('v-map') || first.includes('terrain')) {
        let tag = 'tag-sys';
        if (first.includes('terrain')) tag = 'tag-layer';
        if (first.includes('v-map - provider')) tag = 'tag-map';
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
  console.error(err);
});
