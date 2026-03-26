<script lang="ts">
	import { onMount } from 'svelte';

	let provider = $state<'ol' | 'leaflet' | 'deck' | 'cesium'>('deck');
	let geotiffUrl = $state('');
	let geotiffVisible = $state(false);
	let geotiffOpacity = $state(1.0);
	let geojsonData = $state('');
	let logs = $state<string[]>([]);

	const GEOTIFF_SAMPLES = [
		{ label: 'MiniScale UK', url: 'https://mikenunn.net/data/MiniScale_(std_with_grid)_R23.tif' },
		{ label: 'OpenLayers Test', url: 'https://openlayers.org/data/raster/no-overviews.tif' },
		{ label: 'Sentinel-2 RGB', url: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif' },
	];

	const GEOJSON_SAMPLES = {
		point: {
			type: 'FeatureCollection',
			features: [{ type: 'Feature', properties: { name: 'München' }, geometry: { type: 'Point', coordinates: [11.576, 48.137] } }],
		},
		polygon: {
			type: 'FeatureCollection',
			features: [{ type: 'Feature', properties: { name: 'Area' }, geometry: { type: 'Polygon', coordinates: [[[11.55, 48.12], [11.6, 48.12], [11.6, 48.15], [11.55, 48.15], [11.55, 48.12]]] } }],
		},
	};

	function addLog(msg: string) {
		const ts = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
		logs = [...logs.slice(-49), `${ts} — ${msg}`];
	}

	function applyGeoTiff(url: string) {
		geotiffUrl = url;
		geotiffVisible = true;
		addLog(`GeoTIFF: ${url}`);
	}

	function applyGeoJSON(data: object) {
		geojsonData = JSON.stringify(data);
		addLog('GeoJSON applied');
	}

	onMount(async () => {
		// Enable debug logging for v-map (production build defaults to 'warn')
		localStorage.setItem('@pt9912/v-map:logLevel', 'debug');

		const { defineCustomElements } = await import('@npm9912/v-map/loader');
		defineCustomElements();
		addLog('v-map custom elements registered');
	});

	function onMapReady() {
		addLog(`map-provider-ready (${provider})`);
	}
</script>

<svelte:head>
	<title>v-map SvelteKit Demo</title>
</svelte:head>

<main>
	<h1>v-map + SvelteKit</h1>

	<section class="controls">
		<div class="row">
			<label>
				Provider:
				<select bind:value={provider}>
					<option value="ol">OpenLayers</option>
					<option value="leaflet">Leaflet</option>
					<option value="deck">Deck.gl</option>
					<option value="cesium">Cesium</option>
				</select>
			</label>
		</div>

		<div class="row">
			<strong>GeoTIFF:</strong>
			{#each GEOTIFF_SAMPLES as sample}
				<button onclick={() => applyGeoTiff(sample.url)}>{sample.label}</button>
			{/each}
			<button class="secondary" onclick={() => { geotiffVisible = false; addLog('GeoTIFF hidden'); }}>Hide</button>
		</div>

		<div class="row">
			<label>
				Opacity:
				<input type="range" min="0" max="1" step="0.1" bind:value={geotiffOpacity} />
				{geotiffOpacity.toFixed(1)}
			</label>
		</div>

		<div class="row">
			<strong>GeoJSON:</strong>
			<button onclick={() => applyGeoJSON(GEOJSON_SAMPLES.point)}>Point</button>
			<button onclick={() => applyGeoJSON(GEOJSON_SAMPLES.polygon)}>Polygon</button>
			<button class="secondary" onclick={() => { geojsonData = ''; addLog('GeoJSON cleared'); }}>Clear</button>
		</div>
	</section>

	<section class="stage">
		<div class="map-container">
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<v-map flavour={provider} id="map1" onmap-provider-ready={onMapReady}>
				<v-map-layergroup group-title="Base" basemapid="osm-base">
					<v-map-layer-osm id="osm-base" label="OpenStreetMap" z-index="0"></v-map-layer-osm>
				</v-map-layergroup>

				{#if geotiffUrl}
					<v-map-layergroup group-title="Raster">
						<v-map-layer-geotiff
							id="geotiff-1"
							label="GeoTIFF"
							url={geotiffUrl}
							visible={geotiffVisible}
							opacity={geotiffOpacity}
							nodata="0"
							z-index="10"
						></v-map-layer-geotiff>
					</v-map-layergroup>
				{/if}

				{#if geojsonData}
					<v-map-layergroup group-title="Vector">
						<v-map-layer-geojson
							id="geojson-1"
							label="GeoJSON"
							geojson={geojsonData}
							z-index="100"
						></v-map-layer-geojson>
					</v-map-layergroup>
				{/if}
			</v-map>
		</div>

		<aside class="log">
			<h2>
				Logs
				<button class="small secondary" onclick={() => logs = []}>Clear</button>
			</h2>
			<div class="log-entries">
				{#each logs as entry}
					<div class="log-entry">{entry}</div>
				{/each}
			</div>
		</aside>
	</section>
</main>

<style>
	:global(html, body) {
		margin: 0;
		height: 100%;
		overflow: hidden;
		font-family: system-ui, sans-serif;
		background: #1a1a2e;
		color: #eee;
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
		margin: 0 0 1rem;
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

	button.small {
		padding: 0.2rem 0.5rem;
		font-size: 0.7rem;
	}

	select, input[type="range"] {
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
