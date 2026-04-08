[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapLayerWkt

# Interface: VMapLayerWkt

Defined in: [src/components.d.ts:1888](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1888)

## Properties

### fillColor?

> `optional` **fillColor**: `string`

Defined in: [src/components.d.ts:1893](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1893)

Fill color for polygon geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,0.3)'
```

***

### fillOpacity?

> `optional` **fillOpacity**: `number`

Defined in: [src/components.d.ts:1898](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1898)

Fill opacity for polygon geometries (0-1)

#### Default

```ts
0.3
```

***

### iconSize?

> `optional` **iconSize**: `string`

Defined in: [src/components.d.ts:1903](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1903)

Icon size as [width, height] in pixels (comma-separated string like "32,32")

#### Default

```ts
"32,32"
```

***

### iconUrl?

> `optional` **iconUrl**: `string`

Defined in: [src/components.d.ts:1907](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1907)

Icon URL for point features (alternative to pointColor/pointRadius)

***

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1912](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1912)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1922](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1922)

Globale Opazität (0–1).

#### Default

```ts
1
```

***

### pointColor?

> `optional` **pointColor**: `string`

Defined in: [src/components.d.ts:1927](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1927)

Point color for point geometries (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### pointRadius?

> `optional` **pointRadius**: `number`

Defined in: [src/components.d.ts:1932](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1932)

Point radius for point geometries in pixels

#### Default

```ts
6
```

***

### strokeColor?

> `optional` **strokeColor**: `string`

Defined in: [src/components.d.ts:1937](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1937)

Stroke color for lines and polygon outlines (CSS color value)

#### Default

```ts
'rgba(0,100,255,1)'
```

***

### strokeOpacity?

> `optional` **strokeOpacity**: `number`

Defined in: [src/components.d.ts:1942](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1942)

Stroke opacity (0-1)

#### Default

```ts
1
```

***

### strokeWidth?

> `optional` **strokeWidth**: `number`

Defined in: [src/components.d.ts:1947](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1947)

Stroke width in pixels

#### Default

```ts
2
```

***

### textColor?

> `optional` **textColor**: `string`

Defined in: [src/components.d.ts:1952](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1952)

Text color for labels (CSS color value)

#### Default

```ts
'#000000'
```

***

### textProperty?

> `optional` **textProperty**: `string`

Defined in: [src/components.d.ts:1956](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1956)

Text property name from feature properties to display as label

***

### textSize?

> `optional` **textSize**: `number`

Defined in: [src/components.d.ts:1961](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1961)

Text size for labels in pixels

#### Default

```ts
12
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1965](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1965)

URL, von der eine WKT-Geometrie geladen wird (alternativ zu `wkt`).

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1970](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1970)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### wkt?

> `optional` **wkt**: `string`

Defined in: [src/components.d.ts:1974](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1974)

WKT-Geometrie (z. B. "POINT(11.57 48.14)" oder "POLYGON((...))").

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1979](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1979)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
1000
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1917](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L1917)

Signalisiert, dass das WKT-Layer initialisiert ist.
 ready

#### Parameters

##### event

[`VMapLayerWktCustomEvent`](../../../interfaces/VMapLayerWktCustomEvent.md)\<`void`\>

#### Returns

`void`
