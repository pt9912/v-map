[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:580](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L580)

OGC WMS Layer

## Properties

### format

> **format**: `string`

Defined in: [src/components.d.ts:585](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L585)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:589](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L589)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:594](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L594)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:599](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L599)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled

> **tiled**: `boolean`

Defined in: [src/components.d.ts:604](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L604)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent

> **transparent**: `boolean`

Defined in: [src/components.d.ts:609](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L609)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:613](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L613)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:618](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L618)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:623](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L623)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```
