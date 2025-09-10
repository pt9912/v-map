[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMap

# Interface: VMap

Defined in: [src/components.d.ts:379](https://github.com/pt9912/v-map/blob/9428f65b23035f217fc965a1dcbd4604dab1c94a/src/components.d.ts#L379)

## Properties

### center?

> `optional` **center**: `string`

Defined in: [src/components.d.ts:383](https://github.com/pt9912/v-map/blob/9428f65b23035f217fc965a1dcbd4604dab1c94a/src/components.d.ts#L383)

#### Default

```ts
'0,0'
```

***

### cssMode?

> `optional` **cssMode**: [`CssMode`](../../../../types/cssmode/type-aliases/CssMode.md)

Defined in: [src/components.d.ts:387](https://github.com/pt9912/v-map/blob/9428f65b23035f217fc965a1dcbd4604dab1c94a/src/components.d.ts#L387)

#### Default

```ts
'cdn'
```

***

### flavour?

> `optional` **flavour**: [`Flavour`](../../../../types/flavour/type-aliases/Flavour.md)

Defined in: [src/components.d.ts:391](https://github.com/pt9912/v-map/blob/9428f65b23035f217fc965a1dcbd4604dab1c94a/src/components.d.ts#L391)

#### Default

```ts
'ol'
```

***

### onMapProviderReady()?

> `optional` **onMapProviderReady**: (`event`) => `void`

Defined in: [src/components.d.ts:392](https://github.com/pt9912/v-map/blob/9428f65b23035f217fc965a1dcbd4604dab1c94a/src/components.d.ts#L392)

#### Parameters

##### event

[`VMapCustomEvent`](../../../interfaces/VMapCustomEvent.md)\<[`MapProviderDetail`](../../../../utils/events/interfaces/MapProviderDetail.md)\>

#### Returns

`void`

***

### useDefaultImportMap?

> `optional` **useDefaultImportMap**: `boolean`

Defined in: [src/components.d.ts:397](https://github.com/pt9912/v-map/blob/9428f65b23035f217fc965a1dcbd4604dab1c94a/src/components.d.ts#L397)

Falls true, injiziert v-map automatisch die Import-Map.

#### Default

```ts
true
```

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [src/components.d.ts:401](https://github.com/pt9912/v-map/blob/9428f65b23035f217fc965a1dcbd4604dab1c94a/src/components.d.ts#L401)

#### Default

```ts
2
```
