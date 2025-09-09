# v-map-layer-group



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description | Type      | Default                                   |
| --------- | ---------- | ----------- | --------- | ----------------------------------------- |
| `basemap` | `basemap`  |             | `boolean` | `false`                                   |
| `groupId` | `group-id` |             | `string`  | `Math.random().toString(36).slice(2, 11)` |
| `opacity` | `opacity`  |             | `number`  | `1.0`                                     |
| `visible` | `visible`  |             | `boolean` | `true`                                    |


## Methods

### `addLayer(layerConfig: LayerConfig) => Promise<void>`



#### Parameters

| Name          | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Description |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `layerConfig` | `{ type: "geojson"; url: string; style?: StyleConfig; groupId?: string; } \| { type: "osm"; groupId?: string; url?: string; } \| { type: "xyz"; url: string; attributions?: string \| string[]; maxZoom?: number; options?: Record<string, unknown>; groupId?: string; } \| { type: "arcgis"; url: string; groupId?: string; } \| { type: "google"; apiKey: string; mapType?: "roadmap" \| "satellite" \| "terrain" \| "hybrid"; scale?: "scaleFactor1x" \| "scaleFactor2x"; highDpi?: boolean; groupId?: string; maxZoom?: number; styles?: string; language?: string; libraries?: string[]; region?: string; } \| { type: "wms"; url: string; layers: string; params?: Record<string, string>; groupId?: string; } \| { type: "scatterplot"; id?: string; data?: any; getFillColor?: Color; getRadius?: number; opacity?: number; visible?: boolean; getTooltip?: (info: any) => any; onClick?: (info: any) => void; onHover?: (info: any) => void; groupId?: string; } \| { type: "terrain"; elevationData: string; texture?: string; elevationDecoder?: { r: number; g: number; b: number; offset: number; }; wireframe?: boolean; color?: [number, number, number]; minZoom?: number; maxZoom?: number; meshMaxError?: number; groupId?: string; }` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
