[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerXyz

# Interface: VMapLayerXyz

Defined in: [src/components.d.ts:1627](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1627)

XYZ Tile Layer

## Properties

### attributions?

> `optional` **attributions**: `string`

Defined in: [src/components.d.ts:1631](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1631)

Attributions-/Copyright-Text (HTML erlaubt).

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1636](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1636)

Maximaler Zoomlevel, den der Tile-Server liefert.

#### Default

```ts
19
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1646](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1646)

Opazität (0–1).

#### Default

```ts
1
```

***

### subdomains?

> `optional` **subdomains**: `string`

Defined in: [src/components.d.ts:1650](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1650)

Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:1655](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1655)

Größe einer Kachel in Pixeln.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1659](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1659)

URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1664](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1664)

Sichtbarkeit des XYZ-Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1641](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1641)

Wird ausgelöst, wenn der XYZ-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerXyzCustomEvent`](../../../interfaces/VMapLayerXyzCustomEvent.md)\<`void`\>

#### Returns

`void`
