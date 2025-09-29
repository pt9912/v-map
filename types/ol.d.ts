// Local OpenLayers type fixes
declare module 'ol/webgl/PaletteTexture' {
  export interface PaletteTexture {
    name: string;
    data: Uint8Array; // Fixed: removed generic parameter
  }
}

// Re-export everything else from the original ol types
export * from 'ol';