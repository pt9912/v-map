[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:2088](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L2088)

OGC WMS Layer

## Properties

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:2093](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L2093)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:2097](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L2097)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:2102](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L2102)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:2112](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L2112)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:2117](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L2117)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled?

> `optional` **tiled**: `boolean`

Defined in: [src/components.d.ts:2122](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L2122)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent?

> `optional` **transparent**: `boolean`

Defined in: [src/components.d.ts:2127](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L2127)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:2131](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L2131)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:2136](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L2136)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:2141](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L2141)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:2107](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L2107)

Signalisiert, dass der WMS-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerWmsCustomEvent`](../../../interfaces/VMapLayerWmsCustomEvent.md)\<`void`\>

#### Returns

`void`
