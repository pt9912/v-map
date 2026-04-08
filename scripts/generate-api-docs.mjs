import fs from 'node:fs/promises';
import path from 'node:path';

const SRC = 'docs/api/stencil-docs.json';
const OUT_DIR = 'docs/api/components';

const escapeHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const escapeBackticks = (s = '') => String(s).replace(/`/g, '\\`');
const code = (s = '') => '`' + escapeBackticks(escapeHtml(String(s))) + '`';
const h = (s = '') => String(s).replace(/\r?\n/g, ' ').trim();

const section = (title, rows, headers) => {
  if (!rows?.length) return '';
  const head = `| ${headers.join(' | ')} |\n| ${headers
    .map(() => '---')
    .join(' | ')} |`;
  const body = rows.map(r => `| ${r.join(' | ')} |`).join('\n');
  return `\n### ${title}\n\n${head}\n${body}\n`;
};

// NEU: Methods als Liste, nicht als Tabelle
const methodsList = methods => {
  if (!methods?.length) return '';
  const items = methods
    .map(([sig, desc]) => {
      const text = desc ? ` — ${desc}` : '';
      return `- ${sig}${text}`;
    })
    .join('\n');
  return `\n### Methods\n\n${items}\n`;
};

const formatUnionType = type => {
  // Entferne alle Anführungszeichen
  const cleanedType = type.replace(/"/g, '');
  // Ersetze Pipes durch escaped Pipes
  return `\`${cleanedType.replace(/\s*\|\s*/g, ' \\| ')}\``;
};

const mdForCmp = c => {
  const name = c.tag;
  const desc = h(c.docs);

  // 🔙 Rücklink / Breadcrumb
  const breadcrumb = `[← Zur Übersicht](./README.md) · [**@npm9912/v-map**](/)\n\n`;

  const props = (c.props || []).map(p => [
    `\`${p.name}\``,
    p.type.includes('|') ? formatUnionType(p.type) : `\`${p.type}\``,
    p.attr ? `\`${p.attr}\`` : '',
    p.default ? `\`${h(p.default)}\`` : '',
    h(p.docs || ''),
  ]);

  const events = (c.events || []).map(e => [
    `\`${e.event}\``,
    `\`${e.detail}\``,
    h(e.docs || ''),
  ]);

  const methods = (c.methods || []).map(m => {
    const retRaw = m.returns ?? '';
    const ret =
      typeof retRaw === 'string'
        ? retRaw
        : retRaw.type || retRaw.text || 'void';
    const paramSig = (m.parameters || [])
      .map(p => `${p.name}: ${p.type}`)
      .join(', ');
    return [`\`${m.name}(${paramSig}) => ${ret}\``, h(m.docs || '')];
  });

  const slots = (c.slots || []).map(s => [
    `\`${s.name || 'default'}\``,
    h(s.docs || ''),
  ]);

  const parts = (c.parts || []).map(p => [`\`${p.name}\``, h(p.docs || '')]);

  return (
    `# ${name}\n\n` +
    breadcrumb +
    `${desc || ''}\n` +
    section('Props', props, [
      'Name',
      'Type',
      'Attr',
      'Default',
      'Beschreibung',
    ]) +
    section('Events', events, ['Event', 'Detail-Type', 'Beschreibung']) +
    methodsList(methods) +
    section('Slots', slots, ['Slot', 'Beschreibung']) +
    section('CSS Parts', parts, ['Part', 'Beschreibung']) +
    '\n'
  );
};

(async () => {
  const raw = JSON.parse(await fs.readFile(SRC, 'utf8'));
  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const c of raw.components || []) {
    const file = path.join(OUT_DIR, `${c.tag}.md`);
    await fs.writeFile(file, mdForCmp(c), 'utf8');
  }

  const links = (raw.components || [])
    .map(c => {
      const file = `${c.tag}.md`;
      const label = code(c.tag); // z. B. `v-map`
      const desc = h(c.docs || '');
      return `- [${label}](./${file}) — ${desc}`;
    })
    .join('\n');

  await fs.writeFile(
    path.join(OUT_DIR, 'README.md'),
    `# Komponenten-API\n\n[**@npm9912/v-map**](/)\n\n${links}\n`,
    'utf8',
  );
  console.log('✅ Komponenten-API erzeugt.');
})();

/* --------------------------------------------------------------------------
 * Layer-Matrix-Generator
 * Scannt Provider-Implementierungen nach unterstützten Layer-Typen und erzeugt
 * docs/layers/matrix.md sowie docs/api/layer-matrix.json
 * -------------------------------------------------------------------------- */
import * as fsp from 'node:fs/promises';

const ROOT = process.cwd();
const LAYERCONFIG_TS = 'src/types/layerconfig.ts';
const PROVIDERS_DIR = 'src/map-provider';
const MATRIX_MD = 'docs/layers/matrix.md';
const MATRIX_JSON = 'docs/api/layer-matrix.json';

async function readFileSafe(p) {
  try {
    return await fsp.readFile(p, 'utf8');
  } catch {
    return '';
  }
}

function detectLayerTypes(layerconfigTs) {
  // naive: alle Vorkommen von type: 'xyz'
  const set = new Set();
  const rx = /type:\s*'([a-zA-Z0-9_-]+)'/g;
  let m;
  while ((m = rx.exec(layerconfigTs))) set.add(m[1]);
  return Array.from(set).sort();
}

function detectProviderNameFromPath(p) {
  // e.g. src/map-provider/leaflet/leaflet-provider.ts -> 'leaflet'
  const parts = p.split(/[\\/]/);
  const idx = parts.indexOf('map-provider');
  if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
  return 'unknown';
}

function findCaseTypesInSource(src) {
  // Sucht nach switch-case 'case \'type\''
  const found = new Set();
  const rx = /case\s+['"]([a-zA-Z0-9_-]+)['"]\s*:/g;
  let m;
  while ((m = rx.exec(src))) found.add(m[1]);
  return Array.from(found);
}

async function scanProviders() {
  const files = [];
  async function walk(dir) {
    const ents = await fsp.readdir(dir, { withFileTypes: true });
    for (const e of ents) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await walk(full);
      else if (/provider\.ts$/.test(e.name)) files.push(full);
    }
  }
  await walk(PROVIDERS_DIR);
  const result = {};
  for (const file of files) {
    const src = await readFileSafe(file);
    const name = detectProviderNameFromPath(file);
    const types = findCaseTypesInSource(src);
    result[name] = { file, types: Array.from(new Set(types)).sort() };
  }
  return result;
}

function mdTable(headers, rows) {
  const head = `| ${headers.join(' | ')} |\n| ${headers
    .map(() => '---')
    .join(' | ')} |`;
  const body = rows.map(r => `| ${r.join(' | ')} |`).join('\n');
  return head + '\n' + body + '\n';
}

function tick(ok) {
  return ok ? '✅' : '❌';
}

async function generateMatrix() {
  const breadcrumb = `[**@npm9912/v-map**](/)\n\n`;
  const layerconfig = await readFileSafe(LAYERCONFIG_TS);
  const allTypes = detectLayerTypes(layerconfig);

  const providers = await scanProviders();
  const providerNames = Object.keys(providers).sort(); // e.g. ['cesium','deck','leaflet','ol']

  // JSON Struktur
  const matrix = { types: allTypes, providers: providerNames, support: {} };

  for (const t of allTypes) {
    matrix.support[t] = {};
    for (const p of providerNames) {
      const supports = providers[p]?.types?.includes(t) ?? false;
      matrix.support[t][p] = supports;
    }
  }

  // MD Tabelle
  const headers = ['Layer-Typ', ...providerNames.map(n => n.toUpperCase())];
  const rows = allTypes.map(t => [
    '`' + t + '`',
    ...providerNames.map(p => tick(matrix.support[t][p])),
  ]);

  const content =
    `# Layer-Matrix (automatisch erzeugt)\n\n` +
    breadcrumb +
    `
> Generiert von \`scripts/generate-api-docs.mjs\`. Bitte nicht manuell bearbeiten.

${mdTable(headers, rows)}

**Hinweis:** Diese Matrix wird heuristisch aus den \`case 'type'\`-Vorkommen in den Provider-Dateien abgeleitet. Manuelle Spezialfälle (z. B. über Helper-Methoden) bitte zusätzlich dokumentieren.
`;

  await fsp.mkdir(path.dirname(MATRIX_MD), { recursive: true });
  await fsp.writeFile(MATRIX_MD, content, 'utf8');
  await fsp.mkdir(path.dirname(MATRIX_JSON), { recursive: true });
  await fsp.writeFile(MATRIX_JSON, JSON.stringify(matrix, null, 2), 'utf8');
  console.log('✅ Layer-Matrix erzeugt.');
}

// --------------------------------------------------------------------------
// TypeDoc: Breadcrumbs in /docs/api/ts/**/*.md injizieren
// --------------------------------------------------------------------------
import * as fss from 'node:fs/promises';

const TSDOC_DIR = 'docs/api/ts';
//const BREADCRUMB_TS = `[← Zur Übersicht](/api/ts/index) · [**@npm9912/v-map**](/)\n\n`;
const BREADCRUMB_TS = `[← Zur Übersicht](/api/ts/) · [**@npm9912/v-map**](/)\n\n`;

async function listMdFiles(dir) {
  const out = [];
  async function walk(d) {
    const ents = await fss.readdir(d, { withFileTypes: true });
    for (const e of ents) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.isFile() && e.name.toLowerCase().endsWith('.md'))
        out.push(full);
    }
  }
  await walk(dir);
  return out;
}

