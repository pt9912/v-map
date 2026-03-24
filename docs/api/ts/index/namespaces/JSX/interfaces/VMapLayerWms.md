[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:1801](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1801)

OGC WMS Layer

## Properties

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:1806](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1806)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:1810](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1810)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1820](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1820)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:1825](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1825)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled?

> `optional` **tiled**: `boolean`

Defined in: [src/components.d.ts:1830](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1830)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent?

> `optional` **transparent**: `boolean`

Defined in: [src/components.d.ts:1835](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1835)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1839](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1839)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1844](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1844)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1849](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1849)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1815](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1815)

Signalisiert, dass der WMS-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerWmsCustomEvent`](../../../interfaces/VMapLayerWmsCustomEvent.md)\<`void`\>

#### Returns

`void`
