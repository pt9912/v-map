[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:258](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L258)

OGC WMS Layer

## Properties

### format

> **format**: `string`

Defined in: [src/components.d.ts:263](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L263)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:267](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L267)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:272](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L272)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:277](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L277)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled

> **tiled**: `boolean`

Defined in: [src/components.d.ts:282](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L282)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent

> **transparent**: `boolean`

Defined in: [src/components.d.ts:287](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L287)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:291](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L291)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:296](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L296)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```
