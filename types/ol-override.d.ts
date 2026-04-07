// Override für OpenLayers PaletteTexture TypeScript-Problem
declare module 'ol/webgl/PaletteTexture' {
  export interface PaletteTexture {
    name: string;
    data: Uint8Array; // Fix: Remove generic parameter
  }
}