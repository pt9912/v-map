[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerXyz

# Interface: VMapLayerXyz

Defined in: [src/components.d.ts:301](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L301)

XYZ Tile Layer

## Properties

### attributions?

> `optional` **attributions**: `string`

Defined in: [src/components.d.ts:305](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L305)

Attributions-/Copyright-Text (HTML erlaubt).

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:310](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L310)

Maximaler Zoomlevel, den der Tile-Server liefert.

#### Default

```ts
19
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:315](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L315)

Opazität (0–1).

#### Default

```ts
1
```

***

### subdomains?

> `optional` **subdomains**: `string`

Defined in: [src/components.d.ts:319](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L319)

Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:324](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L324)

Größe einer Kachel in Pixeln.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:328](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L328)

URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:333](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L333)

Sichtbarkeit des XYZ-Layers.

#### Default

```ts
true
```
