[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGeojson

# Interface: VMapLayerGeojson

Defined in: [src/components.d.ts:1086](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1086)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:1091](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1091)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:1096](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1096)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### geojson?

> `optional` **geojson**: `unknown`

Defined in: [src/components.d.ts:1100](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1100)

Prop, die du intern nutzt/weiterverarbeitest

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:1105](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1105)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:1109](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1109)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1114](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1114)

Opazität der geojson-Kacheln (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:1119](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1119)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:1124](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1124)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:1129](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1129)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:1134](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1134)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:1139](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1139)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:1144](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1144)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:1148](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1148)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:1153](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1153)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1158](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1158)

URL to fetch GeoJSON data from. Alternative to providing data via slot.

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1163](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1163)

Whether the layer is visible on the map.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1168](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1168)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
