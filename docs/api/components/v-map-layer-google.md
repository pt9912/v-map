# v-map-layer-google

[← Zur Übersicht](./README.md) · [**@npm9912/v-map**](/)

Google Maps Basemap Layer

### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `apiKey` | `string` | `api-key` |  | Google Maps API-Schlüssel. |
| `language` | `string` | `language` |  | Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US"). |
| `libraries` | `string` | `libraries` |  | Google Maps libraries to load (comma-separated string). |
| `loadState` | `error \| idle \| loading \| ready` | `load-state` | `'idle'` | Current load state of the layer. |
| `mapType` | `hybrid \| roadmap \| satellite \| terrain` | `map-type` | `'roadmap'` | Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain". |
| `maxZoom` | `number` | `max-zoom` |  | Maximum zoom level for the layer. |
| `opacity` | `number` | `opacity` | `1.0` | Opazität des Layers (0–1). |
| `region` | `string` | `region` |  | Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse. |
| `scale` | `scaleFactor1x \| scaleFactor2x \| scaleFactor4x` | `scale` |  | Scale factor for tile display. |
| `styles` | `Record<string, unknown>[] \| string` | `styles` |  | Custom styles for the Google Map (JSON array of styling objects). Can be passed as JSON string or array. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten. |

### Methods

- `getError() => Promise<VMapErrorDetail>` — Returns the last error detail, if any.

