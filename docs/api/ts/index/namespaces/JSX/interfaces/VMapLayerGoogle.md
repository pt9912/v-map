[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:1567](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1567)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:1572](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1572)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:1577](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1577)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### libraries?

> `optional` **libraries**: `string`

Defined in: [src/components.d.ts:1582](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1582)

Google Maps libraries to load (comma-separated string).

#### Example

```ts
"geometry,places,drawing"
```

***

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1587](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1587)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### mapType?

> `optional` **mapType**: `"roadmap"` \| `"satellite"` \| `"terrain"` \| `"hybrid"`

Defined in: [src/components.d.ts:1592](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1592)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### maxZoom?

> `optional` **maxZoom**: `number`

Defined in: [src/components.d.ts:1599](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1599)

Maximum zoom level for the layer.

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1609](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1609)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:1613](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1613)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### scale?

> `optional` **scale**: `"scaleFactor1x"` \| `"scaleFactor2x"` \| `"scaleFactor4x"`

Defined in: [src/components.d.ts:1618](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1618)

Scale factor for tile display.

#### Default

```ts
"scaleFactor1x"
```

***

### styles?

> `optional` **styles**: `string` \| `Record`\<`string`, `unknown`\>[]

Defined in: [src/components.d.ts:1622](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1622)

Custom styles for the Google Map (JSON array of styling objects). Can be passed as JSON string or array.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1627](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1627)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1604](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1604)

Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten.
 ready

#### Parameters

##### event

[`VMapLayerGoogleCustomEvent`](../../../interfaces/VMapLayerGoogleCustomEvent.md)\<`void`\>

#### Returns

`void`
