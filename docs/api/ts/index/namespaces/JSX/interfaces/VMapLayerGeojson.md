[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGeojson

# Interface: VMapLayerGeojson

Defined in: [src/components.d.ts:851](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L851)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:856](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L856)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:861](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L861)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### geojson?

> `optional` **geojson**: `unknown`

Defined in: [src/components.d.ts:865](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L865)

Prop, die du intern nutzt/weiterverarbeitest

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:870](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L870)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:874](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L874)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:879](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L879)

Opazität der geojson-Kacheln (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:884](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L884)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:889](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L889)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:894](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L894)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:899](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L899)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:904](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L904)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:909](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L909)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:913](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L913)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:918](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L918)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:923](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L923)

URL to fetch GeoJSON data from. Alternative to providing data via slot.

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:928](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L928)

Whether the layer is visible on the map.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:933](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L933)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
