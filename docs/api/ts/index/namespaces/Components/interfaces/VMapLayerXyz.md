[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerXyz

# Interface: VMapLayerXyz

Defined in: [src/components.d.ts:277](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L277)

XYZ Tile Layer

## Properties

### attributions?

> `optional` **attributions**: `string`

Defined in: [src/components.d.ts:281](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L281)

Attributions-/Copyright-Text (HTML erlaubt).

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:286](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L286)

Maximaler Zoomlevel, den der Tile-Server liefert.

#### Default

```ts
19
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:291](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L291)

Opazität (0–1).

#### Default

```ts
1
```

***

### subdomains?

> `optional` **subdomains**: `string`

Defined in: [src/components.d.ts:295](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L295)

Subdomains für parallele Tile-Anfragen (z. B. "a,b,c").

***

### tileSize?

> `optional` **tileSize**: `number`

Defined in: [src/components.d.ts:300](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L300)

Größe einer Kachel in Pixeln.

#### Default

```ts
256
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:304](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L304)

URL-Template für Kacheln, z. B. "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png".

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:309](https://github.com/pt9912/v-map/blob/4f76f9d13521580cc568aa4a5772a648ce48d55a/src/components.d.ts#L309)

Sichtbarkeit des XYZ-Layers.

#### Default

```ts
true
```
