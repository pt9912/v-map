[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMap

# Interface: VMap

Defined in: [src/components.d.ts:540](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L540)

## Properties

### center?

> `optional` **center**: `string`

Defined in: [src/components.d.ts:546](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L546)

Mittelpunkt der Karte im **WGS84**-Koordinatensystem. Erwartet [lon, lat] (Längengrad, Breitengrad).

#### Default

```ts
[0, 0]
```

#### Example

```ts
<v-map center="[11.5761, 48.1371]" zoom="12"></v-map>
```

***

### cssMode?

> `optional` **cssMode**: [`CssMode`](../../../../types/cssmode/type-aliases/CssMode.md)

Defined in: [src/components.d.ts:551](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L551)

Aktiviert ein „CSS-Only“-Rendering (z. B. für einfache Tests/Layouts). Bei `true` werden keine Provider initialisiert.

#### Default

```ts
false
```

***

### flavour?

> `optional` **flavour**: [`Flavour`](../../../../types/flavour/type-aliases/Flavour.md)

Defined in: [src/components.d.ts:557](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L557)

Zu verwendender Karten-Provider. Unterstützte Werte: "ol" | "leaflet" | "cesium" | "deck".

#### Default

```ts
"ol"
```

#### Example

```ts
<v-map flavour="leaflet"></v-map>
```

***

### useDefaultImportMap?

> `optional` **useDefaultImportMap**: `boolean`

Defined in: [src/components.d.ts:567](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L567)

Falls true, injiziert v-map automatisch die Import-Map.

#### Default

```ts
true
```

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [src/components.d.ts:572](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L572)

Anfangs-Zoomstufe. Skala abhängig vom Provider (typisch 0–20).

#### Default

```ts
3
```

## Events

### onMapProviderReady()?

> `optional` **onMapProviderReady**: (`event`) => `void`

Defined in: [src/components.d.ts:562](https://github.com/pt9912/v-map/blob/f611b314e38c23a3ef6dba0cd5a8ca81485bbe8e/src/components.d.ts#L562)

Wird ausgelöst, sobald der Karten-Provider initialisiert wurde und Layers entgegennimmt. `detail` enthält `{ provider, flavour }`.
 mapProviderReady

#### Parameters

##### event

[`VMapCustomEvent`](../../../interfaces/VMapCustomEvent.md)\<[`MapProviderDetail`](../../../../utils/events/interfaces/MapProviderDetail.md)\>

#### Returns

`void`
