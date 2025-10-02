[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerGeojson

# Interface: VMapLayerGeojson

Defined in: [src/components.d.ts:84](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L84)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:89](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L89)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:94](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L94)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### geojson?

> `optional` **geojson**: `unknown`

Defined in: [src/components.d.ts:98](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L98)

Prop, die du intern nutzt/weiterverarbeitest

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:102](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L102)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:107](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L107)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:111](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L111)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:116](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L116)

Opazität der geojson-Kacheln (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:121](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L121)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:126](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L126)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:131](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L131)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:136](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L136)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:141](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L141)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:146](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L146)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:150](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L150)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:155](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L155)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:160](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L160)

URL to fetch GeoJSON data from. Alternative to providing data via slot.

#### Default

```ts
null
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:165](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L165)

Whether the layer is visible on the map.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:170](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L170)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
