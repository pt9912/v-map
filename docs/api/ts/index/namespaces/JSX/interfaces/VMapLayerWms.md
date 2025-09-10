[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:693](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L693)

OGC WMS Layer

## Properties

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:698](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L698)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:702](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L702)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:712](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L712)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:717](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L717)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled?

> `optional` **tiled**: `boolean`

Defined in: [src/components.d.ts:722](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L722)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent?

> `optional` **transparent**: `boolean`

Defined in: [src/components.d.ts:727](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L727)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:731](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L731)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:736](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L736)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:707](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L707)

Signalisiert, dass der WMS-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerWmsCustomEvent`](../../../interfaces/VMapLayerWmsCustomEvent.md)\<`void`\>

#### Returns

`void`
