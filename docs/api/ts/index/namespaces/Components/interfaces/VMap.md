[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMap

# Interface: VMap

Defined in: [src/components.d.ts:23](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L23)

## Properties

### addLayer()

> **addLayer**: (`layerConfig`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:29](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L29)

Fügt ein Layer-Element (Web Component) zur Karte hinzu. Das Layer muss kompatibel mit dem aktiven Provider sein.

#### Parameters

##### layerConfig

`any`

#### Returns

`Promise`\<`void`\>

#### Example

```ts
const layer = document.createElement('v-map-layer-osm'); await mapEl.addLayer(layer);
```

***

### center

> **center**: `string`

Defined in: [src/components.d.ts:35](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L35)

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

Defined in: [src/components.d.ts:40](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L40)

Aktiviert ein „CSS-Only“-Rendering (z. B. für einfache Tests/Layouts). Bei `true` werden keine Provider initialisiert.

#### Default

```ts
false
```

***

### flavour

> **flavour**: [`Flavour`](../../../../types/flavour/type-aliases/Flavour.md)

Defined in: [src/components.d.ts:46](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L46)

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

Defined in: [src/components.d.ts:51](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L51)

Liefert die aktive Provider-Instanz (z. B. OL-, Leaflet- oder Deck-Wrapper). Nützlich für fortgeschrittene Integrationen.

#### Returns

`Promise`\<[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)\>

Promise mit der Provider-Instanz oder `undefined`, falls noch nicht bereit.

***

### isMapProviderAvailable()

> **isMapProviderAvailable**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:57](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L57)

Prüft, ob ein bestimmter Provider im aktuellen Build/Runtime verfügbar ist.

#### Returns

`Promise`\<`boolean`\>

`true`, wenn verfügbar, sonst `false`.

***

### setView()

> **setView**: (`coordinates`, `zoom`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:65](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L65)

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

Defined in: [src/components.d.ts:70](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L70)

Falls true, injiziert v-map automatisch die Import-Map.

#### Default

```ts
true
```

***

### zoom

> **zoom**: `number`

Defined in: [src/components.d.ts:75](https://github.com/pt9912/v-map/blob/93b8cee058f776f62d4555f57b7731d033702264/src/components.d.ts#L75)

Anfangs-Zoomstufe. Skala abhängig vom Provider (typisch 0–20).

#### Default

```ts
3
```
