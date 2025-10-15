[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:1328](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1328)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:1333](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1333)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:1338](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1338)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### libraries?

> `optional` **libraries**: `string`

Defined in: [src/components.d.ts:1343](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1343)

Google Maps libraries to load (comma-separated string).

#### Example

```ts
"geometry,places,drawing"
```

***

### mapType?

> `optional` **mapType**: `"roadmap"` \| `"satellite"` \| `"terrain"` \| `"hybrid"`

Defined in: [src/components.d.ts:1348](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1348)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1355](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1355)

Maximum zoom level for the layer.

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1365](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1365)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:1369](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1369)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### scale?

> `optional` **scale**: `"scaleFactor1x"` \| `"scaleFactor2x"` \| `"scaleFactor4x"`

Defined in: [src/components.d.ts:1374](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1374)

Scale factor for tile display.

#### Default

```ts
"scaleFactor1x"
```

***

### styles?

> `optional` **styles**: `string` \| `any`[]

Defined in: [src/components.d.ts:1378](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1378)

Custom styles for the Google Map (JSON array of styling objects). Can be passed as JSON string or array.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1383](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1383)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1360](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L1360)

Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten.
 ready

#### Parameters

##### event

[`VMapLayerGoogleCustomEvent`](../../../interfaces/VMapLayerGoogleCustomEvent.md)\<`void`\>

#### Returns

`void`
