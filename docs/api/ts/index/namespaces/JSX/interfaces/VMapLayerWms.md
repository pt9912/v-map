[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:1570](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1570)

OGC WMS Layer

## Properties

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:1575](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1575)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:1579](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1579)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1589](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1589)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:1594](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1594)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled?

> `optional` **tiled**: `boolean`

Defined in: [src/components.d.ts:1599](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1599)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent?

> `optional` **transparent**: `boolean`

Defined in: [src/components.d.ts:1604](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1604)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1608](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1608)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1613](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1613)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1618](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1618)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1584](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L1584)

Signalisiert, dass der WMS-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerWmsCustomEvent`](../../../interfaces/VMapLayerWmsCustomEvent.md)\<`void`\>

#### Returns

`void`
