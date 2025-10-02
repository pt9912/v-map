[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWkt

# Interface: VMapLayerWkt

Defined in: [src/components.d.ts:336](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L336)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:341](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L341)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:346](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L346)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:350](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L350)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:355](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L355)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:359](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L359)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:364](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L364)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:369](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L369)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:374](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L374)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:379](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L379)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:384](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L384)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:389](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L389)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:394](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L394)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:398](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L398)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:403](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L403)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:407](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L407)

URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:412](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L412)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wkt?

> `optional` **wkt**: `string`

Defined in: [src/components.d.ts:416](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L416)

WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:421](https://github.com/pt9912/v-map/blob/47bc96dbb630838d8cacfa2e04b7f693dba4efe3/src/components.d.ts#L421)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
