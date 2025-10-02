[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWkt

# Interface: VMapLayerWkt

Defined in: [src/components.d.ts:1084](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1084)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:1089](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1089)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:1094](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1094)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:1099](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1099)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:1103](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1103)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1113](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1113)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:1118](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1118)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:1123](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1123)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:1128](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1128)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:1133](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1133)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:1138](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1138)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:1143](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1143)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:1147](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1147)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:1152](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1152)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1156](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1156)

URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1161](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1161)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wkt?

> `optional` **wkt**: `string`

Defined in: [src/components.d.ts:1165](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1165)

WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1170](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1170)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1108](https://github.com/pt9912/v-map/blob/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b/src/components.d.ts#L1108)

Signalisiert, dass das WKT-Layer initialisiert ist.
 ready

#### Parameters

##### event

[`VMapLayerWktCustomEvent`](../../../interfaces/VMapLayerWktCustomEvent.md)\<`void`\>

#### Returns

`void`
