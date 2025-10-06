[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWfs

# Interface: VMapLayerWfs

Defined in: [src/components.d.ts:440](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L440)

## Properties

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:444](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L444)

Gibt `true` zurück, sobald der Layer initialisiert wurde.

#### Returns

`Promise`\<`boolean`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:449](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L449)

Opazität (0–1).

#### Default

```ts
1
```

***

### outputFormat

> **outputFormat**: `string`

Defined in: [src/components.d.ts:454](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L454)

Ausgabeformat, z. B. application/json.

#### Default

```ts
'application/json'
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:458](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L458)

Zusätzliche Parameter als JSON-String.

***

### srsName

> **srsName**: `string`

Defined in: [src/components.d.ts:463](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L463)

Ziel-Referenzsystem, Standard EPSG:3857.

#### Default

```ts
'EPSG:3857'
```

***

### typeName

> **typeName**: `string`

Defined in: [src/components.d.ts:467](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L467)

Feature-Typ (typeName) des WFS.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:471](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L471)

WFS Endpunkt (z. B. https://server/wfs).

***

### version

> **version**: `string`

Defined in: [src/components.d.ts:476](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L476)

WFS Version, Standard 1.1.0.

#### Default

```ts
'1.1.0'
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:481](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L481)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:486](https://github.com/pt9912/v-map/blob/6b290a40db5b75e5078536738543838d31746c41/src/components.d.ts#L486)

Z-Index für Rendering.

#### Default

```ts
1000
```
