# v-map-layer-geojson



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `opacity` | `number` | `opacity` | `1.0` | Globale Deck-/Provider-Opacity des Layers (0–1). |
| `url` | `string` | `url` |  | URL zu einer GeoJSON-Ressource. Alternativ kann GeoJSON direkt über einen Prop/Slot gesetzt werden. |
| `vectorStyle` | `StyleConfig` | `vector-style` |  | Vektor-Style-Funktion bzw. Style-Objekt (providerabhängig). Erlaubt die Anpassung von Füllfarbe, Linienbreite etc. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers |

### Methods

- `addToMap(mapElement: HTMLVMapElement) => [object Object]` — Fügt den Layer der aktuellen Karte hinzu (wird meist vom Elternelement aufgerufen).

