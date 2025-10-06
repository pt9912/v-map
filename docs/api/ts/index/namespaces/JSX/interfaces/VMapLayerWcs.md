[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWcs

# Interface: VMapLayerWcs

Defined in: [src/components.d.ts:1392](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1392)

## Properties

### coverageName

> **coverageName**: `string`

Defined in: [src/components.d.ts:1396](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1396)

Coverage-Name/ID.

***

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:1401](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1401)

Ausgabeformat, z. B. image/tiff.

#### Default

```ts
'image/tiff'
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1406](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1406)

Opazität (0–1).

#### Default

```ts
1
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:1410](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1410)

Zusätzliche Parameter als JSON-String.

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:1414](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1414)

Projektion (Projection) für die Quelle.

***

### resolutions?

> `optional` **resolutions**: `string`

Defined in: [src/components.d.ts:1418](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1418)

Auflösungen als JSON-Array, z. B. [1000,500].

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1422](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1422)

Basis-URL des WCS-Dienstes.

***

### version?

> `optional` **version**: `string`

Defined in: [src/components.d.ts:1427](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1427)

WCS-Version.

#### Default

```ts
'1.1.0'
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1432](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1432)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1437](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1437)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
