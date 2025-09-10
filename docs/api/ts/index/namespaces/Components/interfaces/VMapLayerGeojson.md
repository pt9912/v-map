[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerGeojson

# Interface: VMapLayerGeojson

Defined in: [src/components.d.ts:77](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L77)

## Properties

### addToMap()

> **addToMap**: (`mapElement`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:82](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L82)

Fügt den Layer der aktuellen Karte hinzu (wird meist vom Elternelement aufgerufen).

#### Parameters

##### mapElement

`HTMLVMapElement`

#### Returns

`Promise`\<`void`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:87](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L87)

Globale Deck-/Provider-Opacity des Layers (0–1).

#### Default

```ts
1
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:91](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L91)

URL zu einer GeoJSON-Ressource. Alternativ kann GeoJSON direkt über einen Prop/Slot gesetzt werden.

***

### vectorStyle?

> `optional` **vectorStyle**: [`StyleConfig`](../../../../types/styleconfig/interfaces/StyleConfig.md)

Defined in: [src/components.d.ts:95](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L95)

Vektor-Style-Funktion bzw. Style-Objekt (providerabhängig). Erlaubt die Anpassung von Füllfarbe, Linienbreite etc.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:100](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L100)

Sichtbarkeit des Layers

#### Default

```ts
true
```
