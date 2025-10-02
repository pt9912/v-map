[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMap

# Interface: VMap

Defined in: [src/components.d.ts:797](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L797)

## Properties

### center?

> `optional` **center**: `string`

Defined in: [src/components.d.ts:803](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L803)

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

Defined in: [src/components.d.ts:808](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L808)

Aktiviert ein „CSS-Only“-Rendering (z. B. für einfache Tests/Layouts). Bei `true` werden keine Provider initialisiert.

#### Default

```ts
false
```

***

### flavour?

> `optional` **flavour**: [`Flavour`](../../../../types/flavour/type-aliases/Flavour.md)

Defined in: [src/components.d.ts:814](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L814)

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

Defined in: [src/components.d.ts:824](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L824)

Falls true, injiziert v-map automatisch die Import-Map.

#### Default

```ts
true
```

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [src/components.d.ts:829](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L829)

Anfangs-Zoomstufe. Skala abhängig vom Provider (typisch 0–20).

#### Default

```ts
3
```

## Events

### onMapProviderReady()?

> `optional` **onMapProviderReady**: (`event`) => `void`

Defined in: [src/components.d.ts:819](https://github.com/pt9912/v-map/blob/7ec83fbafdc736b2858f5dda8728bd671ed42485/src/components.d.ts#L819)

Wird ausgelöst, sobald der Karten-Provider initialisiert wurde und Layers entgegennimmt. `detail` enthält `{ provider, flavour }`.
 mapProviderReady

#### Parameters

##### event

[`VMapCustomEvent`](../../../interfaces/VMapCustomEvent.md)\<[`MapProviderDetail`](../../../../utils/events/interfaces/MapProviderDetail.md)\>

#### Returns

`void`
