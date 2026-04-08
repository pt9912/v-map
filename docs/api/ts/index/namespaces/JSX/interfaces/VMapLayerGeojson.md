[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapLayerGeojson

# Interface: VMapLayerGeojson

Defined in: [src/components.d.ts:1428](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1428)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:1433](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1433)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:1438](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1438)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### geojson?

> `optional` **geojson**: `string`

Defined in: [src/components.d.ts:1442](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1442)

Prop, die du intern nutzt/weiterverarbeitest

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:1447](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1447)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:1451](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1451)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1456](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1456)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1461](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1461)

Opazität der geojson-Kacheln (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:1466](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1466)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:1471](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1471)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:1476](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1476)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:1481](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1481)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:1486](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1486)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:1491](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1491)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:1495](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1495)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:1500](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1500)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1505](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1505)

URL to fetch GeoJSON data from. Alternative to providing data via slot.

#### Default

```ts
null
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1510](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1510)

Whether the layer is visible on the map.

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1515](https://github.com/pt9912/v-map/blob/a0bdcbc34adf78a8cde5bfab26d8bd16314805e5/src/components.d.ts#L1515)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
