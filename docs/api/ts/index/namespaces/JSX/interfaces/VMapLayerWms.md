[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:1175](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L1175)

OGC WMS Layer

## Properties

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:1180](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L1180)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:1184](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L1184)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1194](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L1194)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:1199](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L1199)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled?

> `optional` **tiled**: `boolean`

Defined in: [src/components.d.ts:1204](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L1204)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent?

> `optional` **transparent**: `boolean`

Defined in: [src/components.d.ts:1209](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L1209)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1213](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L1213)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1218](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L1218)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1223](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L1223)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1189](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L1189)

Signalisiert, dass der WMS-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerWmsCustomEvent`](../../../interfaces/VMapLayerWmsCustomEvent.md)\<`void`\>

#### Returns

`void`
