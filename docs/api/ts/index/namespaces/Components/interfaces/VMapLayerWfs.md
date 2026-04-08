[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerWfs

# Interface: VMapLayerWfs

Defined in: [src/components.d.ts:624](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L624)

## Properties

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:628](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L628)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:632](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L632)

Gibt `true` zurück, sobald der Layer initialisiert wurde.

#### Returns

`Promise`\<`boolean`\>

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:637](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L637)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:642](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L642)

Opazität (0–1).

#### Default

```ts
1
```

***

### outputFormat

> **outputFormat**: `string`

Defined in: [src/components.d.ts:647](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L647)

Ausgabeformat, z. B. application/json.

#### Default

```ts
'application/json'
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:651](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L651)

Zusätzliche Parameter als JSON-String.

***

### srsName

> **srsName**: `string`

Defined in: [src/components.d.ts:656](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L656)

Ziel-Referenzsystem, Standard EPSG:3857.

#### Default

```ts
'EPSG:3857'
```

***

### typeName

> **typeName**: `string`

Defined in: [src/components.d.ts:660](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L660)

Feature-Typ (typeName) des WFS.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:664](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L664)

WFS Endpunkt (z. B. https://server/wfs).

***

### version

> **version**: `string`

Defined in: [src/components.d.ts:669](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L669)

WFS Version, Standard 1.1.0.

#### Default

```ts
'1.1.0'
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:674](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L674)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:679](https://github.com/pt9912/v-map/blob/7499a3d9a2302439b5ec38ecfaab20686d9f940b/src/components.d.ts#L679)

Z-Index für Rendering.

#### Default

```ts
1000
```
