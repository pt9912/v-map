[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWcs

# Interface: VMapLayerWcs

Defined in: [src/components.d.ts:1787](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1787)

## Properties

### coverageName

> **coverageName**: `string`

Defined in: [src/components.d.ts:1791](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1791)

Coverage-Name/ID.

***

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:1796](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1796)

Ausgabeformat, z. B. image/tiff.

#### Default

```ts
'image/tiff'
```

***

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1801](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1801)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1806](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1806)

Opazität (0–1).

#### Default

```ts
1
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:1810](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1810)

Zusätzliche Parameter als JSON-String.

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:1814](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1814)

Projektion (Projection) für die Quelle.

***

### resolutions?

> `optional` **resolutions**: `string`

Defined in: [src/components.d.ts:1818](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1818)

Auflösungen als JSON-Array, z. B. [1000,500].

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1822](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1822)

Basis-URL des WCS-Dienstes.

***

### version?

> `optional` **version**: `string`

Defined in: [src/components.d.ts:1827](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1827)

WCS-Version.

#### Default

```ts
'1.1.0'
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1832](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1832)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1837](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1837)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
