# v-map-style

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `autoApply` | `boolean` | `auto-apply` | `true` | Whether to automatically apply the style when loaded. |
| `content` | `string` | `content` |  | Inline style content as string (alternative to src). |
| `format` | `cartocss \| mapbox-gl \| sld \| slyr` | `format` | `'sld'` | The styling format to parse (currently supports 'sld'). |
| `layerTargets` | `string` | `layer-targets` |  | Target layer IDs to apply this style to. If not specified, applies to all compatible layers. |
| `src` | `string` | `src` |  | The style source - can be a URL to fetch from or inline SLD/style content. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `styleError` | `Error` | Fired when style parsing fails. |
| `styleReady` | `Style` | Fired when style is successfully parsed and ready to apply. |

