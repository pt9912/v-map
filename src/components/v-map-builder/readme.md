# v-map-builder



<!-- Auto Generated Below -->


## Overview

A component that builds map configurations dynamically from JSON/YAML configuration scripts.

## Properties

| Property    | Attribute   | Description                                                                                              | Type      | Default     |
| ----------- | ----------- | -------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `mapconfig` | `mapconfig` | Configuration object for the map builder. Can be any structure that will be normalized to BuilderConfig. | `unknown` | `undefined` |


## Events

| Event         | Description                                                                                | Type                                                   |
| ------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| `configError` | Event emitted when there is an error parsing the map configuration.                        | `CustomEvent<{ message: string; errors?: string[]; }>` |
| `configReady` | Event emitted when the map configuration has been successfully parsed and is ready to use. | `CustomEvent<BuilderConfig>`                           |


## Shadow Parts

| Part      | Description                                                           |
| --------- | --------------------------------------------------------------------- |
| `"mount"` | The container element where the generated map and layers are mounted. |


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
