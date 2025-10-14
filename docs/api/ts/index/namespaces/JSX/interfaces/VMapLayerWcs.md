[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWcs

# Interface: VMapLayerWcs

Defined in: [src/components.d.ts:1412](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1412)

## Properties

### coverageName

> **coverageName**: `string`

Defined in: [src/components.d.ts:1416](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1416)

Coverage-Name/ID.

***

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:1421](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1421)

Ausgabeformat, z. B. image/tiff.

#### Default

```ts
'image/tiff'
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1426](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1426)

Opazität (0–1).

#### Default

```ts
1
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:1430](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1430)

Zusätzliche Parameter als JSON-String.

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:1434](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1434)

Projektion (Projection) für die Quelle.

***

### resolutions?

> `optional` **resolutions**: `string`

Defined in: [src/components.d.ts:1438](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1438)

Auflösungen als JSON-Array, z. B. [1000,500].

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1442](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1442)

Basis-URL des WCS-Dienstes.

***

### version?

> `optional` **version**: `string`

Defined in: [src/components.d.ts:1447](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1447)

WCS-Version.

#### Default

```ts
'1.1.0'
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1452](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1452)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1457](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1457)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
