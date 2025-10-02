[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerXyz

# Interface: VMapLayerXyz

Defined in: [src/components.d.ts:628](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L628)

XYZ Tile Layer

## Properties

### attributions?

> `optional` **attributions**: `string`

Defined in: [src/components.d.ts:632](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L632)

Attributions-/Copyright-Text (HTML erlaubt).

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:637](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L637)

Maximaler Zoomlevel, den der Tile-Server liefert.

#### Default

```ts
19
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:642](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L642)

Opazität (0–1).

#### Default

```ts
1
```

***

### subdomains?

> `optional` **subdomains**: `string`

Defined in: [src/components.d.ts:646](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L646)

Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:651](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L651)

Größe einer Kachel in Pixeln.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:655](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L655)

URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:660](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L660)

Sichtbarkeit des XYZ-Layers.

#### Default

```ts
true
```
