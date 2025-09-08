import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));

const clean = v => String(v || '').replace(/^[^\d]*/, '');

const get = (name) =>
  clean(pkg.devDependencies?.[name] ?? pkg.peerDependencies?.[name] ?? '');

const CESIUM_VERSION  = get('cesium')   || '1.133.0';
const OL_VERSION      = get('ol')       || '10.6.1';
const LEAFLET_VERSION = get('leaflet')  || '1.9.4';

const importMap = {
  imports: {
    'ol/':      `https://esm.sh/ol@${OL_VERSION}/`,
    'ol':       `https://esm.sh/ol@${OL_VERSION}`,
    'leaflet':  `https://esm.sh/leaflet@${LEAFLET_VERSION}`
  }
};

const outDir = resolve(root, 'src/lib');
mkdirSync(outDir, { recursive: true });

const out = `/* AUTO-GENERATED: DO NOT EDIT. Run "pnpm build" to regenerate. */
export const CESIUM_VERSION  = '${CESIUM_VERSION}' as const;
export const OL_VERSION      = '${OL_VERSION}' as const;
export const LEAFLET_VERSION = '${LEAFLET_VERSION}' as const;

export const IMPORT_MAP_JSON = ${JSON.stringify(JSON.stringify(importMap, null, 2))} as const;
`;
writeFileSync(resolve(outDir, 'versions.gen.ts'), out, 'utf8');
console.log('[gen-versions] wrote src/lib/versions.gen.ts');
