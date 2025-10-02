[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:479](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L479)

OGC WMS Layer

## Properties

### format

> **format**: `string`

Defined in: [src/components.d.ts:484](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L484)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:488](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L488)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:493](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L493)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:498](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L498)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled

> **tiled**: `boolean`

Defined in: [src/components.d.ts:503](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L503)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent

> **transparent**: `boolean`

Defined in: [src/components.d.ts:508](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L508)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:512](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L512)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:517](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L517)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:522](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L522)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```
