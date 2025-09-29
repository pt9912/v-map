[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerWkt

# Interface: VMapLayerWkt

Defined in: [src/components.d.ts:1033](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1033)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:1038](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1038)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:1043](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1043)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:1048](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1048)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:1052](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1052)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1062](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1062)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:1067](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1067)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:1072](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1072)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:1077](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1077)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:1082](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1082)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:1087](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1087)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:1092](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1092)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:1096](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1096)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:1101](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1101)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1105](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1105)

URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1110](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1110)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wkt?

> `optional` **wkt**: `string`

Defined in: [src/components.d.ts:1114](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1114)

WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1119](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1119)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1057](https://github.com/pt9912/v-map/blob/e04291a8bb419e1e0d2b30dae72595fa16a77e3b/src/components.d.ts#L1057)

Signalisiert, dass das WKT-Layer initialisiert ist.
 ready

#### Parameters

##### event

[`VMapLayerWktCustomEvent`](../../../interfaces/VMapLayerWktCustomEvent.md)\<`void`\>

#### Returns

`void`
