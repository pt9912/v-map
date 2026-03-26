import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		sveltekit(),
		nodePolyfills({
			include: ['stream', 'events', 'buffer', 'util', 'string_decoder', 'process'],
		}),
	],
	optimizeDeps: {
		include: ['@npm9912/v-map/loader'],
	},
	server: {
		// Watch the parent v-map dist directory for changes after `pnpm run build`
		watch: {
			ignored: ['!**/node_modules/@npm9912/v-map/dist/**'],
		},
	},
});
