[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerWms

# Interface: VMapLayerWms

Defined in: [src/components.d.ts:780](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L780)

OGC WMS Layer

## Properties

### format

> **format**: `string`

Defined in: [src/components.d.ts:785](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L785)

Bildformat des GetMap-Requests.

#### Default

```ts
"image/png"
```

***

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:789](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L789)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### layers

> **layers**: `string`

Defined in: [src/components.d.ts:793](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L793)

Kommagetrennte Layer-Namen (z. B. "topp:states").

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:798](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L798)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:803](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L803)

Globale Opazität des WMS-Layers (0–1).

#### Default

```ts
1
```

***

### styles?

> `optional` **styles**: `string`

Defined in: [src/components.d.ts:808](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L808)

WMS-`STYLES` Parameter (kommagetrennt).

#### Default

```ts
""
```

***

### tiled

> **tiled**: `boolean`

Defined in: [src/components.d.ts:813](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L813)

Tiled/geslicete Requests verwenden (falls Server unterstützt).

#### Default

```ts
true
```

***

### transparent

> **transparent**: `boolean`

Defined in: [src/components.d.ts:818](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L818)

Transparente Kacheln anfordern.

#### Default

```ts
true
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:822](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L822)

Basis-URL des WMS-Dienstes (GetMap-Endpunkt ohne Query-Parameter).

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:827](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L827)

Sichtbarkeit des WMS-Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:832](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L832)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```
