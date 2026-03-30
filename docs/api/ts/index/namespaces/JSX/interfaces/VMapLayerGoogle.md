[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:1463](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1463)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:1468](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1468)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:1473](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1473)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### libraries?

> `optional` **libraries**: `string`

Defined in: [src/components.d.ts:1478](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1478)

Google Maps libraries to load (comma-separated string).

#### Example

```ts
"geometry,places,drawing"
```

***

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1483](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1483)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### mapType?

> `optional` **mapType**: `"roadmap"` \| `"satellite"` \| `"terrain"` \| `"hybrid"`

Defined in: [src/components.d.ts:1488](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1488)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1495](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1495)

Maximum zoom level for the layer.

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1505](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1505)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:1509](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1509)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### scale?

> `optional` **scale**: `"scaleFactor1x"` \| `"scaleFactor2x"` \| `"scaleFactor4x"`

Defined in: [src/components.d.ts:1514](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1514)

Scale factor for tile display.

#### Default

```ts
"scaleFactor1x"
```

***

### styles?

> `optional` **styles**: `string` \| `Record`\<`string`, `unknown`\>[]

Defined in: [src/components.d.ts:1518](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1518)

Custom styles for the Google Map (JSON array of styling objects). Can be passed as JSON string or array.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1523](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1523)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1500](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1500)

Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten.
 ready

#### Parameters

##### event

[`VMapLayerGoogleCustomEvent`](../../../interfaces/VMapLayerGoogleCustomEvent.md)\<`void`\>

#### Returns

`void`
