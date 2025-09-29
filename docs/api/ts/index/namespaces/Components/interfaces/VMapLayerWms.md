[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:377](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L377)

OGC WMS Layer

## Properties

### format

> **format**: `string`

Defined in: [src/components.d.ts:382](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L382)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:386](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L386)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:391](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L391)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:396](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L396)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled

> **tiled**: `boolean`

Defined in: [src/components.d.ts:401](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L401)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent

> **transparent**: `boolean`

Defined in: [src/components.d.ts:406](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L406)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:410](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L410)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:415](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L415)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:420](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/components.d.ts#L420)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```
