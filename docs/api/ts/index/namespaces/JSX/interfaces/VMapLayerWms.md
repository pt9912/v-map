[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:774](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L774)

OGC WMS Layer

## Properties

### format?

> `optional` **format**: `string`

Defined in: [src/components.d.ts:779](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L779)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:783](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L783)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:793](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L793)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:798](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L798)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled?

> `optional` **tiled**: `boolean`

Defined in: [src/components.d.ts:803](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L803)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent?

> `optional` **transparent**: `boolean`

Defined in: [src/components.d.ts:808](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L808)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:812](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L812)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:817](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L817)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:788](https://github.com/pt9912/v-map/blob/a7dd4349afbfe2947d40f945b3226f293512e795/src/components.d.ts#L788)

Signalisiert, dass der WMS-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerWmsCustomEvent`](../../../interfaces/VMapLayerWmsCustomEvent.md)\<`void`\>

#### Returns

`void`
