[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMap

# Interface: VMap

Defined in: [src/components.d.ts:23](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L23)

## Properties

### center

> **center**: `string`

Defined in: [src/components.d.ts:29](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L29)

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

Defined in: [src/components.d.ts:34](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L34)

Aktiviert ein „CSS-Only“-Rendering (z. B. für einfache Tests/Layouts). Bei `true` werden keine Provider initialisiert.

#### Default

```ts
false
```

***

### flavour

> **flavour**: [`Flavour`](../../../../types/flavour/type-aliases/Flavour.md)

Defined in: [src/components.d.ts:40](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L40)

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

### isMapProviderReady()

> **isMapProviderReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:45](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L45)

Gibt zurück, ob der Karten-Provider initialisiert wurde und verwendet werden kann.

#### Returns

`Promise`\<`boolean`\>

Promise mit `true`, sobald der Provider bereit ist, sonst `false`.

***

### setView()

> **setView**: (`coordinates`, `zoom`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:53](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L53)

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

Defined in: [src/components.d.ts:58](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L58)

Falls true, injiziert v-map automatisch die Import-Map.

#### Default

```ts
true
```

***

### zoom

> **zoom**: `number`

Defined in: [src/components.d.ts:63](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L63)

Anfangs-Zoomstufe. Skala abhängig vom Provider (typisch 0–20).

#### Default

```ts
3
```
