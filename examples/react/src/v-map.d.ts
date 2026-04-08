// JSX type augmentation for v-map's Stencil-built custom elements.
//
// Stencil generates HTML*Element types in dist/types/components.d.ts for
// every custom element, but doesn't add them to React's IntrinsicElements
// map. This file makes <v-map>, <v-map-layer-osm>, etc. usable inside
// React .tsx files without `// @ts-expect-error` casts.
//
// We type the prop bag loosely (HTMLAttributes plus an open `[key:
// string]: any`) so we don't have to mirror every Stencil prop signature
// here. The runtime still validates everything.

import type { HTMLAttributes, DetailedHTMLProps } from 'react';

type CustomElementProps<T extends HTMLElement = HTMLElement> = DetailedHTMLProps<
  HTMLAttributes<T>,
  T
> & {
  [key: string]: unknown;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'v-map': CustomElementProps;
      'v-map-builder': CustomElementProps;
      'v-map-layergroup': CustomElementProps;
      'v-map-layercontrol': CustomElementProps;
      'v-map-style': CustomElementProps;
      'v-map-error': CustomElementProps;
      'v-map-layer-osm': CustomElementProps;
      'v-map-layer-xyz': CustomElementProps;
      'v-map-layer-google': CustomElementProps;
      'v-map-layer-wms': CustomElementProps;
      'v-map-layer-wcs': CustomElementProps;
      'v-map-layer-wfs': CustomElementProps;
      'v-map-layer-geojson': CustomElementProps;
      'v-map-layer-geotiff': CustomElementProps;
      'v-map-layer-wkt': CustomElementProps;
      'v-map-layer-scatterplot': CustomElementProps;
      'v-map-layer-tile3d': CustomElementProps;
      'v-map-layer-terrain': CustomElementProps;
      'v-map-layer-terrain-geotiff': CustomElementProps;
    }
  }
}
