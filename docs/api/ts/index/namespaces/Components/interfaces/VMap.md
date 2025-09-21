[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMap

# Interface: VMap

Defined in: [src/components.d.ts:21](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L21)

## Properties

### addLayer()

> **addLayer**: (`layerConfig`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:27](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L27)

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

Defined in: [src/components.d.ts:33](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L33)

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

Defined in: [src/components.d.ts:38](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L38)

Aktiviert ein „CSS-Only“-Rendering (z. B. für einfache Tests/Layouts). Bei `true` werden keine Provider initialisiert.

#### Default

```ts
false
```

***

### flavour

> **flavour**: [`Flavour`](../../../../types/flavour/type-aliases/Flavour.md)

Defined in: [src/components.d.ts:44](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L44)

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

Defined in: [src/components.d.ts:49](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L49)

Liefert die aktive Provider-Instanz (z. B. OL-, Leaflet- oder Deck-Wrapper). Nützlich für fortgeschrittene Integrationen.

#### Returns

`Promise`\<[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)\>

Promise mit der Provider-Instanz oder `undefined`, falls noch nicht bereit.

***

### isMapProviderAvailable()

> **isMapProviderAvailable**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:55](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L55)

Prüft, ob ein bestimmter Provider im aktuellen Build/Runtime verfügbar ist.

#### Returns

`Promise`\<`boolean`\>

`true`, wenn verfügbar, sonst `false`.

***

### setView()

> **setView**: (`coordinates`, `zoom`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:63](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L63)

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

Defined in: [src/components.d.ts:68](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L68)

Falls true, injiziert v-map automatisch die Import-Map.

#### Default

```ts
true
```

***

### zoom

> **zoom**: `number`

Defined in: [src/components.d.ts:73](https://github.com/pt9912/v-map/blob/efc62233e3d3263be3b179af93948b9a907bd60f/src/components.d.ts#L73)

Anfangs-Zoomstufe. Skala abhängig vom Provider (typisch 0–20).

#### Default

```ts
3
```
