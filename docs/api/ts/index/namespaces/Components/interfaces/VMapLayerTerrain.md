[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerTerrain

# Interface: VMapLayerTerrain

Defined in: [src/components.d.ts:301](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L301)

## Properties

### color?

> `optional` **color**: `string`

Defined in: [src/components.d.ts:305](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L305)

Basisfarbe für das Terrain. Erwartet Hex oder RGB (z. B. '#ff0000' oder '255,0,0').

***

### elevationData

> **elevationData**: `string`

Defined in: [src/components.d.ts:309](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L309)

URL zu Höhenraster im Heightmap-Format (z. B. GeoTIFF oder PNG Heightmap).

***

### elevationDecoder?

> `optional` **elevationDecoder**: `string`

Defined in: [src/components.d.ts:313](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L313)

JSON-Repräsentation eines Elevation-Decoders (z. B. '{"r":1,"g":1,"b":1,"offset":0}').

***

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:317](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L317)

Liefert `true`, sobald das Terrain-Layer initialisiert wurde.

#### Returns

`Promise`\<`boolean`\>

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:321](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L321)

Maximale Zoomstufe für das Terrain.

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/components.d.ts:325](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L325)

Fehler-Toleranz für das Mesh (wird an TerrainRenderer durchgereicht).

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/components.d.ts:329](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L329)

Minimale Zoomstufe für das Terrain.

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:334](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L334)

Opazität des Layers.

#### Default

```ts
1
```

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/components.d.ts:338](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L338)

Optionale Textur (RGB) für das Terrain.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:343](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L343)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/components.d.ts:347](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L347)

Darstellung des Mesh als Drahtgitter.

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:352](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L352)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
