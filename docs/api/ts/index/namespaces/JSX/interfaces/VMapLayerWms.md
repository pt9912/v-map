[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:1574](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1574)

OGC WMS Layer

## Properties

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:1579](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1579)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:1583](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1583)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1593](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1593)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:1598](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1598)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled?

> `optional` **tiled**: `boolean`

Defined in: [src/components.d.ts:1603](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1603)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent?

> `optional` **transparent**: `boolean`

Defined in: [src/components.d.ts:1608](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1608)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1612](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1612)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1617](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1617)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1622](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1622)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1588](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1588)

Signalisiert, dass der WMS-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerWmsCustomEvent`](../../../interfaces/VMapLayerWmsCustomEvent.md)\<`void`\>

#### Returns

`void`
