[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / VMap

# Interface: VMap

Defined in: [src/components.d.ts:373](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L373)

## Properties

### center?

> `optional` **center**: `string`

Defined in: [src/components.d.ts:377](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L377)

#### Default

```ts
'0,0'
```

***

### cssMode?

> `optional` **cssMode**: [`CssMode`](../../../type-aliases/CssMode.md)

Defined in: [src/components.d.ts:381](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L381)

#### Default

```ts
'cdn'
```

***

### flavour?

> `optional` **flavour**: [`Flavour`](../../../type-aliases/Flavour.md)

Defined in: [src/components.d.ts:385](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L385)

#### Default

```ts
'ol'
```

***

### onMapProviderReady()?

> `optional` **onMapProviderReady**: (`event`) => `void`

Defined in: [src/components.d.ts:386](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L386)

#### Parameters

##### event

[`VMapCustomEvent`](../../../interfaces/VMapCustomEvent.md)\<[`MapProviderDetail`](../../../../utils/events/interfaces/MapProviderDetail.md)\>

#### Returns

`void`

***

### useDefaultImportMap?

> `optional` **useDefaultImportMap**: `boolean`

Defined in: [src/components.d.ts:391](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L391)

Falls true, injiziert v-map automatisch die Import-Map.

#### Default

```ts
true
```

***

### zoom?

> `optional` **zoom**: `number`

Defined in: [src/components.d.ts:395](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L395)

#### Default

```ts
2
```
