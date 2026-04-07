[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayerWcs

# Interface: VMapLayerWcs

Defined in: [src/components.d.ts:564](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L564)

## Properties

### coverageName

> **coverageName**: `string`

Defined in: [src/components.d.ts:568](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L568)

Coverage-Name/ID.

***

### format

> **format**: `string`

Defined in: [src/components.d.ts:573](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L573)

Ausgabeformat, z. B. image/tiff.

#### Default

```ts
'image/tiff'
```

***

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:577](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L577)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:581](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L581)

Gibt `true` zurück, sobald der Layer initialisiert wurde.

#### Returns

`Promise`\<`boolean`\>

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:586](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L586)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:591](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L591)

Opazität (0–1).

#### Default

```ts
1
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:595](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L595)

Zusätzliche Parameter als JSON-String.

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:599](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L599)

Projektion (Projection) für die Quelle.

***

### resolutions?

> `optional` **resolutions**: `string`

Defined in: [src/components.d.ts:603](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L603)

Auflösungen als JSON-Array, z. B. [1000,500].

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:607](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L607)

Basis-URL des WCS-Dienstes.

***

### version

> **version**: `string`

Defined in: [src/components.d.ts:612](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L612)

WCS-Version.

#### Default

```ts
'1.1.0'
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:617](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L617)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:622](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L622)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
