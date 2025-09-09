# v-map



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `center` | `string` | `center` | `'0,0'` |  |
| `cssMode` | `"bundle" | "cdn" | "inline-min" | "none"` | `css-mode` | `'cdn'` |  |
| `flavour` | `"cesium" | "deck" | "leaflet" | "ol"` | `flavour` | `'ol'` |  |
| `useDefaultImportMap` | `boolean` | `use-default-import-map` | `true` | Falls true, injiziert v-map automatisch die Import-Map. |
| `zoom` | `number` | `zoom` | `2` |  |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `mapProviderReady` | `MapProviderDetail` |  |

### Methods

- `addLayer(layerConfig: any) => [object Object]`
- `getMapProvider() => [object Object]`
- `isMapProviderAvailable() => [object Object]`
- `setView(coordinates: [number, number], zoom: number) => [object Object]`

