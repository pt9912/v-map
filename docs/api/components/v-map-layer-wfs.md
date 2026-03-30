# v-map-layer-wfs

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `loadState` | `error \| idle \| loading \| ready` | `load-state` | `'idle'` | Current load state of the layer. |
| `opacity` | `number` | `opacity` | `1` | Opazität (0–1). |
| `outputFormat` | `string` | `output-format` | `'application/json'` | Ausgabeformat, z. B. application/json. |
| `params` | `string` | `params` |  | Zusätzliche Parameter als JSON-String. |
| `srsName` | `string` | `srs-name` | `'EPSG:3857'` | Ziel-Referenzsystem, Standard EPSG:3857. |
| `typeName` | `string` | `type-name` |  | Feature-Typ (typeName) des WFS. |
| `url` | `string` | `url` |  | WFS Endpunkt (z. B. https://server/wfs). |
| `version` | `string` | `version` | `'1.1.0'` | WFS Version, Standard 1.1.0. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers. |
| `zIndex` | `number` | `z-index` | `1000` | Z-Index für Rendering. |

### Methods

- `getError() => Promise<VMapErrorDetail>` — Returns the last error detail, if any.
- `isReady() => Promise<boolean>` — Gibt `true` zurück, sobald der Layer initialisiert wurde.

