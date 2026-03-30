# v-map-layer-wms

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)

OGC WMS Layer

### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `format` | `string` | `format` | `'image/png'` | Bildformat des GetMap-Requests. |
| `layers` | `string` | `layers` |  | Kommagetrennte Layer-Namen (z. B. "topp:states"). |
| `loadState` | `error \| idle \| loading \| ready` | `load-state` | `'idle'` | Current load state of the layer. |
| `opacity` | `number` | `opacity` | `1.0` | Globale Opazität des WMS-Layers (0–1). |
| `styles` | `string` | `styles` |  | WMS-`STYLES` Parameter (kommagetrennt). |
| `tiled` | `boolean` | `tiled` | `true` | Tiled/geslicete Requests verwenden (falls Server unterstützt). |
| `transparent` | `boolean` | `transparent` | `true` | Transparente Kacheln anfordern. |
| `url` | `string` | `url` |  | Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter). |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des WMS-Layers. |
| `zIndex` | `number` | `z-index` | `10` | Z-index for layer stacking order. Higher values render on top. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Signalisiert, dass der WMS-Layer bereit ist. |

### Methods

- `getError() => Promise<VMapErrorDetail>` — Returns the last error detail, if any.

