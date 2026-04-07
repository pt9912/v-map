import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const leafletEsmPath = new URL(
	'../../node_modules/.pnpm/leaflet@1.9.4/node_modules/leaflet/dist/leaflet-src.esm.js',
	import.meta.url,
).pathname;

export default defineConfig({
	plugins: [
		sveltekit(),
		nodePolyfills({
			include: ['stream', 'events', 'buffer', 'util', 'string_decoder', 'process'],
		}),
	],
	resolve: {
		alias: [{ find: /^leaflet$/, replacement: leafletEsmPath }],
	},
	server: {
		// Watch the parent v-map dist directory for changes after `pnpm run build`
		watch: {
			ignored: ['!**/node_modules/@npm9912/v-map/dist/**'],
		},
	},
});
