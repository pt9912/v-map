[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerWcs

# Interface: VMapLayerWcs

Defined in: [src/components.d.ts:605](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L605)

## Properties

### coverageName

> **coverageName**: `string`

Defined in: [src/components.d.ts:609](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L609)

Coverage-Name/ID.

***

### format

> **format**: `string`

Defined in: [src/components.d.ts:614](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L614)

Ausgabeformat, z. B. image/tiff.

#### Default

```ts
'image/tiff'
```

***

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:618](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L618)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:622](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L622)

Gibt `true` zurück, sobald der Layer initialisiert wurde.

#### Returns

`Promise`\<`boolean`\>

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:627](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L627)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:632](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L632)

Opazität (0–1).

#### Default

```ts
1
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:636](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L636)

Zusätzliche Parameter als JSON-String.

***

### projection?

> `optional` **projection**: `string`

Defined in: [src/components.d.ts:640](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L640)

Projektion (Projection) für die Quelle.

***

### resolutions?

> `optional` **resolutions**: `string`

Defined in: [src/components.d.ts:644](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L644)

Auflösungen als JSON-Array, z. B. [1000,500].

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:648](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L648)

Basis-URL des WCS-Dienstes.

***

### version

> **version**: `string`

Defined in: [src/components.d.ts:653](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L653)

WCS-Version.

#### Default

```ts
'1.1.0'
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:658](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L658)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:663](https://github.com/pt9912/v-map/blob/59b99a54c6e19ee91fcaa91c0e3ce882570d99e9/src/components.d.ts#L663)

Z-Index für die Darstellung.

#### Default

```ts
1000
```
