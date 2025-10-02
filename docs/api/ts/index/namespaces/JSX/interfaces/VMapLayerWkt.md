[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWkt

# Interface: VMapLayerWkt

Defined in: [src/components.d.ts:1275](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1275)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:1280](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1280)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:1285](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1285)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:1290](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1290)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:1294](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1294)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1304](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1304)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:1309](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1309)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:1314](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1314)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:1319](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1319)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:1324](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1324)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:1329](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1329)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:1334](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1334)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:1338](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1338)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:1343](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1343)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1347](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1347)

URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1352](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1352)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wkt?

> `optional` **wkt**: `string`

Defined in: [src/components.d.ts:1356](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1356)

WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1361](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1361)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1299](https://github.com/pt9912/v-map/blob/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c/src/components.d.ts#L1299)

Signalisiert, dass das WKT-Layer initialisiert ist.
 ready

#### Parameters

##### event

[`VMapLayerWktCustomEvent`](../../../interfaces/VMapLayerWktCustomEvent.md)\<`void`\>

#### Returns

`void`
