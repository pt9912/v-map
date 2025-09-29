[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/deck/LayerGroups](../README.md) / LayerGroups

# Class: LayerGroups\<L, G\>

Defined in: [src/map-provider/deck/LayerGroups.ts:24](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L24)

## Type Parameters

### L

`L` *extends* `Layer` = `Layer`

### G

`G` *extends* [`RenderableGroup`](../../RenderableGroup/interfaces/RenderableGroup.md)\<`L`\> = [`RenderableGroup`](../../RenderableGroup/interfaces/RenderableGroup.md)\<`L`\>

## Constructors

### Constructor

> **new LayerGroups**\<`L`, `G`\>(`props`): `LayerGroups`\<`L`, `G`\>

Defined in: [src/map-provider/deck/LayerGroups.ts:34](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L34)

#### Parameters

##### props

[`LayerGroupsProps`](../interfaces/LayerGroupsProps.md)\<`L`, `G`\> = `{}`

#### Returns

`LayerGroups`\<`L`, `G`\>

## Accessors

### groups

#### Get Signature

> **get** **groups**(): readonly `G`[]

Defined in: [src/map-provider/deck/LayerGroups.ts:51](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L51)

##### Returns

readonly `G`[]

***

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [src/map-provider/deck/LayerGroups.ts:48](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L48)

##### Returns

`number`

## Methods

### addGroup()

> **addGroup**(`group`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:86](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L86)

#### Parameters

##### group

`G`

#### Returns

`void`

***

### addGroups()

> **addGroups**(`groups`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:93](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L93)

#### Parameters

##### groups

readonly `G`[]

#### Returns

`void`

***

### applyToDeck()

> **applyToDeck**(`options`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:70](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L70)

#### Parameters

##### options

###### respectExternalChanges?

`boolean`

#### Returns

`void`

***

### attachDeck()

> **attachDeck**(`deck`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:63](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L63)

#### Parameters

##### deck

[`DeckLike`](../interfaces/DeckLike.md) | `Deck`\<`null`\>

#### Returns

`void`

***

### clear()

> **clear**(`opts?`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:105](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L105)

#### Parameters

##### opts?

###### destroy?

`boolean`

#### Returns

`void`

***

### destroy()

> **destroy**(`opts?`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:234](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L234)

#### Parameters

##### opts?

###### destroyGroups?

`boolean`

#### Returns

`void`

***

### detachDeck()

> **detachDeck**(): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:66](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L66)

#### Returns

`void`

***

### getGroup()

> **getGroup**(`id`): `G`

Defined in: [src/map-provider/deck/LayerGroups.ts:54](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L54)

#### Parameters

##### id

`string`

#### Returns

`G`

***

### getLayers()

> **getLayers**(`options`): readonly `L`[]

Defined in: [src/map-provider/deck/LayerGroups.ts:212](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L212)

#### Parameters

##### options

###### respectExternalChanges?

`boolean`

#### Returns

readonly `L`[]

***

### hasGroup()

> **hasGroup**(`id`): `boolean`

Defined in: [src/map-provider/deck/LayerGroups.ts:57](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L57)

#### Parameters

##### id

`string`

#### Returns

`boolean`

***

### markDirty()

> **markDirty**(): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:230](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L230)

#### Returns

`void`

***

### moveGroup()

> **moveGroup**(`id`, `toIndex`): `void`

Defined in: [src/map-provider/deck/LayerGroups.ts:126](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L126)

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

Defined in: [src/map-provider/deck/LayerGroups.ts:97](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L97)

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

Defined in: [src/map-provider/deck/LayerGroups.ts:156](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L156)

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

Defined in: [src/map-provider/deck/LayerGroups.ts:111](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L111)

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

Defined in: [src/map-provider/deck/LayerGroups.ts:136](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L136)

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

Defined in: [src/map-provider/deck/LayerGroups.ts:187](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L187)

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

Defined in: [src/map-provider/deck/LayerGroups.ts:205](https://github.com/pt9912/v-map/blob/491237a0db2a85a750ccdbdf80f55a823546a43b/src/map-provider/deck/LayerGroups.ts#L205)

#### Parameters

##### fn

(`store`) => `void`

#### Returns

`void`
