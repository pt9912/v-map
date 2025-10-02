[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMap

# Interface: VMap

Defined in: [src/components.d.ts:1023](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1023)

## Properties

### center?

> `optional` **center**: `string`

Defined in: [src/components.d.ts:1029](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1029)

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

Defined in: [src/components.d.ts:1034](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1034)

Aktiviert ein „CSS-Only“-Rendering (z. B. für einfache Tests/Layouts). Bei `true` werden keine Provider initialisiert.

#### Default

```ts
false
```

***

### flavour?

> `optional` **flavour**: [`Flavour`](../../../../types/flavour/type-aliases/Flavour.md)

Defined in: [src/components.d.ts:1040](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1040)

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

Defined in: [src/components.d.ts:1050](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1050)

Falls true, injiziert v-map automatisch die Import-Map.

#### Default

```ts
true
```

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [src/components.d.ts:1055](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1055)

Anfangs-Zoomstufe. Skala abhängig vom Provider (typisch 0–20).

#### Default

```ts
3
```

## Events

### onMapProviderReady()?

> `optional` **onMapProviderReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1045](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L1045)

Wird ausgelöst, sobald der Karten-Provider initialisiert wurde und Layers entgegennimmt. `detail` enthält `{ provider, flavour }`.
 mapProviderReady

#### Parameters

##### event

[`VMapCustomEvent`](../../../interfaces/VMapCustomEvent.md)\<[`MapProviderDetail`](../../../../utils/events/interfaces/MapProviderDetail.md)\>

#### Returns

`void`
