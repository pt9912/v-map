import adapter from '@sveltejs/adapter-static';
import { relative, sep } from 'node:path';

// Base path for the deployed iframe inside the docs site (/v-map/demos/sveltekit/).
// Empty by default so `pnpm dev` and standalone `pnpm build` still work
// without any env var. Set VMAP_DOCS_BASE when building for docs embedding,
// e.g. via the orchestration script in the repo root.
const base = process.env.VMAP_DOCS_BASE ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// defaults to rune mode for the project, except for `node_modules`. Can be removed in svelte 6.
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');

			return isExternalLibrary ? undefined : true;
		}
	},
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			// SPA fallback so client-side navigation works without a server.
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base
		},
		// The single demo route already declares ssr=false, but we make it
		// explicit at the kit level too: prerender what we can, ignore HTTP
		// errors during prerendering (e.g. external GeoTIFF samples).
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn'
		}
	}
};

export default config;
