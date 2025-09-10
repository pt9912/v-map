# v-map-layer-scatterplot



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `data` | `string` | `data` |  | Datenquelle für Punkte. Erwartet Objekte mit mindestens einer Position in [lon, lat]. Zusätzliche Felder sind erlaubt. |
| `getFillColor` | `[number, number, number, number?] \| string` | `get-fill-color` | `'#3388ff'` | Funktion zur Bestimmung der Füllfarbe je Punkt. Rückgabe z. B. [r,g,b] oder CSS-Farbe (providerabhängig). |
| `getRadius` | `number` | `get-radius` | `1000` | Funktion/konstanter Wert für den Punkt-Radius. |
| `opacity` | `number` | `opacity` | `1.0` | Globale Opazität (0–1). |
| `url` | `string` | `url` |  | Optionaler Remote-Pfad für JSON/CSV/GeoJSON, der zu `data` geladen wird. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit des Layers. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `ready` | `void` | Wird ausgelöst, sobald der Scatterplot registriert wurde. |

