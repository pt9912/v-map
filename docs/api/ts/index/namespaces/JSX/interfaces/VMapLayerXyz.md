[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerXyz

# Interface: VMapLayerXyz

Defined in: [src/components.d.ts:1854](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1854)

XYZ Tile Layer

## Properties

### attributions?

> `optional` **attributions**: `string`

Defined in: [src/components.d.ts:1858](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1858)

Attributions-/Copyright-Text (HTML erlaubt).

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1863](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1863)

Maximaler Zoomlevel, den der Tile-Server liefert.

#### Default

```ts
19
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1873](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1873)

Opazität (0–1).

#### Default

```ts
1
```

***

### subdomains?

> `optional` **subdomains**: `string`

Defined in: [src/components.d.ts:1877](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1877)

Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:1882](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1882)

Größe einer Kachel in Pixeln.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1886](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1886)

URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1891](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1891)

Sichtbarkeit des XYZ-Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1868](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1868)

Wird ausgelöst, wenn der XYZ-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerXyzCustomEvent`](../../../interfaces/VMapLayerXyzCustomEvent.md)\<`void`\>

#### Returns

`void`
