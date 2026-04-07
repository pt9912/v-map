import type { CesiumNS, OlNS } from './namespaces';

// Fix for OpenLayers PaletteTexture TypeScript compatibility issue
declare module "ol/webgl/PaletteTexture" {
  export interface PaletteTexture {
    name: string;
    data: Uint8Array; // Fixed: removed generic <ArrayBufferLike>
  }
}

declare global {
  // weil du per <script> lädst:
  var Cesium: CesiumNS | undefined; // globalThis.Cesium
  var ol: OlNS | undefined; // globalThis.ol (falls genutzt)
}
export {};
