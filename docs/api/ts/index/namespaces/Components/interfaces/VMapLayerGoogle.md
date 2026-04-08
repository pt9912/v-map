[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:224](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L224)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:229](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L229)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:233](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L233)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:238](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L238)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### libraries?

> `optional` **libraries**: `string`

Defined in: [src/components.d.ts:243](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L243)

Google Maps libraries to load (comma-separated string).

#### Example

```ts
"geometry,places,drawing"
```

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:248](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L248)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### mapType

> **mapType**: `"roadmap"` \| `"satellite"` \| `"terrain"` \| `"hybrid"`

Defined in: [src/components.d.ts:253](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L253)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:260](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L260)

Maximum zoom level for the layer.

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:265](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L265)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:269](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L269)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### scale?

> `optional` **scale**: `"scaleFactor1x"` \| `"scaleFactor2x"` \| `"scaleFactor4x"`

Defined in: [src/components.d.ts:274](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L274)

Scale factor for tile display.

#### Default

```ts
"scaleFactor1x"
```

***

### styles?

> `optional` **styles**: `string` \| `Record`\<`string`, `unknown`\>[]

Defined in: [src/components.d.ts:278](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L278)

Custom styles for the Google Map (JSON array of styling objects). Can be passed as JSON string or array.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:283](https://github.com/pt9912/v-map/blob/3e820fafd4a1fae7cbd3a1369e56fcdd949569c9/src/components.d.ts#L283)

Sichtbarkeit des Layers.

#### Default

```ts
true
```
