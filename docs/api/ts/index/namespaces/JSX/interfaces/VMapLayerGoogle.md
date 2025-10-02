[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:1193](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1193)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:1198](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1198)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:1203](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1203)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### libraries?

> `optional` **libraries**: `string`

Defined in: [src/components.d.ts:1208](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1208)

Google Maps libraries to load (comma-separated string).

#### Example

```ts
"geometry,places,drawing"
```

***

### mapType?

> `optional` **mapType**: `"roadmap"` \| `"satellite"` \| `"terrain"` \| `"hybrid"`

Defined in: [src/components.d.ts:1213](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1213)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1220](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1220)

Maximum zoom level for the layer.

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1230](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1230)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:1234](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1234)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### scale?

> `optional` **scale**: `"scaleFactor1x"` \| `"scaleFactor2x"` \| `"scaleFactor4x"`

Defined in: [src/components.d.ts:1239](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1239)

Scale factor for tile display.

#### Default

```ts
"scaleFactor1x"
```

***

### styles?

> `optional` **styles**: `string` \| `any`[]

Defined in: [src/components.d.ts:1243](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1243)

Custom styles for the Google Map (JSON array of styling objects). Can be passed as JSON string or array.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1248](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1248)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1225](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/components.d.ts#L1225)

Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten.
 ready

#### Parameters

##### event

[`VMapLayerGoogleCustomEvent`](../../../interfaces/VMapLayerGoogleCustomEvent.md)\<`void`\>

#### Returns

`void`
