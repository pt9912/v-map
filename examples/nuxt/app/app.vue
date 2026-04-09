<!--
  Root component. Nuxt 4 uses the new app/ directory layout, where
  app.vue is the entry point and pages are auto-routed from app/pages/.

  We render <NuxtPage /> here so the showcase page in pages/index.vue
  takes over. The showcase page itself disables SSR via
  definePageMeta({ ssr: false }) because v-map needs the browser DOM.
-->
<template>
  <div>
    <NuxtPage />
  </div>
</template>
