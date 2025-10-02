[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWkt

# Interface: VMapLayerWkt

Defined in: [src/components.d.ts:490](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L490)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:495](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L495)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:500](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L500)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:504](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L504)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:509](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L509)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:513](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L513)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:518](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L518)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:523](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L523)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:528](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L528)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:533](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L533)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:538](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L538)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:543](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L543)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:548](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L548)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:552](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L552)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:557](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L557)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:561](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L561)

URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:566](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L566)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wkt?

> `optional` **wkt**: `string`

Defined in: [src/components.d.ts:570](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L570)

WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:575](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L575)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
