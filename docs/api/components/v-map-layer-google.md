# v-map-layer-google

Google Maps Basemap Layer

### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `apiKey` | `string` | `api-key` |  | Google Maps API-Schlüssel. |
| `language` | `string` | `language` |  | Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US"). |
| `mapType` | `hybrid \| roadmap \| satellite \| terrain` | `map-type` | `'roadmap'` | Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain". |
| `opacity` | `number` | `opacity` | `1.0` | Opazität des Layers (0–1). |
| `region` | `string` | `region` |  | Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten. |

