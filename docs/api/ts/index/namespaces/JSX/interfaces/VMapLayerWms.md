[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:1572](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1572)

OGC WMS Layer

## Properties

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:1577](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1577)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:1581](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1581)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1591](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1591)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:1596](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1596)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled?

> `optional` **tiled**: `boolean`

Defined in: [src/components.d.ts:1601](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1601)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent?

> `optional` **transparent**: `boolean`

Defined in: [src/components.d.ts:1606](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1606)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1610](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1610)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1615](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1615)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1620](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1620)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1586](https://github.com/pt9912/v-map/blob/f81ff1bbdf118b11c319c21963bbb30bc13345a6/src/components.d.ts#L1586)

Signalisiert, dass der WMS-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerWmsCustomEvent`](../../../interfaces/VMapLayerWmsCustomEvent.md)\<`void`\>

#### Returns

`void`
