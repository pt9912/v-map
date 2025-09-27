# v-map-builder



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description | Type      | Default     |
| ----------- | ----------- | ----------- | --------- | ----------- |
| `mapconfig` | `mapconfig` |             | `unknown` | `undefined` |


## Events

| Event         | Description | Type                                                   |
| ------------- | ----------- | ------------------------------------------------------ |
| `configError` |             | `CustomEvent<{ message: string; errors?: string[]; }>` |
| `configReady` |             | `CustomEvent<BuilderConfig>`                           |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"mount"` |             |


## Dependencies

### Depends on

- [v-map-layergroup](../v-map-layergroup)
- [v-map-layer-osm](../v-map-layer-osm)
- [v-map-layer-wms](../v-map-layer-wms)
- [v-map-layer-geojson](../v-map-layer-geojson)
- [v-map-layer-xyz](../v-map-layer-xyz)
- [v-map](../v-map)

### Graph
```mermaid
graph TD;
  v-map-builder --> v-map-layergroup
  v-map-builder --> v-map-layer-osm
  v-map-builder --> v-map-layer-wms
  v-map-builder --> v-map-layer-geojson
  v-map-builder --> v-map-layer-xyz
  v-map-builder --> v-map
  style v-map-builder fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
