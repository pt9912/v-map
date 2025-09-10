# v-map-layer-osm



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `opacity` | `number` | `opacity` | `1.0` | Opazität der OSM-Kacheln (0–1). |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Wird ausgelöst, wenn der OSM-Layer bereit ist. |

### Methods

- `addToMap(mapElement: HTMLVMapElement) => [object Object]` — Fügt den OSM-Layer der Karte hinzu (vom Eltern-<v-map> aufgerufen).

