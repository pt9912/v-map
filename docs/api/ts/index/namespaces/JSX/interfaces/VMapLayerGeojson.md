[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGeojson

# Interface: VMapLayerGeojson

Defined in: [src/components.d.ts:855](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L855)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:860](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L860)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:865](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L865)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### geojson?

> `optional` **geojson**: `unknown`

Defined in: [src/components.d.ts:869](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L869)

Prop, die du intern nutzt/weiterverarbeitest

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:874](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L874)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:878](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L878)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:883](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L883)

Opazität der geojson-Kacheln (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:888](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L888)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:893](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L893)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:898](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L898)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:903](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L903)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:908](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L908)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:913](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L913)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:917](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L917)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:922](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L922)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:927](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L927)

URL to fetch GeoJSON data from. Alternative to providing data via slot.

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:932](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L932)

Whether the layer is visible on the map.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:937](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L937)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
