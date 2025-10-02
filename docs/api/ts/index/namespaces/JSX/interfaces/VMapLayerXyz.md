[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerXyz

# Interface: VMapLayerXyz

Defined in: [src/components.d.ts:1310](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L1310)

XYZ Tile Layer

## Properties

### attributions?

> `optional` **attributions**: `string`

Defined in: [src/components.d.ts:1314](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L1314)

Attributions-/Copyright-Text (HTML erlaubt).

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1319](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L1319)

Maximaler Zoomlevel, den der Tile-Server liefert.

#### Default

```ts
19
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1329](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L1329)

Opazität (0–1).

#### Default

```ts
1
```

***

### subdomains?

> `optional` **subdomains**: `string`

Defined in: [src/components.d.ts:1333](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L1333)

Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:1338](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L1338)

Größe einer Kachel in Pixeln.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1342](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L1342)

URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1347](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L1347)

Sichtbarkeit des XYZ-Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1324](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L1324)

Wird ausgelöst, wenn der XYZ-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerXyzCustomEvent`](../../../interfaces/VMapLayerXyzCustomEvent.md)\<`void`\>

#### Returns

`void`
