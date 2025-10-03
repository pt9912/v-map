[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGeojson

# Interface: VMapLayerGeojson

Defined in: [src/components.d.ts:1081](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1081)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:1086](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1086)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:1091](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1091)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### geojson?

> `optional` **geojson**: `unknown`

Defined in: [src/components.d.ts:1095](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1095)

Prop, die du intern nutzt/weiterverarbeitest

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:1100](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1100)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:1104](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1104)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1109](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1109)

Opazität der geojson-Kacheln (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:1114](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1114)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:1119](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1119)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:1124](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1124)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:1129](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1129)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:1134](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1134)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:1139](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1139)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:1143](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1143)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:1148](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1148)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1153](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1153)

URL to fetch GeoJSON data from. Alternative to providing data via slot.

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1158](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1158)

Whether the layer is visible on the map.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1163](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1163)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
