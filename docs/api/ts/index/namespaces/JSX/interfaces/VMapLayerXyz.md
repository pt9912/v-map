[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerXyz

# Interface: VMapLayerXyz

Defined in: [src/components.d.ts:741](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L741)

XYZ Tile Layer

## Properties

### attributions?

> `optional` **attributions**: `string`

Defined in: [src/components.d.ts:745](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L745)

Attributions-/Copyright-Text (HTML erlaubt).

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:750](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L750)

Maximaler Zoomlevel, den der Tile-Server liefert.

#### Default

```ts
19
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:760](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L760)

Opazität (0–1).

#### Default

```ts
1
```

***

### subdomains?

> `optional` **subdomains**: `string`

Defined in: [src/components.d.ts:764](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L764)

Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:769](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L769)

Größe einer Kachel in Pixeln.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:773](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L773)

URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:778](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L778)

Sichtbarkeit des XYZ-Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:755](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L755)

Wird ausgelöst, wenn der XYZ-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerXyzCustomEvent`](../../../interfaces/VMapLayerXyzCustomEvent.md)\<`void`\>

#### Returns

`void`
