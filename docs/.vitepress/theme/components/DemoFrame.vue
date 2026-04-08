<script setup lang="ts">
// Generic iframe wrapper for two kinds of embedded demos:
//
// kind="html" (default) — single static HTML file under
//   docs/public/demos/<name>.html, copied to /demos/<name>.html in the
//   deployed site. Used by the @[demo:cdn-osm-geojson] markdown shortcut.
//
// kind="example" — full SPA built from a workspace under examples/<name>/
//   by scripts/build-examples.mjs, copied to /demos/<name>/index.html.
//   Used by the @[example:sveltekit] markdown shortcut.
//
// withBase() makes sure both URL forms respect VitePress's base path
// (`/v-map/`), so the iframe still loads correctly when the docs are
// served under a non-root prefix on GitHub Pages.
import { computed } from 'vue';
import { withBase } from 'vitepress';

const props = withDefaults(
  defineProps<{
    name: string;
    kind?: 'html' | 'example';
    height?: string;
    title?: string;
  }>(),
  {
    kind: 'html',
    height: '600px',
    title: 'Live demo',
  },
);

const src = computed(() =>
  withBase(
    props.kind === 'example'
      ? `/demos/${props.name}/`
      : `/demos/${props.name}.html`,
  ),
);

const labelHtml = computed(() =>
  props.kind === 'example' ? `${props.name}/` : `${props.name}.html`,
);
</script>

<template>
  <div class="demo-frame">
    <ClientOnly>
      <iframe
        :src="src"
        :title="title"
        :style="{ height }"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </ClientOnly>
    <p class="demo-frame__caption">
      Live demo (sandboxed Iframe):
      <a :href="src" target="_blank" rel="noreferrer">{{ labelHtml }}</a>
      &middot; <a :href="src" target="_blank" rel="noreferrer">in neuem Tab öffnen</a>
    </p>
  </div>
</template>

<style scoped>
.demo-frame {
  margin: 1.5rem 0;
}

.demo-frame iframe {
  display: block;
  width: 100%;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.demo-frame__caption {
  margin: 0.5rem 0 0;
  font-size: 0.85em;
  color: var(--vp-c-text-2);
  text-align: center;
}
</style>
