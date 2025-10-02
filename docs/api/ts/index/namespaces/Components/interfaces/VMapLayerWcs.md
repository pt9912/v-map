[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWcs

# Interface: VMapLayerWcs

Defined in: [src/components.d.ts:389](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L389)

## Properties

### coverageName

> **coverageName**: `string`

Defined in: [src/components.d.ts:393](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L393)

Coverage-Name/ID.

***

### format

> **format**: `string`

Defined in: [src/components.d.ts:398](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L398)

Ausgabeformat, z. B. image/tiff.

#### Default

```ts
'image/tiff'
```

***

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:402](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L402)

Gibt `true` zurück, sobald der Layer initialisiert wurde.

#### Returns

`Promise`\<`boolean`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:407](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L407)

Opazität (0–1).

#### Default

```ts
1
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:411](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L411)

Zusätzliche Parameter als JSON-String.

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:415](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L415)

Projektion (Projection) für die Quelle.

***

### resolutions?

> `optional` **resolutions**: `string`

Defined in: [src/components.d.ts:419](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L419)

Auflösungen als JSON-Array, z. B. [1000,500].

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:423](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L423)

Basis-URL des WCS-Dienstes.

***

### version

> **version**: `string`

Defined in: [src/components.d.ts:428](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L428)

WCS-Version.

#### Default

```ts
'1.1.0'
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:433](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L433)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:438](https://github.com/pt9912/v-map/blob/11744db29be2961aa24917a4dca680b91c5270b9/src/components.d.ts#L438)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
