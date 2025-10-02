[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerTerrain

# Interface: VMapLayerTerrain

Defined in: [src/components.d.ts:1312](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1312)

## Properties

### color?

> `optional` **color**: `string`

Defined in: [src/components.d.ts:1316](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1316)

Basisfarbe für das Terrain. Erwartet Hex oder RGB (z. B. '#ff0000' oder '255,0,0').

***

### elevationData

> **elevationData**: `string`

Defined in: [src/components.d.ts:1320](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1320)

URL zu Höhenraster im Heightmap-Format (z. B. GeoTIFF oder PNG Heightmap).

***

### elevationDecoder?

> `optional` **elevationDecoder**: `string`

Defined in: [src/components.d.ts:1324](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1324)

JSON-Repräsentation eines Elevation-Decoders (z. B. '{"r":1,"g":1,"b":1,"offset":0}').

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1328](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1328)

Maximale Zoomstufe für das Terrain.

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/components.d.ts:1332](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1332)

Fehler-Toleranz für das Mesh (wird an TerrainRenderer durchgereicht).

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/components.d.ts:1336](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1336)

Minimale Zoomstufe für das Terrain.

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1341](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1341)

Opazität des Layers.

#### Default

```ts
1
```

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/components.d.ts:1345](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1345)

Optionale Textur (RGB) für das Terrain.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1350](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1350)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/components.d.ts:1354](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1354)

Darstellung des Mesh als Drahtgitter.

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1359](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1359)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
