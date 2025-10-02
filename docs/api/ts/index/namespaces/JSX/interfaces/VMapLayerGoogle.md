[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:1018](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L1018)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:1023](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L1023)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:1028](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L1028)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### libraries?

> `optional` **libraries**: `string`

Defined in: [src/components.d.ts:1033](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L1033)

Google Maps libraries to load (comma-separated string).

#### Example

```ts
"geometry,places,drawing"
```

***

### mapType?

> `optional` **mapType**: `"roadmap"` \| `"satellite"` \| `"terrain"` \| `"hybrid"`

Defined in: [src/components.d.ts:1038](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L1038)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1045](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L1045)

Maximum zoom level for the layer.

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1055](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L1055)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:1059](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L1059)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### scale?

> `optional` **scale**: `"scaleFactor1x"` \| `"scaleFactor2x"` \| `"scaleFactor4x"`

Defined in: [src/components.d.ts:1064](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L1064)

Scale factor for tile display.

#### Default

```ts
"scaleFactor1x"
```

***

### styles?

> `optional` **styles**: `string` \| `any`[]

Defined in: [src/components.d.ts:1068](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L1068)

Custom styles for the Google Map (JSON array of styling objects). Can be passed as JSON string or array.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1073](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L1073)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1050](https://github.com/pt9912/v-map/blob/5a00c1d02e817ebdb5ae521c04a945d173fb9c9d/src/components.d.ts#L1050)

Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten.
 ready

#### Parameters

##### event

[`VMapLayerGoogleCustomEvent`](../../../interfaces/VMapLayerGoogleCustomEvent.md)\<`void`\>

#### Returns

`void`
