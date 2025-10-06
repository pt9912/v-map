[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:193](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L193)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:198](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L198)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:203](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L203)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### libraries?

> `optional` **libraries**: `string`

Defined in: [src/components.d.ts:208](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L208)

Google Maps libraries to load (comma-separated string).

#### Example

```ts
"geometry,places,drawing"
```

***

### mapType

> **mapType**: `"roadmap"` \| `"satellite"` \| `"terrain"` \| `"hybrid"`

Defined in: [src/components.d.ts:213](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L213)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:220](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L220)

Maximum zoom level for the layer.

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:225](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L225)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:229](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L229)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### scale?

> `optional` **scale**: `"scaleFactor1x"` \| `"scaleFactor2x"` \| `"scaleFactor4x"`

Defined in: [src/components.d.ts:234](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L234)

Scale factor for tile display.

#### Default

```ts
"scaleFactor1x"
```

***

### styles?

> `optional` **styles**: `string` \| `any`[]

Defined in: [src/components.d.ts:238](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L238)

Custom styles for the Google Map (JSON array of styling objects). Can be passed as JSON string or array.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:243](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/components.d.ts#L243)

Sichtbarkeit des Layers.

#### Default

```ts
true
```
