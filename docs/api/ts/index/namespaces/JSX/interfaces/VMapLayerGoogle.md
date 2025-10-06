[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:1195](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1195)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:1200](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1200)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:1205](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1205)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### libraries?

> `optional` **libraries**: `string`

Defined in: [src/components.d.ts:1210](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1210)

Google Maps libraries to load (comma-separated string).

#### Example

```ts
"geometry,places,drawing"
```

***

### mapType?

> `optional` **mapType**: `"roadmap"` \| `"satellite"` \| `"terrain"` \| `"hybrid"`

Defined in: [src/components.d.ts:1215](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1215)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1222](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1222)

Maximum zoom level for the layer.

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1232](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1232)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:1236](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1236)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### scale?

> `optional` **scale**: `"scaleFactor1x"` \| `"scaleFactor2x"` \| `"scaleFactor4x"`

Defined in: [src/components.d.ts:1241](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1241)

Scale factor for tile display.

#### Default

```ts
"scaleFactor1x"
```

***

### styles?

> `optional` **styles**: `string` \| `any`[]

Defined in: [src/components.d.ts:1245](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1245)

Custom styles for the Google Map (JSON array of styling objects). Can be passed as JSON string or array.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1250](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1250)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1227](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L1227)

Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten.
 ready

#### Parameters

##### event

[`VMapLayerGoogleCustomEvent`](../../../interfaces/VMapLayerGoogleCustomEvent.md)\<`void`\>

#### Returns

`void`
