[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:572](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L572)

OGC WMS Layer

## Properties

### format

> **format**: `string`

Defined in: [src/components.d.ts:577](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L577)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:581](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L581)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:586](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L586)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:591](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L591)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled

> **tiled**: `boolean`

Defined in: [src/components.d.ts:596](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L596)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent

> **transparent**: `boolean`

Defined in: [src/components.d.ts:601](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L601)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:605](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L605)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:610](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L610)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:615](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L615)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```
