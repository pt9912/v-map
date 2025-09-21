# v-map-layer-xyz

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)

XYZ Tile Layer

### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `attributions` | `string` | `attributions` |  | Attributions-/Copyright-Text (HTML erlaubt). |
| `maxZoom` | `number` | `max-zoom` |  | Maximaler Zoomlevel, den der Tile-Server liefert. |
| `opacity` | `number` | `opacity` | `1.0` | Opazität (0–1). |
| `subdomains` | `string` | `subdomains` |  | Subdomains für parallele Tile-Anfragen (z. B. "a,b,c"). |
| `tileSize` | `number` | `tile-size` |  | Größe einer Kachel in Pixeln. |
| `url` | `string` | `url` |  | URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png". |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des XYZ-Layers. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Wird ausgelöst, wenn der XYZ-Layer bereit ist. |

