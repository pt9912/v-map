[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:123](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L123)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:128](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L128)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:133](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L133)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### mapType

> **mapType**: `"hybrid"` \| `"roadmap"` \| `"satellite"` \| `"terrain"`

Defined in: [src/components.d.ts:138](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L138)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:146](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L146)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:150](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L150)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:155](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L155)

Sichtbarkeit des Layers.

#### Default

```ts
true
```
