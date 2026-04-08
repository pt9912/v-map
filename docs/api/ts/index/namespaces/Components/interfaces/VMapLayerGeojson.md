[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerGeojson

# Interface: VMapLayerGeojson

Defined in: [src/components.d.ts:115](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L115)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:120](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L120)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:125](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L125)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### geojson?

> `optional` **geojson**: `string`

Defined in: [src/components.d.ts:129](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L129)

Prop, die du intern nutzt/weiterverarbeitest

***

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:133](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L133)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### getLayerId()

> **getLayerId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:137](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L137)

Returns the internal layer ID used by the map provider.

#### Returns

`Promise`\<`string`\>

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:142](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L142)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:146](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L146)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:151](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L151)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:156](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L156)

Opazität der geojson-Kacheln (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:161](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L161)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:166](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L166)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:171](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L171)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:176](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L176)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:181](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L181)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:186](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L186)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:190](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L190)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:195](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L195)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:200](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L200)

URL to fetch GeoJSON data from. Alternative to providing data via slot.

#### Default

```ts
null
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:205](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L205)

Whether the layer is visible on the map.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:210](https://github.com/pt9912/v-map/blob/f91c4c7c743d7a08ad3bec18b6100b23210f3a9f/src/components.d.ts#L210)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```
