[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWcs

# Interface: VMapLayerWcs

Defined in: [src/components.d.ts:398](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L398)

## Properties

### coverageName

> **coverageName**: `string`

Defined in: [src/components.d.ts:402](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L402)

Coverage-Name/ID.

***

### format

> **format**: `string`

Defined in: [src/components.d.ts:407](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L407)

Ausgabeformat, z. B. image/tiff.

#### Default

```ts
'image/tiff'
```

***

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:411](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L411)

Gibt `true` zurück, sobald der Layer initialisiert wurde.

#### Returns

`Promise`\<`boolean`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:416](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L416)

Opazität (0–1).

#### Default

```ts
1
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:420](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L420)

Zusätzliche Parameter als JSON-String.

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:424](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L424)

Projektion (Projection) für die Quelle.

***

### resolutions?

> `optional` **resolutions**: `string`

Defined in: [src/components.d.ts:428](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L428)

Auflösungen als JSON-Array, z. B. [1000,500].

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:432](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L432)

Basis-URL des WCS-Dienstes.

***

### version

> **version**: `string`

Defined in: [src/components.d.ts:437](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L437)

WCS-Version.

#### Default

```ts
'1.1.0'
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:442](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L442)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:447](https://github.com/pt9912/v-map/blob/fc8df37978e2b7a27dfa37d5760ac799515a8780/src/components.d.ts#L447)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
