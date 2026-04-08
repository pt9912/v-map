[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerWkt

# Interface: VMapLayerWkt

Defined in: [src/components.d.ts:722](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L722)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:727](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L727)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:732](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L732)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:736](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L736)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:740](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L740)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:745](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L745)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:749](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L749)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:754](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L754)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:759](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L759)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:764](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L764)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:769](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L769)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:774](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L774)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:779](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L779)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:784](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L784)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:789](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L789)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:793](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L793)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:798](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L798)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:802](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L802)

URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:807](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L807)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wkt?

> `optional` **wkt**: `string`

Defined in: [src/components.d.ts:811](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L811)

WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:816](https://github.com/pt9912/v-map/blob/9b0d3fed6c914cb65dd3c754df6ad1c9ac12df7b/src/components.d.ts#L816)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
