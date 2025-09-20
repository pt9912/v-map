[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:625](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L625)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:630](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L630)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:635](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L635)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### mapType?

> `optional` **mapType**: `"hybrid"` \| `"roadmap"` \| `"satellite"` \| `"terrain"`

Defined in: [src/components.d.ts:640](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L640)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:653](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L653)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:657](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L657)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:662](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L662)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:648](https://github.com/pt9912/v-map/blob/3d02de42805026a915c1c4fe1a3a23929a27af3b/src/components.d.ts#L648)

Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten.
 ready

#### Parameters

##### event

[`VMapLayerGoogleCustomEvent`](../../../interfaces/VMapLayerGoogleCustomEvent.md)\<`void`\>

#### Returns

`void`
