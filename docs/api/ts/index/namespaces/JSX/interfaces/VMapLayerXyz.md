[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerXyz

# Interface: VMapLayerXyz

Defined in: [src/components.d.ts:1623](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1623)

XYZ Tile Layer

## Properties

### attributions?

> `optional` **attributions**: `string`

Defined in: [src/components.d.ts:1627](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1627)

Attributions-/Copyright-Text (HTML erlaubt).

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1632](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1632)

Maximaler Zoomlevel, den der Tile-Server liefert.

#### Default

```ts
19
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1642](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1642)

Opazität (0–1).

#### Default

```ts
1
```

***

### subdomains?

> `optional` **subdomains**: `string`

Defined in: [src/components.d.ts:1646](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1646)

Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:1651](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1651)

Größe einer Kachel in Pixeln.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1655](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1655)

URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1660](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1660)

Sichtbarkeit des XYZ-Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1637](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1637)

Wird ausgelöst, wenn der XYZ-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerXyzCustomEvent`](../../../interfaces/VMapLayerXyzCustomEvent.md)\<`void`\>

#### Returns

`void`
