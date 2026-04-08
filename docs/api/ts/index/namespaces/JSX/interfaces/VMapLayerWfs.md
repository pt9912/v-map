[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapLayerWfs

# Interface: VMapLayerWfs

Defined in: [src/components.d.ts:1839](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L1839)

## Properties

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1844](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L1844)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1849](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L1849)

Opazität (0–1).

#### Default

```ts
1
```

***

### outputFormat?

> `optional` **outputFormat**: `string`

Defined in: [src/components.d.ts:1854](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L1854)

Ausgabeformat, z. B. application/json.

#### Default

```ts
'application/json'
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:1858](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L1858)

Zusätzliche Parameter als JSON-String.

***

### srsName?

> `optional` **srsName**: `string`

Defined in: [src/components.d.ts:1863](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L1863)

Ziel-Referenzsystem, Standard EPSG:3857.

#### Default

```ts
'EPSG:3857'
```

***

### typeName

> **typeName**: `string`

Defined in: [src/components.d.ts:1867](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L1867)

Feature-Typ (typeName) des WFS.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1871](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L1871)

WFS Endpunkt (z. B. https://server/wfs).

***

### version?

> `optional` **version**: `string`

Defined in: [src/components.d.ts:1876](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L1876)

WFS Version, Standard 1.1.0.

#### Default

```ts
'1.1.0'
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1881](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L1881)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1886](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L1886)

Z-Index für Rendering.

#### Default

```ts
1000
```
