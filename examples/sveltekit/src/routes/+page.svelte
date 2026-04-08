<script lang="ts">
	import { onMount } from 'svelte';

	// Mirrors src/utils/events.ts in v-map. The package exports types via
	// `@npm9912/v-map/loader` but not via the bare `@npm9912/v-map`
	// specifier yet, so we keep this small enough to inline.
	type VMapErrorDetail = {
		type: 'network' | 'validation' | 'parse' | 'provider';
		message: string;
		attribute?: string;
		cause?: unknown;
	};

	// Reactive state — every change here flows directly into the v-map markup
	// below via Svelte 5 runes. No imperative DOM code, no map.setView() calls.
	let provider = $state<'ol' | 'leaflet' | 'deck' | 'cesium'>('ol');
	let zoom = $state(11);
	let geotiffUrl = $state('');
	let geotiffVisible = $state(false);
	let geotiffOpacity = $state(1.0);
	let geojsonData = $state('');
	let brokenWmsActive = $state(false);
	let logs = $state<Array<{ ts: string; msg: string; kind: 'info' | 'error' }>>([]);

	const GEOTIFF_SAMPLES = [
		{
			label: 'Local CEA Grayscale',
			url: '/geotiff/cea.tif',
			notes: 'small local sample, no external range requests',
		},
		{
			label: 'Local GeoKey Palette',
			url: '/geotiff/GeogToWGS84GeoKey5.tif',
			notes: 'small local sample with GeoKeys and palette colors',
		},
		{
			label: 'Sentinel-2 RGB',
			url: 'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif',
			notes: 'large external COG sample with real-world RGB imagery',
		},
	];

	const GEOJSON_SAMPLES = {
		point: {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: { name: 'München' },
					geometry: { type: 'Point', coordinates: [11.576, 48.137] },
				},
			],
		},
		polygon: {
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
		},
	};

	function addLog(msg: string, kind: 'info' | 'error' = 'info') {
		const ts = new Date().toLocaleTimeString('de-DE', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
		logs = [...logs.slice(-49), { ts, msg, kind }];
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

	function triggerBrokenWms() {
		brokenWmsActive = !brokenWmsActive;
		addLog(brokenWmsActive ? 'Broken WMS layer added' : 'Broken WMS layer removed');
	}

	onMount(async () => {
		// Enable debug logging for v-map (production build defaults to 'warn')
		localStorage.setItem('@pt9912/v-map:logLevel', 'debug');

		// v-map is loaded via a <script type="module"> tag in app.html
		// (from jsDelivr) instead of being bundled through Vite. We just
		// wait for customElements to be defined so the rest of the demo
		// can rely on them being upgraded.
		await customElements.whenDefined('v-map');
		addLog('v-map custom elements registered');
	});

	function onMapReady() {
		addLog(`map-provider-ready (${provider})`);
	}

	// Programmatic listener for vmap-error events bubbling up from any layer.
	// In Svelte 5 we can also wire this declaratively via on:vmap-error on
	// the <v-map> element, but the imperative store-style listener shown here
	// is closer to what you'd do for a global error sink.
	function onMapError(event: Event) {
		const detail = (event as CustomEvent<VMapErrorDetail>).detail;
		if (!detail) return;
		const target = event.target instanceof HTMLElement ? event.target.tagName.toLowerCase() : '?';
		addLog(`[${detail.type}] ${target}: ${detail.message}`, 'error');
	}
</script>

<svelte:head>
	<title>v-map SvelteKit Demo</title>
</svelte:head>

<main>
	<h1>v-map + SvelteKit</h1>
	<p class="lead">
		Reactive Demo: jeder Steuerungs-Wert ist Svelte-State und fließt direkt
		als Prop in die <code>&lt;v-map&gt;</code>-Komponenten unten. Kein
		<code>map.setView()</code>, kein imperatives Layer-Adding.
	</p>

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

			<label class="zoom-label">
				Zoom:
				<input type="range" min="2" max="18" step="1" bind:value={zoom} />
				<span class="zoom-value">{zoom}</span>
			</label>
		</div>

		<div class="row">
			<strong>GeoTIFF:</strong>
			{#each GEOTIFF_SAMPLES as sample}
				<button onclick={() => applyGeoTiff(sample.url)} title={sample.notes}>
					{sample.label}
				</button>
			{/each}
			<button
				class="secondary"
				onclick={() => {
					geotiffVisible = false;
					addLog('GeoTIFF hidden');
				}}>Hide</button
			>
		</div>
		<div class="row hint">
			Local demo GeoTIFFs are served from <code>/geotiff/*</code> for reproducible debugging.
			External samples remain available for larger real-world test cases.
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
			<button
				class="secondary"
				onclick={() => {
					geojsonData = '';
					addLog('GeoJSON cleared');
				}}>Clear</button
			>
		</div>

		<div class="row">
			<strong>Error API:</strong>
			<button class="danger" onclick={triggerBrokenWms}>
				{brokenWmsActive ? 'Remove broken WMS' : 'Add broken WMS layer'}
			</button>
			<span class="hint">
				Adds a layer with an unreachable URL — should produce a
				<code>vmap-error</code> event and a toast.
			</span>
		</div>
	</section>

	<section class="stage">
		<div class="map-container">
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<v-map
				flavour={provider}
				zoom={String(zoom)}
				center="11.576,48.137"
				id="map1"
				onmap-provider-ready={onMapReady}
				onvmap-error={onMapError}
			>
				<!-- Declarative error toast — no JavaScript needed for the UI side -->
				<v-map-error position="bottom-right" auto-dismiss="6000"></v-map-error>

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

				{#if brokenWmsActive}
					<v-map-layergroup group-title="Broken">
						<v-map-layer-wms
							id="broken-wms"
							label="Intentionally broken"
							url="https://this-host-does-not-exist.invalid/wms"
							layers="nope"
							z-index="200"
						></v-map-layer-wms>
					</v-map-layergroup>
				{/if}
			</v-map>
		</div>

		<aside class="log">
			<h2>
				Logs
				<button class="small secondary" onclick={() => (logs = [])}>Clear</button>
			</h2>
			<div class="log-entries">
				{#each logs as entry}
					<div class="log-entry log-{entry.kind}">
						<span class="log-ts">{entry.ts}</span>
						<span class="log-msg">{entry.msg}</span>
					</div>
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
