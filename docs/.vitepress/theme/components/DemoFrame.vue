<script setup lang="ts">
// Generic iframe wrapper that loads a standalone HTML demo from
// docs/public/demos/<name>.html (which gets copied to /demos/<name>.html
// in the deployed site).
//
// Used from markdown via the inline shortcut `@[demo:cdn-osm-geojson]`
// (see the markdown plugin in .vitepress/config.ts), which expands to
// `<DemoFrame name="cdn-osm-geojson" />`.
//
// withBase() makes sure the URL respects VitePress's base path (`/v-map/`),
// so the iframe still loads correctly when the docs are served under a
// non-root prefix on GitHub Pages.
import { computed } from 'vue';
import { withBase } from 'vitepress';

const props = withDefaults(
  defineProps<{
    name: string;
    height?: string;
    title?: string;
  }>(),
  {
    height: '500px',
    title: 'Live demo',
  },
);

const src = computed(() => withBase(`/demos/${props.name}.html`));
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
      Live demo:
      <a :href="src" target="_blank" rel="noreferrer">{{ name }}.html</a>
      &middot; rechte Ecke des Karten-Containers zeigt
      <code>&lt;v-map-error&gt;</code>-Toasts bei Lade-Fehlern
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
