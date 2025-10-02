[**@pt9912/v-map**](../../../README.md)

***

[@pt9912/v-map](../../../README.md) / [utils/async-mutex](../README.md) / AsyncMutex

# Class: AsyncMutex

Defined in: [src/utils/async-mutex.ts:2](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/utils/async-mutex.ts#L2)

## Constructors

### Constructor

> **new AsyncMutex**(): `AsyncMutex`

#### Returns

`AsyncMutex`

## Methods

### runExclusive()

> **runExclusive**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: [src/utils/async-mutex.ts:6](https://github.com/pt9912/v-map/blob/a0487e7879c57bc1bb09ef4fd23524b8b3d97cf2/src/utils/async-mutex.ts#L6)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

() => `T` \| `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>
