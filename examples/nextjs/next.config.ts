import type { NextConfig } from 'next';

// VMAP_DOCS_BASE is set by scripts/build-examples.mjs to /v-map/demos/nextjs
// when building for embedding in the docs site. Empty during local dev.
//
// For Next.js sub-path deployments we need both basePath and assetPrefix:
// - basePath rewrites all internal links and routes
// - assetPrefix prefixes static asset URLs (/_next/static/...)
//
// Both must NOT have a trailing slash.
const baseEnv = process.env.VMAP_DOCS_BASE ?? '';
const basePath = baseEnv.replace(/\/$/, '');

const nextConfig: NextConfig = {
  // Generate a fully static SPA - no Next.js server, no SSR at runtime.
  // Output goes to ./out/ which the docs build script picks up via the
  // "vmap": { "output": "out" } package.json field.
  output: 'export',

  // No image optimization in static export mode.
  images: {
    unoptimized: true,
  },

  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,

  // Disable the per-page eslint check during build - we don't want to
  // ship eslint as a dep just for this demo.
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    // Same: keep the demo small. We typecheck via `pnpm typecheck`
    // explicitly when we want to.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
