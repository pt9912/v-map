import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

const clean = v => String(v || '').replace(/^[^\d]*/, '');

const get = name =>
  clean(pkg.devDependencies?.[name] ?? pkg.peerDependencies?.[name] ?? '');

const CESIUM_VERSION = get('cesium') || '1.133.0';
const OL_VERSION = get('ol') || '10.8.0';
const LEAFLET_VERSION = get('leaflet') || '1.9.4';
const DECK_VERSION = get('deck') || '9.1.14';
const LOADERS_GL_VERSION = get('@loaders.gl/core') || '4.3.4';

const importMap = {
  imports: {
    'ol/': `https://esm.sh/ol@${OL_VERSION}/`,
    'ol': `https://esm.sh/ol@${OL_VERSION}`,
    'leaflet': `https://esm.sh/leaflet@${LEAFLET_VERSION}`,
    'deck': `https://esm.sh/deck@${DECK_VERSION}`,
    '@loaders.gl/core': `https://esm.sh/@loaders.gl/core@${LOADERS_GL_VERSION}`,
    '@loaders.gl/3d-tiles': `https://esm.sh/@loaders.gl/3d-tiles@${LOADERS_GL_VERSION}`,
    '@loaders.gl/gis': `https://esm.sh/@loaders.gl/gis@${LOADERS_GL_VERSION}`,
    '@loaders.gl/gltf': `https://esm.sh/@loaders.gl/gltf@${LOADERS_GL_VERSION}`,
    '@loaders.gl/images': `https://esm.sh/@loaders.gl/images@${LOADERS_GL_VERSION}`,
    '@loaders.gl/loader-utils': `https://esm.sh/@loaders.gl/loader-utils@${LOADERS_GL_VERSION}`,
    '@loaders.gl/mvt': `https://esm.sh/@loaders.gl/mvt@${LOADERS_GL_VERSION}`,
    '@loaders.gl/schema': `https://esm.sh/@loaders.gl/schema@${LOADERS_GL_VERSION}`,
    '@loaders.gl/terrain': `https://esm.sh/@loaders.gl/terrain@${LOADERS_GL_VERSION}`,
    '@loaders.gl/textures': `https://esm.sh/@loaders.gl/textures@${LOADERS_GL_VERSION}`,
    '@loaders.gl/tiles': `https://esm.sh/@loaders.gl/tiles@${LOADERS_GL_VERSION}`,
    '@loaders.gl/wms': `https://esm.sh/@loaders.gl/wms@${LOADERS_GL_VERSION}`,
  },
};

const outDir = resolve(root, 'src/lib');
mkdirSync(outDir, { recursive: true });

const out = `/* AUTO-GENERATED: DO NOT EDIT. Run "pnpm build" to regenerate. */
export const CESIUM_VERSION  = '${CESIUM_VERSION}' as const;
export const OL_VERSION      = '${OL_VERSION}' as const;
export const LEAFLET_VERSION = '${LEAFLET_VERSION}' as const;
export const DECK_VERSION = '${DECK_VERSION}' as const;

export const IMPORT_MAP_JSON = ${JSON.stringify(
  JSON.stringify(importMap, null, 2),
)} as const;
`;
writeFileSync(resolve(outDir, 'versions.gen.ts'), out, 'utf8');
console.log('[gen-versions] wrote src/lib/versions.gen.ts');
