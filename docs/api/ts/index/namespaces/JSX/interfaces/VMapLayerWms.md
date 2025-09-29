[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:1124](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1124)

OGC WMS Layer

## Properties

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:1129](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1129)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:1133](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1133)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1143](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1143)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:1148](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1148)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled?

> `optional` **tiled**: `boolean`

Defined in: [src/components.d.ts:1153](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1153)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent?

> `optional` **transparent**: `boolean`

Defined in: [src/components.d.ts:1158](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1158)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:1162](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1162)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1167](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1167)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1172](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1172)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1138](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1138)

Signalisiert, dass der WMS-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerWmsCustomEvent`](../../../interfaces/VMapLayerWmsCustomEvent.md)\<`void`\>

#### Returns

`void`
