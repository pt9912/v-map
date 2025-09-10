[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [index](../../../README.md) / [Components](../README.md) / VMap

# Interface: VMap

Defined in: [src/components.d.ts:23](https://github.com/pt9912/v-map/blob/4db367f23999463586a668ce9199b2387dda65a9/src/components.d.ts#L23)

## Properties

### addLayer()

> **addLayer**: (`layerConfig`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:24](https://github.com/pt9912/v-map/blob/4db367f23999463586a668ce9199b2387dda65a9/src/components.d.ts#L24)

#### Parameters

##### layerConfig

`any`

#### Returns

`Promise`\<`void`\>

***

### center

> **center**: `string`

Defined in: [src/components.d.ts:28](https://github.com/pt9912/v-map/blob/4db367f23999463586a668ce9199b2387dda65a9/src/components.d.ts#L28)

#### Default

```ts
'0,0'
```

***

### cssMode

> **cssMode**: [`CssMode`](../../../../types/cssmode/type-aliases/CssMode.md)

Defined in: [src/components.d.ts:32](https://github.com/pt9912/v-map/blob/4db367f23999463586a668ce9199b2387dda65a9/src/components.d.ts#L32)

#### Default

```ts
'cdn'
```

***

### flavour

> **flavour**: [`Flavour`](../../../../types/flavour/type-aliases/Flavour.md)

Defined in: [src/components.d.ts:36](https://github.com/pt9912/v-map/blob/4db367f23999463586a668ce9199b2387dda65a9/src/components.d.ts#L36)

#### Default

```ts
'ol'
```

***

### getMapProvider()

> **getMapProvider**: () => `Promise`\<[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)\>

Defined in: [src/components.d.ts:37](https://github.com/pt9912/v-map/blob/4db367f23999463586a668ce9199b2387dda65a9/src/components.d.ts#L37)

#### Returns

`Promise`\<[`MapProvider`](../../../../types/mapprovider/interfaces/MapProvider.md)\>

***

### isMapProviderAvailable()

> **isMapProviderAvailable**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:38](https://github.com/pt9912/v-map/blob/4db367f23999463586a668ce9199b2387dda65a9/src/components.d.ts#L38)

#### Returns

`Promise`\<`boolean`\>

***

### setView()

> **setView**: (`coordinates`, `zoom`) => `Promise`\<`void`\>

Defined in: [src/components.d.ts:39](https://github.com/pt9912/v-map/blob/4db367f23999463586a668ce9199b2387dda65a9/src/components.d.ts#L39)

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

Defined in: [src/components.d.ts:44](https://github.com/pt9912/v-map/blob/4db367f23999463586a668ce9199b2387dda65a9/src/components.d.ts#L44)

Falls true, injiziert v-map automatisch die Import-Map.

#### Default

```ts
true
```

***

### zoom

> **zoom**: `number`

Defined in: [src/components.d.ts:48](https://github.com/pt9912/v-map/blob/4db367f23999463586a668ce9199b2387dda65a9/src/components.d.ts#L48)

#### Default

```ts
2
```
