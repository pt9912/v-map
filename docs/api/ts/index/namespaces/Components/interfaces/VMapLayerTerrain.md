[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerTerrain

# Interface: VMapLayerTerrain

Defined in: [src/components.d.ts:400](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L400)

## Properties

### color?

> `optional` **color**: `string`

Defined in: [src/components.d.ts:404](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L404)

Basisfarbe für das Terrain. Erwartet Hex oder RGB (z. B. '#ff0000' oder '255,0,0').

***

### elevationData

> **elevationData**: `string`

Defined in: [src/components.d.ts:408](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L408)

URL zu Höhenraster im Heightmap-Format (z. B. GeoTIFF oder PNG Heightmap).

***

### elevationDecoder?

> `optional` **elevationDecoder**: `string`

Defined in: [src/components.d.ts:412](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L412)

JSON-Repräsentation eines Elevation-Decoders (z. B. '{"r":1,"g":1,"b":1,"offset":0}').

***

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:416](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L416)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:420](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L420)

Liefert `true`, sobald das Terrain-Layer initialisiert wurde.

#### Returns

`Promise`\<`boolean`\>

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:425](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L425)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:429](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L429)

Maximale Zoomstufe für das Terrain.

***

### meshMaxError?

> `optional` **meshMaxError**: `number`

Defined in: [src/components.d.ts:433](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L433)

Fehler-Toleranz für das Mesh (wird an TerrainRenderer durchgereicht).

***

### minZoom?

> `optional` **minZoom**: `number`

Defined in: [src/components.d.ts:437](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L437)

Minimale Zoomstufe für das Terrain.

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:442](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L442)

Opazität des Layers.

#### Default

```ts
1
```

***

### texture?

> `optional` **texture**: `string`

Defined in: [src/components.d.ts:446](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L446)

Optionale Textur (RGB) für das Terrain.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:451](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L451)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wireframe?

> `optional` **wireframe**: `boolean`

Defined in: [src/components.d.ts:455](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L455)

Darstellung des Mesh als Drahtgitter.

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:460](https://github.com/pt9912/v-map/blob/0ecd77eb3e79ea2919fb3e00d13376b10828962a/src/components.d.ts#L460)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
