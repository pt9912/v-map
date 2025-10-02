# v-map-layer-wcs

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `coverageName` | `string` | `coverage-name` |  | Coverage-Name/ID. |
| `format` | `string` | `format` | `'image/tiff'` | Ausgabeformat, z. B. image/tiff. |
| `opacity` | `number` | `opacity` | `1` | Opazität (0–1). |
| `params` | `string` | `params` |  | Zusätzliche Parameter als JSON-String. |
| `projection` | `string` | `projection` |  | Projektion (Projection) für die Quelle. |
| `resolutions` | `string` | `resolutions` |  | Auflösungen als JSON-Array, z. B. [1000,500]. |
| `url` | `string` | `url` |  | Basis-URL des WCS-Dienstes. |
| `version` | `string` | `version` | `'1.1.0'` | WCS-Version. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers. |
| `zIndex` | `number` | `z-index` | `1000` | Z-Index für die Darstellung. |

### Methods

- `isReady() => Promise<boolean>` — Gibt `true` zurück, sobald der Layer initialisiert wurde.

