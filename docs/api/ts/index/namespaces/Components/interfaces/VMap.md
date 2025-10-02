[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMap

# Interface: VMap

Defined in: [src/components.d.ts:25](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L25)

## Properties

### center

> **center**: `string`

Defined in: [src/components.d.ts:31](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L31)

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

### cssMode

> **cssMode**: [`CssMode`](../../../../types/cssmode/type-aliases/CssMode.md)

Defined in: [src/components.d.ts:36](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L36)

Aktiviert ein „CSS-Only“-Rendering (z. B. für einfache Tests/Layouts). Bei `true` werden keine Provider initialisiert.

#### Default

```ts
false
```

***

### flavour

> **flavour**: [`Flavour`](../../../../types/flavour/type-aliases/Flavour.md)

Defined in: [src/components.d.ts:42](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L42)

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

### getMapProvider()

> **getMapProvider**: () => `Promise`\<[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)\>

Defined in: [src/components.d.ts:47](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L47)

Liefert die aktive Provider-Instanz (z. B. OL-, Leaflet- oder Deck-Wrapper). Nützlich für fortgeschrittene Integrationen.

#### Returns

`Promise`\<[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)\>

Promise mit der Provider-Instanz oder `undefined`, falls noch nicht bereit.

***

### isMapProviderAvailable()

> **isMapProviderAvailable**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:53](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L53)

Prüft, ob ein bestimmter Provider im aktuellen Build/Runtime verfügbar ist.

#### Returns

`Promise`\<`boolean`\>

`true`, wenn verfügbar, sonst `false`.

***

### setView()

> **setView**: (`coordinates`, `zoom`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:61](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L61)

Setzt Kartenzentrum und Zoom (optional animiert).

#### Parameters

##### coordinates

\[`number`, `number`\]

##### zoom

`number`

Zoomstufe

#### Returns

`Promise`\<`void`\>

#### Example

```ts
await mapEl.setView([7.1, 50.7], 10, { animate: true, duration: 400 });
```

***

### useDefaultImportMap

> **useDefaultImportMap**: `boolean`

Defined in: [src/components.d.ts:66](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L66)

Falls true, injiziert v-map automatisch die Import-Map.

#### Default

```ts
true
```

***

### zoom

> **zoom**: `number`

Defined in: [src/components.d.ts:71](https://github.com/pt9912/v-map/blob/1ce14191249825d0bb62b52654bd1cde2162b581/src/components.d.ts#L71)

Anfangs-Zoomstufe. Skala abhängig vom Provider (typisch 0–20).

#### Default

```ts
3
```
