[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerTerrain

# Interface: VMapLayerTerrain

Defined in: [src/components.d.ts:1308](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L1308)

## Properties

### color?

> `optional` **color**: `string`

Defined in: [src/components.d.ts:1312](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L1312)

Basisfarbe für das Terrain. Erwartet Hex oder RGB (z. B. '#ff0000' oder '255,0,0').

***

### elevationData

> **elevationData**: `string`

Defined in: [src/components.d.ts:1316](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L1316)

URL zu Höhenraster im Heightmap-Format (z. B. GeoTIFF oder PNG Heightmap).

***

### elevationDecoder?

> `optional` **elevationDecoder**: `string`

Defined in: [src/components.d.ts:1320](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L1320)

JSON-Repräsentation eines Elevation-Decoders (z. B. '{"r":1,"g":1,"b":1,"offset":0}').

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1324](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L1324)

Maximale Zoomstufe für das Terrain.

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/components.d.ts:1328](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L1328)

Fehler-Toleranz für das Mesh (wird an TerrainRenderer durchgereicht).

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/components.d.ts:1332](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L1332)

Minimale Zoomstufe für das Terrain.

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1337](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L1337)

Opazität des Layers.

#### Default

```ts
1
```

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/components.d.ts:1341](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L1341)

Optionale Textur (RGB) für das Terrain.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1346](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L1346)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/components.d.ts:1350](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L1350)

Darstellung des Mesh als Drahtgitter.

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1355](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L1355)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
