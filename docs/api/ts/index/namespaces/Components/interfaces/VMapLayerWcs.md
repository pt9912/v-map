[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWcs

# Interface: VMapLayerWcs

Defined in: [src/components.d.ts:489](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L489)

## Properties

### coverageName

> **coverageName**: `string`

Defined in: [src/components.d.ts:493](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L493)

Coverage-Name/ID.

***

### format

> **format**: `string`

Defined in: [src/components.d.ts:498](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L498)

Ausgabeformat, z. B. image/tiff.

#### Default

```ts
'image/tiff'
```

***

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:502](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L502)

Gibt `true` zurück, sobald der Layer initialisiert wurde.

#### Returns

`Promise`\<`boolean`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:507](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L507)

Opazität (0–1).

#### Default

```ts
1
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:511](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L511)

Zusätzliche Parameter als JSON-String.

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:515](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L515)

Projektion (Projection) für die Quelle.

***

### resolutions?

> `optional` **resolutions**: `string`

Defined in: [src/components.d.ts:519](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L519)

Auflösungen als JSON-Array, z. B. [1000,500].

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:523](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L523)

Basis-URL des WCS-Dienstes.

***

### version

> **version**: `string`

Defined in: [src/components.d.ts:528](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L528)

WCS-Version.

#### Default

```ts
'1.1.0'
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:533](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L533)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:538](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/components.d.ts#L538)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
