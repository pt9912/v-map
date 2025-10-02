[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:426](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L426)

OGC WMS Layer

## Properties

### format

> **format**: `string`

Defined in: [src/components.d.ts:431](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L431)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:435](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L435)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:440](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L440)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:445](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L445)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled

> **tiled**: `boolean`

Defined in: [src/components.d.ts:450](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L450)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent

> **transparent**: `boolean`

Defined in: [src/components.d.ts:455](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L455)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:459](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L459)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:464](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L464)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:469](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/components.d.ts#L469)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```
