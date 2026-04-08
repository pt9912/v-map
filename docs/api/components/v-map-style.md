# v-map-style

[← Zur Übersicht](./) · [**@npm9912/v-map**](/)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `autoApply` | `boolean` | `auto-apply` | `true` | Whether to automatically apply the style when loaded. |
| `content` | `string` | `content` |  | Inline style content as string (alternative to src). |
| `format` | `cesium-3d-tiles \| geostyler \| lyrx \| mapbox-gl \| qgis \| sld` | `format` | `'sld'` | The styling format to parse (supports 'sld', 'mapbox-gl', 'qgis', 'lyrx', 'cesium-3d-tiles'). |
| `layerTargets` | `string` | `layer-targets` |  | Target layer IDs to apply this style to. If not specified, applies to all compatible layers. |
| `src` | `string` | `src` |  | The style source - can be a URL to fetch from or inline SLD/style content. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `styleError` | `Error` | Fired when style parsing fails. |
| `styleReady` | `{ style?: ResolvedStyle; layerIds?: string[]; }` | Fired when style is successfully parsed and ready to apply. |

### Methods

- `getLayerTargetIds() => Promise<string[]>` — Get the target layer IDs as array. async
- `getStyle() => Promise<ResolvedStyle>` — Get the currently parsed style.

