[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGeojson

# Interface: VMapLayerGeojson

Defined in: [src/components.d.ts:904](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L904)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:909](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L909)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:914](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L914)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### geojson?

> `optional` **geojson**: `unknown`

Defined in: [src/components.d.ts:918](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L918)

Prop, die du intern nutzt/weiterverarbeitest

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:923](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L923)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:927](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L927)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:932](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L932)

Opazität der geojson-Kacheln (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:937](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L937)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:942](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L942)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:947](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L947)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:952](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L952)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:957](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L957)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:962](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L962)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:966](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L966)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:971](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L971)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:976](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L976)

URL to fetch GeoJSON data from. Alternative to providing data via slot.

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:981](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L981)

Whether the layer is visible on the map.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:986](https://github.com/pt9912/v-map/blob/8f0817afc9b5ea7f80423de35105ce1ef20ead85/src/components.d.ts#L986)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
