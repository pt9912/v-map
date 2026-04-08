[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [map-provider/deck/LayerGroups](../index.md) / LayerGroups

# Class: LayerGroups\<L, G\>

Defined in: [src/map-provider/deck/LayerGroups.ts:36](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L36)

## Type Parameters

### L

`L` *extends* `Layer` = `Layer`

### G

`G` *extends* [`RenderableGroup`](../../RenderableGroup/interfaces/RenderableGroup.md)\<`L`\> = [`RenderableGroup`](../../RenderableGroup/interfaces/RenderableGroup.md)\<`L`\>

## Constructors

### Constructor

> **new LayerGroups**\<`L`, `G`\>(`props`): `LayerGroups`\<`L`, `G`\>

Defined in: [src/map-provider/deck/LayerGroups.ts:46](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L46)

#### Parameters

##### props

[`LayerGroupsProps`](../interfaces/LayerGroupsProps.md)\<`L`, `G`\> = `{}`

#### Returns

`LayerGroups`\<`L`, `G`\>

## Accessors

### groups

#### Get Signature

> **get** **groups**(): readonly `G`[]

Defined in: [src/map-provider/deck/LayerGroups.ts:63](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L63)

##### Returns

readonly `G`[]

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/map-provider/deck/LayerGroups.ts:60](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L60)

##### Returns

`number`

## Methods

### addGroup()

> **addGroup**(`group`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:98](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L98)

#### Parameters

##### group

`G`

#### Returns

`void`

***

### addGroups()

> **addGroups**(`groups`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:105](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L105)

#### Parameters

##### groups

readonly `G`[]

#### Returns

`void`

***

### applyToDeck()

> **applyToDeck**(`options`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:82](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L82)

#### Parameters

##### options

###### respectExternalChanges?

`boolean`

#### Returns

`void`

***

### attachDeck()

> **attachDeck**(`deck`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:75](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L75)

#### Parameters

##### deck

[`DeckLike`](../interfaces/DeckLike.md) | `Deck`\<`null`\>

#### Returns

`void`

***

### clear()

> **clear**(`opts?`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:117](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L117)

#### Parameters

##### opts?

###### destroy?

`boolean`

#### Returns

`void`

***

### destroy()

> **destroy**(`opts?`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:245](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L245)

#### Parameters

##### opts?

###### destroyGroups?

`boolean`

#### Returns

`void`

***

### detachDeck()

> **detachDeck**(): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:78](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L78)

#### Returns

`void`

***

### getGroup()

> **getGroup**(`id`): `G`

Defined in: [src/map-provider/deck/LayerGroups.ts:66](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L66)

#### Parameters

##### id

`string`

#### Returns

`G`

***

### getLayers()

> **getLayers**(`options`): readonly `L`[]

Defined in: [src/map-provider/deck/LayerGroups.ts:223](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L223)

#### Parameters

##### options

###### respectExternalChanges?

`boolean`

#### Returns

readonly `L`[]

***

### hasGroup()

> **hasGroup**(`id`): `boolean`

Defined in: [src/map-provider/deck/LayerGroups.ts:69](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L69)

#### Parameters

##### id

`string`

#### Returns

`boolean`

***

### markDirty()

> **markDirty**(): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:241](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L241)

#### Returns

`void`

***

### moveGroup()

> **moveGroup**(`id`, `toIndex`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:138](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L138)

#### Parameters

##### id

`string`

##### toIndex

`number`

#### Returns

`void`

***

### removeGroup()

> **removeGroup**(`id`, `opts?`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:109](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L109)

#### Parameters

##### id

`string`

##### opts?

###### destroy?

`boolean`

#### Returns

`void`

***

### removeLayer()

> **removeLayer**(`layerId`, `opts`): `boolean`

Defined in: [src/map-provider/deck/LayerGroups.ts:168](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L168)

Entfernt einen Layer mit gegebener ID aus allen Gruppen, die
klassische LayerGroup **unterstützen**. Bei modellbasierten Gruppen
suchst du nach Model-ID und nutzt removeModel().

#### Parameters

##### layerId

`string`

##### opts

###### removeFromAll?

`boolean`

###### respectExternalChanges?

`boolean`

#### Returns

`boolean`

***

### replaceGroup()

> **replaceGroup**(`group`, `keepPosition`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:123](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L123)

#### Parameters

##### group

`G`

##### keepPosition

`boolean` = `true`

#### Returns

`void`

***

### setGroupVisible()

> **setGroupVisible**(`id`, `visible`, `opts`): `boolean`

Defined in: [src/map-provider/deck/LayerGroups.ts:148](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L148)

#### Parameters

##### id

`string`

##### visible

`boolean`

##### opts

###### respectExternalChanges?

`boolean`

#### Returns

`boolean`

***

### setModelEnabled()

> **setModelEnabled**(`groupId`, `modelId`, `enabled`, `opts`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:198](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L198)

Convenience: Für modellbasierte Gruppen – LayerModel enabled togglen.
No-Op für klassische LayerGroup.

#### Parameters

##### groupId

`string`

##### modelId

`string`

##### enabled

`boolean`

##### opts

###### apply?

`boolean`

#### Returns

`void`

***

### withUpdate()

> **withUpdate**(`fn`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:216](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/map-provider/deck/LayerGroups.ts#L216)

#### Parameters

##### fn

(`store`) => `void`

#### Returns

`void`
