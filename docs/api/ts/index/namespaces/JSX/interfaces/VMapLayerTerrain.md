[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapLayerTerrain

# Interface: VMapLayerTerrain

Defined in: [src/components.d.ts:1701](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1701)

## Properties

### color?

> `optional` **color**: `string`

Defined in: [src/components.d.ts:1705](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1705)

Basisfarbe für das Terrain. Erwartet Hex oder RGB (z. B. '#ff0000' oder '255,0,0').

***

### elevationData

> **elevationData**: `string`

Defined in: [src/components.d.ts:1709](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1709)

URL zu Höhenraster im Heightmap-Format (z. B. GeoTIFF oder PNG Heightmap).

***

### elevationDecoder?

> `optional` **elevationDecoder**: `string`

Defined in: [src/components.d.ts:1713](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1713)

JSON-Repräsentation eines Elevation-Decoders (z. B. '{"r":1,"g":1,"b":1,"offset":0}').

***

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1718](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1718)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1722](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1722)

Maximale Zoomstufe für das Terrain.

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/components.d.ts:1726](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1726)

Fehler-Toleranz für das Mesh (wird an TerrainRenderer durchgereicht).

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/components.d.ts:1730](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1730)

Minimale Zoomstufe für das Terrain.

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1735](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1735)

Opazität des Layers.

#### Default

```ts
1
```

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/components.d.ts:1739](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1739)

Optionale Textur (RGB) für das Terrain.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1744](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1744)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/components.d.ts:1748](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1748)

Darstellung des Mesh als Drahtgitter.

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1753](https://github.com/pt9912/v-map/blob/73db6df097021fa1ea63592bd8118a9557fa46d1/src/components.d.ts#L1753)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
