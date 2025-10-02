[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerXyz

# Interface: VMapLayerXyz

Defined in: [src/components.d.ts:1228](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1228)

XYZ Tile Layer

## Properties

### attributions?

> `optional` **attributions**: `string`

Defined in: [src/components.d.ts:1232](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1232)

Attributions-/Copyright-Text (HTML erlaubt).

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1237](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1237)

Maximaler Zoomlevel, den der Tile-Server liefert.

#### Default

```ts
19
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1247](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1247)

Opazität (0–1).

#### Default

```ts
1
```

***

### subdomains?

> `optional` **subdomains**: `string`

Defined in: [src/components.d.ts:1251](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1251)

Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:1256](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1256)

Größe einer Kachel in Pixeln.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1260](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1260)

URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1265](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1265)

Sichtbarkeit des XYZ-Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1242](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1242)

Wird ausgelöst, wenn der XYZ-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerXyzCustomEvent`](../../../interfaces/VMapLayerXyzCustomEvent.md)\<`void`\>

#### Returns

`void`
