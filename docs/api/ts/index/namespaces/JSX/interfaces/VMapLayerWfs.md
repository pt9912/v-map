[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapLayerWfs

# Interface: VMapLayerWfs

Defined in: [src/components.d.ts:1943](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L1943)

## Properties

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1948](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L1948)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1953](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L1953)

Opazität (0–1).

#### Default

```ts
1
```

***

### outputFormat?

> `optional` **outputFormat**: `string`

Defined in: [src/components.d.ts:1958](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L1958)

Ausgabeformat, z. B. application/json.

#### Default

```ts
'application/json'
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:1962](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L1962)

Zusätzliche Parameter als JSON-String.

***

### srsName?

> `optional` **srsName**: `string`

Defined in: [src/components.d.ts:1967](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L1967)

Ziel-Referenzsystem, Standard EPSG:3857.

#### Default

```ts
'EPSG:3857'
```

***

### typeName

> **typeName**: `string`

Defined in: [src/components.d.ts:1971](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L1971)

Feature-Typ (typeName) des WFS.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1975](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L1975)

WFS Endpunkt (z. B. https://server/wfs).

***

### version?

> `optional` **version**: `string`

Defined in: [src/components.d.ts:1980](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L1980)

WFS Version, Standard 1.1.0.

#### Default

```ts
'1.1.0'
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1985](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L1985)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1990](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L1990)

Z-Index für Rendering.

#### Default

```ts
1000
```
