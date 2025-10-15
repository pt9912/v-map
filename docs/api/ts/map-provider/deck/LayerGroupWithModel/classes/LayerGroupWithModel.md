[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [map-provider/deck/LayerGroupWithModel](../README.md) / LayerGroupWithModel

# Class: LayerGroupWithModel\<L\>

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:18](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L18)

Gemeinsames Interface, das sowohl von der klassischen LayerGroup als auch
von der modellbasierten LayerGroupWithModel implementiert wird.

## Type Parameters

### L

`L` *extends* `Layer` = `Layer`

## Implements

- [`RenderableGroup`](../../RenderableGroup/interfaces/RenderableGroup.md)\<`L`\>

## Constructors

### Constructor

> **new LayerGroupWithModel**\<`L`\>(`opts`): `LayerGroupWithModel`\<`L`\>

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:32](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L32)

#### Parameters

##### opts

###### basemap?

`string`

###### id

`string`

###### models?

readonly [`LayerModel`](../../LayerModel/interfaces/LayerModel.md)\<`L`\>[]

###### syncMode?

[`SyncMode`](../type-aliases/SyncMode.md)

###### visible?

`boolean`

#### Returns

`LayerGroupWithModel`\<`L`\>

## Properties

### id

> `readonly` **id**: `string`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:21](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L21)

#### Implementation of

[`RenderableGroup`](../../RenderableGroup/interfaces/RenderableGroup.md).[`id`](../../RenderableGroup/interfaces/RenderableGroup.md#id)

## Accessors

### basemap

#### Get Signature

> **get** **basemap**(): `string`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:75](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L75)

##### Returns

`string`

#### Set Signature

> **set** **basemap**(`b`): `void`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:67](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L67)

##### Parameters

###### b

`string`

##### Returns

`void`

***

### syncMode

#### Get Signature

> **get** **syncMode**(): [`SyncMode`](../type-aliases/SyncMode.md)

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:58](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L58)

##### Returns

[`SyncMode`](../type-aliases/SyncMode.md)

#### Set Signature

> **set** **syncMode**(`m`): `void`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:61](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L61)

##### Parameters

###### m

[`SyncMode`](../type-aliases/SyncMode.md)

##### Returns

`void`

***

### visible

#### Get Signature

> **get** **visible**(): `boolean`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:46](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L46)

##### Returns

`boolean`

#### Set Signature

> **set** **visible**(`v`): `void`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:49](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L49)

##### Parameters

###### v

`boolean`

##### Returns

`void`

#### Implementation of

[`RenderableGroup`](../../RenderableGroup/interfaces/RenderableGroup.md).[`visible`](../../RenderableGroup/interfaces/RenderableGroup.md#visible)

## Methods

### addModel()

> **addModel**(`model`): `void`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:82](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L82)

#### Parameters

##### model

[`LayerModel`](../../LayerModel/interfaces/LayerModel.md)\<`L`\>

#### Returns

`void`

***

### addModels()

> **addModels**(`models`): `void`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:87](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L87)

#### Parameters

##### models

readonly [`LayerModel`](../../LayerModel/interfaces/LayerModel.md)\<`L`\>[]

#### Returns

`void`

***

### clear()

> **clear**(): `void`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:101](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L101)

#### Returns

`void`

***

### clearModelOverrides()

> **clearModelOverrides**(`id`): `void`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:132](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L132)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:197](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L197)

Optionale Ressourcenfreigabe

#### Returns

`void`

#### Implementation of

[`RenderableGroup`](../../RenderableGroup/interfaces/RenderableGroup.md).[`destroy`](../../RenderableGroup/interfaces/RenderableGroup.md#destroy)

***

### getLayers()

> **getLayers**(): readonly `L`[]

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:136](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L136)

Liefert die Deck-Layer zur Darstellung.
groups/LayerGroups reichen intern options weiter (falls benötigt).

#### Returns

readonly `L`[]

#### Implementation of

[`RenderableGroup`](../../RenderableGroup/interfaces/RenderableGroup.md).[`getLayers`](../../RenderableGroup/interfaces/RenderableGroup.md#getlayers)

***

### getModel()

> **getModel**(`id`): `object`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:90](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L90)

#### Parameters

##### id

`string`

#### Returns

`object`

##### elementId

> **elementId**: `string`

##### enabled

> **enabled**: `boolean`

##### id

> **id**: `string`

##### make()

> **make**: () => `L`

###### Returns

`L`

##### meta?

> `optional` **meta**: `Record`\<`string`, `unknown`\>

***

### isDirty()

> **isDirty**(): `boolean`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:78](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L78)

true, wenn ein Rebuild der Ausgabe-Layer nötig ist

#### Returns

`boolean`

#### Implementation of

[`RenderableGroup`](../../RenderableGroup/interfaces/RenderableGroup.md).[`isDirty`](../../RenderableGroup/interfaces/RenderableGroup.md#isdirty)

***

### removeModel()

> **removeModel**(`id`): `void`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:94](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L94)

#### Parameters

##### id

`string`

#### Returns

`void`

***

### replaceModel()

> **replaceModel**(`model`): `void`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:118](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L118)

#### Parameters

##### model

[`LayerModel`](../../LayerModel/interfaces/LayerModel.md)\<`L`\>

#### Returns

`void`

***

### setModelEnabled()

> **setModelEnabled**(`id`, `enabled`): `void`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:108](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L108)

#### Parameters

##### id

`string`

##### enabled

`boolean`

#### Returns

`void`

***

### setModelOverrides()

> **setModelOverrides**(`id`, `overrides`): `void`

Defined in: [src/map-provider/deck/LayerGroupWithModel.ts:124](https://github.com/pt9912/v-map/blob/1175289add5c3e3c3e3db864e7d963d76fef85d6/src/map-provider/deck/LayerGroupWithModel.ts#L124)

#### Parameters

##### id

`string`

##### overrides

`LayerOverrides`\<`L`\>

#### Returns

`void`
