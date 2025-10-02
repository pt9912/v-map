[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWkt

# Interface: VMapLayerWkt

Defined in: [src/components.d.ts:1479](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1479)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:1484](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1484)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:1489](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1489)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:1494](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1494)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:1498](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1498)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1508](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1508)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:1513](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1513)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:1518](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1518)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:1523](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1523)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:1528](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1528)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:1533](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1533)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:1538](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1538)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:1542](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1542)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:1547](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1547)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1551](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1551)

URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1556](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1556)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wkt?

> `optional` **wkt**: `string`

Defined in: [src/components.d.ts:1560](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1560)

WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1565](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1565)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1503](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1503)

Signalisiert, dass das WKT-Layer initialisiert ist.
 ready

#### Parameters

##### event

[`VMapLayerWktCustomEvent`](../../../interfaces/VMapLayerWktCustomEvent.md)\<`void`\>

#### Returns

`void`
