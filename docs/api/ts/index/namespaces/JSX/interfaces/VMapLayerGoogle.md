[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:1215](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1215)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:1220](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1220)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:1225](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1225)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### libraries?

> `optional` **libraries**: `string`

Defined in: [src/components.d.ts:1230](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1230)

Google Maps libraries to load (comma-separated string).

#### Example

```ts
"geometry,places,drawing"
```

***

### mapType?

> `optional` **mapType**: `"roadmap"` \| `"satellite"` \| `"terrain"` \| `"hybrid"`

Defined in: [src/components.d.ts:1235](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1235)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1242](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1242)

Maximum zoom level for the layer.

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1252](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1252)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:1256](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1256)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### scale?

> `optional` **scale**: `"scaleFactor1x"` \| `"scaleFactor2x"` \| `"scaleFactor4x"`

Defined in: [src/components.d.ts:1261](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1261)

Scale factor for tile display.

#### Default

```ts
"scaleFactor1x"
```

***

### styles?

> `optional` **styles**: `string` \| `any`[]

Defined in: [src/components.d.ts:1265](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1265)

Custom styles for the Google Map (JSON array of styling objects). Can be passed as JSON string or array.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1270](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1270)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1247](https://github.com/pt9912/v-map/blob/e518137190bb28e24057fa358ac57a05d246037f/src/components.d.ts#L1247)

Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten.
 ready

#### Parameters

##### event

[`VMapLayerGoogleCustomEvent`](../../../interfaces/VMapLayerGoogleCustomEvent.md)\<`void`\>

#### Returns

`void`
