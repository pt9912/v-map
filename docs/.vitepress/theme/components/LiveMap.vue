<script setup lang="ts">
// Live demo component used from markdown via <LiveMap />.
// We embed the v-map custom elements inside a Vue SFC template instead of
// directly in markdown because the markdown parser has html: false
// (typedoc-generated pages contain generic-type signatures like `<T>` that
// would otherwise break the Vue compiler).
//
// The Vue compiler IS configured (in .vitepress/config.ts) to treat any
// tag starting with `v-map` (and the bare `v-map`) as a custom element,
// so the template below renders the real v-map web components.

const mapStyle = {
  display: 'block',
  width: '100%',
  height: '420px',
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid var(--vp-c-divider)',
};
</script>

<template>
  <ClientOnly>
    <v-map
      flavour="ol"
      center="11.5761,48.1371"
      zoom="11"
      :style="mapStyle"
    >
      <v-map-error position="top-right" auto-dismiss="6000"></v-map-error>
      <v-map-layergroup group-title="Basiskarten" basemapid="OSM-BASE">
        <v-map-layer-osm
          id="OSM-BASE"
          label="OpenStreetMap"
        ></v-map-layer-osm>
      </v-map-layergroup>
    </v-map>
  </ClientOnly>
</template>
