[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:552](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L552)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:557](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L557)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:562](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L562)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### mapType?

> `optional` **mapType**: `"hybrid"` \| `"roadmap"` \| `"satellite"` \| `"terrain"`

Defined in: [src/components.d.ts:567](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L567)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:580](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L580)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:584](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L584)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:589](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L589)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:575](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/components.d.ts#L575)

Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten.
 ready

#### Parameters

##### event

[`VMapLayerGoogleCustomEvent`](../../../interfaces/VMapLayerGoogleCustomEvent.md)\<`void`\>

#### Returns

`void`
