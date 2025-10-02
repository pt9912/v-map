[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMap

# Interface: VMap

Defined in: [src/components.d.ts:801](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L801)

## Properties

### center?

> `optional` **center**: `string`

Defined in: [src/components.d.ts:807](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L807)

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

Defined in: [src/components.d.ts:812](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L812)

Aktiviert ein „CSS-Only“-Rendering (z. B. für einfache Tests/Layouts). Bei `true` werden keine Provider initialisiert.

#### Default

```ts
false
```

***

### flavour?

> `optional` **flavour**: [`Flavour`](../../../../types/flavour/type-aliases/Flavour.md)

Defined in: [src/components.d.ts:818](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L818)

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

Defined in: [src/components.d.ts:828](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L828)

Falls true, injiziert v-map automatisch die Import-Map.

#### Default

```ts
true
```

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [src/components.d.ts:833](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L833)

Anfangs-Zoomstufe. Skala abhängig vom Provider (typisch 0–20).

#### Default

```ts
3
```

## Events

### onMapProviderReady()?

> `optional` **onMapProviderReady**: (`event`) => `void`

Defined in: [src/components.d.ts:823](https://github.com/pt9912/v-map/blob/dc11bbe80f9910b9501652c936ba377a6a601edf/src/components.d.ts#L823)

Wird ausgelöst, sobald der Karten-Provider initialisiert wurde und Layers entgegennimmt. `detail` enthält `{ provider, flavour }`.
 mapProviderReady

#### Parameters

##### event

[`VMapCustomEvent`](../../../interfaces/VMapCustomEvent.md)\<[`MapProviderDetail`](../../../../utils/events/interfaces/MapProviderDetail.md)\>

#### Returns

`void`
