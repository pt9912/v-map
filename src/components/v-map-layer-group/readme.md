# v-map-layer-group



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute  | Description | Type      | Default                                   |
| --------- | ---------- | ----------- | --------- | ----------------------------------------- |
| `basemap` | `basemap`  |             | `boolean` | `false`                                   |
| `groupId` | `group-id` |             | `string`  | `Math.random().toString(36).slice(2, 11)` |


## Methods

### `addLayer(layerConfig: LayerConfig) => Promise<void>`



#### Parameters

| Name          | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Description |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `layerConfig` | `{ type: "geojson"; url: string; style?: StyleConfig; groupId?: string; } \| { type: "osm"; groupId?: string; } \| { type: "xyz"; url: string; attributions?: string \| string[]; maxZoom?: number; options?: Record<string, unknown>; groupId?: string; } \| { type: "arcgis"; url: string; groupId?: string; } \| { type: "google"; apiKey: string; mapType?: "roadmap" \| "satellite" \| "terrain" \| "hybrid"; scale?: "scaleFactor1x" \| "scaleFactor2x"; highDpi?: boolean; groupId?: string; } \| { type: "wms"; url: string; layers: string; params?: Record<string, string>; groupId?: string; }` |             |

#### Returns

Type: `Promise<void>`



### `loadProviderCSS(flavour: string) => Promise<void>`



#### Parameters

| Name      | Type     | Description |
| --------- | -------- | ----------- |
| `flavour` | `string` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
