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
		// Don't pre-bundle v-map — let Vite serve it as-is so changes
		// from `pnpm build` in the root are picked up without cache issues.
		exclude: ['@npm9912/v-map'],
	},
});
