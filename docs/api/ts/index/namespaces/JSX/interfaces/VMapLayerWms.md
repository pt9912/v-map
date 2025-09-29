[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:1088](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L1088)

OGC WMS Layer

## Properties

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:1093](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L1093)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:1097](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L1097)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1107](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L1107)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:1112](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L1112)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled?

> `optional` **tiled**: `boolean`

Defined in: [src/components.d.ts:1117](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L1117)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent?

> `optional` **transparent**: `boolean`

Defined in: [src/components.d.ts:1122](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L1122)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1126](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L1126)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1131](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L1131)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1136](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L1136)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1102](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L1102)

Signalisiert, dass der WMS-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerWmsCustomEvent`](../../../interfaces/VMapLayerWmsCustomEvent.md)\<`void`\>

#### Returns

`void`
