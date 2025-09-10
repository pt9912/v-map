# v-map-layer-geojson



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                        | Type          | Default     |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------ | ------------- | ----------- |
| `opacity`     | `opacity`      | Globale Deck-/Provider-Opacity des Layers (0–1).                                                                   | `number`      | `1.0`       |
| `url`         | `url`          | URL zu einer GeoJSON-Ressource. Alternativ kann GeoJSON direkt über einen Prop/Slot gesetzt werden.                | `string`      | `undefined` |
| `vectorStyle` | `vector-style` | Vektor-Style-Funktion bzw. Style-Objekt (providerabhängig). Erlaubt die Anpassung von Füllfarbe, Linienbreite etc. | `StyleConfig` | `undefined` |
| `visible`     | `visible`      | Sichtbarkeit des Layers                                                                                            | `boolean`     | `true`      |


## Methods

### `addToMap(mapElement: HTMLVMapElement) => Promise<void>`

Fügt den Layer der aktuellen Karte hinzu (wird meist vom Elternelement aufgerufen).

#### Parameters

| Name         | Type              | Description |
| ------------ | ----------------- | ----------- |
| `mapElement` | `HTMLVMapElement` |             |

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
