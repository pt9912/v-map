[**@pt9912/v-map**](../../../../README.md)

***

[@pt9912/v-map](../../../../README.md) / [map-provider/cesium/layer-manager](../README.md) / LayerManager

# Class: LayerManager

Defined in: src/map-provider/cesium/layer-manager.ts:38

## Constructors

### Constructor

> **new LayerManager**(`Cesium`, `viewer`): `LayerManager`

Defined in: src/map-provider/cesium/layer-manager.ts:43

#### Parameters

##### Cesium

`__module`

##### viewer

`Viewer`

#### Returns

`LayerManager`

## Methods

### addLayer()

> **addLayer**\<`T`\>(`id`, `layer`): `ILayer` \| `I3DTilesLayer`

Defined in: src/map-provider/cesium/layer-manager.ts:72

#### Type Parameters

##### T

`T` *extends* `DataSource` \| `GeoJsonDataSource` \| `Cesium3DTileset` \| `ImageryLayer`

#### Parameters

##### id

`string`

##### layer

`T`

#### Returns

`ILayer` \| `I3DTilesLayer`

***

### getLayer()

> **getLayer**(`layerId`): `ILayer` \| `I3DTilesLayer`

Defined in: src/map-provider/cesium/layer-manager.ts:99

#### Parameters

##### layerId

`string`

#### Returns

`ILayer` \| `I3DTilesLayer`

***

### getLayerById()

> **getLayerById**(`layerId`): `ILayer` \| `I3DTilesLayer`

Defined in: src/map-provider/cesium/layer-manager.ts:105

#### Parameters

##### layerId

`string`

#### Returns

`ILayer` \| `I3DTilesLayer`

***

### removeLayer()

> **removeLayer**(`layerId`): `void`

Defined in: src/map-provider/cesium/layer-manager.ts:109

#### Parameters

##### layerId

`string`

#### Returns

`void`

***

### replaceLayer()

> **replaceLayer**\<`T`\>(`id`, `oldlayer`, `layer`): `ILayer` \| `I3DTilesLayer`

Defined in: src/map-provider/cesium/layer-manager.ts:48

#### Type Parameters

##### T

`T` *extends* `DataSource` \| `GeoJsonDataSource` \| `Cesium3DTileset` \| `ImageryLayer`

#### Parameters

##### id

`string`

##### oldlayer

`ILayer` | `I3DTilesLayer`

##### layer

`T`

#### Returns

`ILayer` \| `I3DTilesLayer`

***

### setOpacity()

> **setOpacity**(`layerId`, `opacity`): `void`

Defined in: src/map-provider/cesium/layer-manager.ts:120

#### Parameters

##### layerId

`string`

##### opacity

`number`

#### Returns

`void`

***

### setVisible()

> **setVisible**(`layerId`, `visible`): `void`

Defined in: src/map-provider/cesium/layer-manager.ts:115

#### Parameters

##### layerId

`string`

##### visible

`boolean`

#### Returns

`void`

***

### setZIndex()

> **setZIndex**(`layerId`, `zindex`): `void`

Defined in: src/map-provider/cesium/layer-manager.ts:125

#### Parameters

##### layerId

`string`

##### zindex

`number`

#### Returns

`void`
