[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMapLayergroup

# Interface: VMapLayergroup

Defined in: [src/components.d.ts:766](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L766)

## Properties

### basemapid

> **basemapid**: `string`

Defined in: [src/components.d.ts:771](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L771)

Base map identifier for this layer group. When set, layers in this group will be treated as base map layers.

#### Default

```ts
null
```

***

### getGroupId()

> **getGroupId**: () => `Promise`\<`string`\>

Defined in: [src/components.d.ts:772](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L772)

#### Returns

`Promise`\<`string`\>

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:777](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L777)

Globale Opazität (0–1) für alle Kinder.

#### Default

```ts
1
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:782](https://github.com/pt9912/v-map/blob/03894669c71ecfe4c835f7e2d5b23a755c975811/src/components.d.ts#L782)

Sichtbarkeit der gesamten Gruppe.

#### Default

```ts
true
```
