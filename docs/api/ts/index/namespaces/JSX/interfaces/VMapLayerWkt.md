[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWkt

# Interface: VMapLayerWkt

Defined in: [src/components.d.ts:1483](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1483)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:1488](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1488)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:1493](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1493)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:1498](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1498)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:1502](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1502)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1512](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1512)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:1517](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1517)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:1522](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1522)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:1527](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1527)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:1532](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1532)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:1537](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1537)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:1542](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1542)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:1546](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1546)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:1551](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1551)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1555](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1555)

URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1560](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1560)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wkt?

> `optional` **wkt**: `string`

Defined in: [src/components.d.ts:1564](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1564)

WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1569](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1569)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1507](https://github.com/pt9912/v-map/blob/65bd44681676885ec61d0b75dc361b6a52cea066/src/components.d.ts#L1507)

Signalisiert, dass das WKT-Layer initialisiert ist.
 ready

#### Parameters

##### event

[`VMapLayerWktCustomEvent`](../../../interfaces/VMapLayerWktCustomEvent.md)\<`void`\>

#### Returns

`void`
