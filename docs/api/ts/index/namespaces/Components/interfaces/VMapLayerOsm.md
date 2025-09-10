[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerOsm

# Interface: VMapLayerOsm

Defined in: [src/components.d.ts:166](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L166)

## Properties

### addToMap()

> **addToMap**: (`mapElement`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:170](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L170)

Fügt den OSM-Layer der Karte hinzu (vom Eltern-<v-map> aufgerufen).

#### Parameters

##### mapElement

`HTMLVMapElement`

#### Returns

`Promise`\<`void`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:175](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L175)

Opazität der OSM-Kacheln (0–1).

#### Default

```ts
1
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:180](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L180)

Sichtbarkeit des Layers

#### Default

```ts
true
```
