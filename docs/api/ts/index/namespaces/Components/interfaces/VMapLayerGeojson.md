[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerGeojson

# Interface: VMapLayerGeojson

Defined in: [src/components.d.ts:82](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L82)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:87](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L87)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:92](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L92)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### geojson?

> `optional` **geojson**: `unknown`

Defined in: [src/components.d.ts:96](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L96)

Prop, die du intern nutzt/weiterverarbeitest

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:100](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L100)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:105](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L105)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:109](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L109)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:114](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L114)

Opazität der geojson-Kacheln (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:119](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L119)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:124](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L124)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:129](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L129)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:134](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L134)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:139](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L139)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:144](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L144)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:148](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L148)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:153](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L153)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:158](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L158)

URL to fetch GeoJSON data from. Alternative to providing data via slot.

#### Default

```ts
null
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:163](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L163)

Whether the layer is visible on the map.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:168](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L168)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
