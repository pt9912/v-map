[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerXyz

# Interface: VMapLayerXyz

Defined in: [src/components.d.ts:635](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L635)

XYZ Tile Layer

## Properties

### attributions?

> `optional` **attributions**: `string`

Defined in: [src/components.d.ts:639](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L639)

Attributions-/Copyright-Text (HTML erlaubt).

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:644](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L644)

Maximaler Zoomlevel, den der Tile-Server liefert.

#### Default

```ts
19
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:649](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L649)

Opazität (0–1).

#### Default

```ts
1
```

***

### subdomains?

> `optional` **subdomains**: `string`

Defined in: [src/components.d.ts:653](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L653)

Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:658](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L658)

Größe einer Kachel in Pixeln.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:662](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L662)

URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:667](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L667)

Sichtbarkeit des XYZ-Layers.

#### Default

```ts
true
```
