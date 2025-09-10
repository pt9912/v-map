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

  const methods = (c.methods || []).map(m => [
    `\`${m.name}(${(m.parameters || [])
      .map(p => `${p.name}: ${p.type}`)
      .join(', ')}) => ${m.returns}\``,
    h(m.docs || ''),
  ]);

  const slots = (c.slots || []).map(s => [
    `\`${s.name || 'default'}\``,
    h(s.docs || ''),
  ]);
  const parts = (c.parts || []).map(p => [`\`${p.name}\``, h(p.docs || '')]);

  // ⬇️ statt section('Methods', ...) jetzt methodsList(methods)
  return (
    `# ${name}\n\n${desc || ''}\n` +
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
    .map(c => `- ${code(c.tag)} — ${h(c.docs || '')}`)
    .join('\n');

  await fs.writeFile(
    path.join(OUT_DIR, 'index.md'),
    `# Komponenten-API\n\n${links}\n`,
    'utf8',
  );
  console.log('✅ Komponenten-API erzeugt.');
})();
