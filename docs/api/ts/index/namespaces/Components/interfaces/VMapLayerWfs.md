[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWfs

# Interface: VMapLayerWfs

Defined in: [src/components.d.ts:449](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L449)

## Properties

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:453](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L453)

Gibt `true` zurück, sobald der Layer initialisiert wurde.

#### Returns

`Promise`\<`boolean`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:458](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L458)

Opazität (0–1).

#### Default

```ts
1
```

***

### outputFormat

> **outputFormat**: `string`

Defined in: [src/components.d.ts:463](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L463)

Ausgabeformat, z. B. application/json.

#### Default

```ts
'application/json'
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:467](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L467)

Zusätzliche Parameter als JSON-String.

***

### srsName

> **srsName**: `string`

Defined in: [src/components.d.ts:472](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L472)

Ziel-Referenzsystem, Standard EPSG:3857.

#### Default

```ts
'EPSG:3857'
```

***

### typeName

> **typeName**: `string`

Defined in: [src/components.d.ts:476](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L476)

Feature-Typ (typeName) des WFS.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:480](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L480)

WFS Endpunkt (z. B. https://server/wfs).

***

### version

> **version**: `string`

Defined in: [src/components.d.ts:485](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L485)

WFS Version, Standard 1.1.0.

#### Default

```ts
'1.1.0'
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:490](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L490)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:495](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L495)

Z-Index für Rendering.

#### Default

```ts
1000
```
