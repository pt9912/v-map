[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerXyz

# Interface: VMapLayerXyz

Defined in: [src/components.d.ts:726](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L726)

XYZ Tile Layer

## Properties

### attributions?

> `optional` **attributions**: `string`

Defined in: [src/components.d.ts:730](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L730)

Attributions-/Copyright-Text (HTML erlaubt).

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:735](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L735)

Maximaler Zoomlevel, den der Tile-Server liefert.

#### Default

```ts
19
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:740](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L740)

Opazität (0–1).

#### Default

```ts
1
```

***

### subdomains?

> `optional` **subdomains**: `string`

Defined in: [src/components.d.ts:744](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L744)

Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:749](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L749)

Größe einer Kachel in Pixeln.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:753](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L753)

URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:758](https://github.com/pt9912/v-map/blob/a0b7ed7232508c59f39e36e564e7b87147889359/src/components.d.ts#L758)

Sichtbarkeit des XYZ-Layers.

#### Default

```ts
true
```
