[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMap

# Interface: VMap

Defined in: [src/components.d.ts:17](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L17)

## Properties

### addLayer()

> **addLayer**: (`layerConfig`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:18](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L18)

#### Parameters

##### layerConfig

`any`

#### Returns

`Promise`\<`void`\>

***

### center

> **center**: `string`

Defined in: [src/components.d.ts:22](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L22)

#### Default

```ts
'0,0'
```

***

### cssMode

> **cssMode**: [`CssMode`](../../../type-aliases/CssMode.md)

Defined in: [src/components.d.ts:26](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L26)

#### Default

```ts
'cdn'
```

***

### flavour

> **flavour**: [`Flavour`](../../../type-aliases/Flavour.md)

Defined in: [src/components.d.ts:30](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L30)

#### Default

```ts
'ol'
```

***

### getMapProvider()

> **getMapProvider**: () => `Promise`\<[`MapProvider`](../../../interfaces/MapProvider.md)\>

Defined in: [src/components.d.ts:31](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L31)

#### Returns

`Promise`\<[`MapProvider`](../../../interfaces/MapProvider.md)\>

***

### isMapProviderAvailable()

> **isMapProviderAvailable**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:32](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L32)

#### Returns

`Promise`\<`boolean`\>

***

### setView()

> **setView**: (`coordinates`, `zoom`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:33](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L33)

#### Parameters

##### coordinates

\[`number`, `number`\]

##### zoom

`number`

#### Returns

`Promise`\<`void`\>

***

### useDefaultImportMap

> **useDefaultImportMap**: `boolean`

Defined in: [src/components.d.ts:38](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L38)

Falls true, injiziert v-map automatisch die Import-Map.

#### Default

```ts
true
```

***

### zoom

> **zoom**: `number`

Defined in: [src/components.d.ts:42](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components.d.ts#L42)

#### Default

```ts
2
```
