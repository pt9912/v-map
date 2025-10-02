[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:965](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L965)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:970](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L970)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:975](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L975)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### libraries?

> `optional` **libraries**: `string`

Defined in: [src/components.d.ts:980](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L980)

Google Maps libraries to load (comma-separated string).

#### Example

```ts
"geometry,places,drawing"
```

***

### mapType?

> `optional` **mapType**: `"hybrid"` \| `"roadmap"` \| `"satellite"` \| `"terrain"`

Defined in: [src/components.d.ts:985](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L985)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:992](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L992)

Maximum zoom level for the layer.

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1002](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1002)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:1006](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1006)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### scale?

> `optional` **scale**: `"scaleFactor1x"` \| `"scaleFactor2x"` \| `"scaleFactor4x"`

Defined in: [src/components.d.ts:1011](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1011)

Scale factor for tile display.

#### Default

```ts
"scaleFactor1x"
```

***

### styles?

> `optional` **styles**: `string` \| `any`[]

Defined in: [src/components.d.ts:1015](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1015)

Custom styles for the Google Map (JSON array of styling objects). Can be passed as JSON string or array.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1020](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L1020)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:997](https://github.com/pt9912/v-map/blob/37aca36597098f225317a63dc1bb84263078aa55/src/components.d.ts#L997)

Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten.
 ready

#### Parameters

##### event

[`VMapLayerGoogleCustomEvent`](../../../interfaces/VMapLayerGoogleCustomEvent.md)\<`void`\>

#### Returns

`void`
