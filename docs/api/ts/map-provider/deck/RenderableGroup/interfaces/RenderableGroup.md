[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/deck/RenderableGroup](../README.md) / RenderableGroup

# Interface: RenderableGroup\<L\>

Defined in: [src/map-provider/deck/RenderableGroup.ts:7](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/map-provider/deck/RenderableGroup.ts#L7)

Gemeinsames Interface, das sowohl von der klassischen LayerGroup als auch
von der modellbasierten LayerGroupWithModel implementiert wird.

## Type Parameters

### L

`L` *extends* `Layer` = `Layer`

## Properties

### id

> `readonly` **id**: `string`

Defined in: [src/map-provider/deck/RenderableGroup.ts:8](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/map-provider/deck/RenderableGroup.ts#L8)

***

### visible

> **visible**: `boolean`

Defined in: [src/map-provider/deck/RenderableGroup.ts:9](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/map-provider/deck/RenderableGroup.ts#L9)

## Methods

### destroy()?

> `optional` **destroy**(): `void`

Defined in: [src/map-provider/deck/RenderableGroup.ts:18](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/map-provider/deck/RenderableGroup.ts#L18)

Optionale Ressourcenfreigabe

#### Returns

`void`

***

### getLayers()

> **getLayers**(`options?`): readonly `L`[]

Defined in: [src/map-provider/deck/RenderableGroup.ts:16](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/map-provider/deck/RenderableGroup.ts#L16)

Liefert die Deck-Layer zur Darstellung.
groups/LayerGroups reichen intern options weiter (falls benötigt).

#### Parameters

##### options?

###### respectExternalChanges?

`boolean`

#### Returns

readonly `L`[]

***

### isDirty()

> **isDirty**(): `boolean`

Defined in: [src/map-provider/deck/RenderableGroup.ts:11](https://github.com/pt9912/v-map/blob/31b41b18ac6b57e612200cec79597eaf539a6c03/src/map-provider/deck/RenderableGroup.ts#L11)

true, wenn ein Rebuild der Ausgabe-Layer nötig ist

#### Returns

`boolean`
