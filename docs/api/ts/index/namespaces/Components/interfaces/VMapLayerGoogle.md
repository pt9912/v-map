[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerGoogle

# Interface: VMapLayerGoogle

Defined in: [src/components.d.ts:105](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L105)

Google Maps Basemap Layer

## Properties

### apiKey?

> `optional` **apiKey**: `string`

Defined in: [src/components.d.ts:110](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L110)

Google Maps API-Schlüssel.

#### Example

```ts
<v-map-layer-google api-key="YOUR_KEY"></v-map-layer-google>
```

***

### language?

> `optional` **language**: `string`

Defined in: [src/components.d.ts:115](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L115)

Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").

#### Default

```ts
"en"
```

***

### mapType

> **mapType**: `"hybrid"` \| `"roadmap"` \| `"satellite"` \| `"terrain"`

Defined in: [src/components.d.ts:120](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L120)

Karten-Typ: "roadmap" | "satellite" | "hybrid" | "terrain".

#### Default

```ts
"roadmap"
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:128](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L128)

Opazität des Layers (0–1).

#### Default

```ts
1
```

***

### region?

> `optional` **region**: `string`

Defined in: [src/components.d.ts:132](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L132)

Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse.

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:137](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L137)

Sichtbarkeit des Layers.

#### Default

```ts
true
```
