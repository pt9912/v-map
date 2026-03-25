import 'leaflet';

declare module 'leaflet' {
  interface Layer {
    vmapVisible?: boolean;
    vmapOpacity?: number;
    layerElementId?: string;
  }

  interface LayerGroup<P = any> {
    _groupId?: string;
    visible?: boolean;
    basemap?: boolean;
  }
}