function hasBreadcrumb(s) {
  // Doppelte Injektion vermeiden
  return s.includes('[← Zur Übersicht](/api/ts/index)');
}

async function patchTypedocBreadcrumbs() {
  try {
    const mdFiles = await listMdFiles(TSDOC_DIR);
    for (const file of mdFiles) {
      const name = path.basename(file).toLowerCase();
      // Indexseiten selbst nicht patchen
      if (name === 'readme.md' || name === 'index.md') continue;

      let src = await fss.readFile(file, 'utf8');
      if (hasBreadcrumb(src)) continue;

      // Nach erster H1 (# ...) suchen, Breadcrumb direkt darunter einfügen
      const m = src.match(/^# .*\r?\n/m);
      if (m) {
        const idx = m.index + m[0].length;
        const patched =
          src.slice(0, idx) + '\n' + BREADCRUMB_TS + src.slice(idx);
        await fss.writeFile(file, patched, 'utf8');
      } else {
        // fallback: ganz an den Anfang
        await fss.writeFile(file, BREADCRUMB_TS + src, 'utf8');
      }
    }
    console.log('✅ TypeDoc-Breadcrumbs injiziert.');
  } catch (e) {
    console.warn(
      '⚠️ Konnte TypeDoc-Breadcrumbs nicht injizieren:',
      e?.message || e,
    );
  }
}

// Am Ende des bestehenden Scripts zusätzlich die Matrix erzeugen
await generateMatrix();

//await patchTypedocBreadcrumbs();
