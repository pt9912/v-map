[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerXyz

# Interface: VMapLayerXyz

Defined in: [src/components.d.ts:1232](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1232)

XYZ Tile Layer

## Properties

### attributions?

> `optional` **attributions**: `string`

Defined in: [src/components.d.ts:1236](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1236)

Attributions-/Copyright-Text (HTML erlaubt).

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1241](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1241)

Maximaler Zoomlevel, den der Tile-Server liefert.

#### Default

```ts
19
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1251](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1251)

Opazität (0–1).

#### Default

```ts
1
```

***

### subdomains?

> `optional` **subdomains**: `string`

Defined in: [src/components.d.ts:1255](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1255)

Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:1260](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1260)

Größe einer Kachel in Pixeln.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1264](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1264)

URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1269](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1269)

Sichtbarkeit des XYZ-Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1246](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L1246)

Wird ausgelöst, wenn der XYZ-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerXyzCustomEvent`](../../../interfaces/VMapLayerXyzCustomEvent.md)\<`void`\>

#### Returns

`void`
