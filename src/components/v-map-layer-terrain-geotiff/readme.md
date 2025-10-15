# v-map-layer-terrain-geotiff

The `v-map-layer-terrain-geotiff` component displays 3D terrain from GeoTIFF elevation data using deck.gl's TerrainLayer.

## Features

- ✅ Load elevation data from GeoTIFF files
- ✅ Support for different projections via proj4
- ✅ 3D mesh generation with Martini (configurable detail level)
- ✅ Optional texture overlay
- ✅ Wireframe mode
- ✅ Elevation exaggeration
- ✅ Reactive property updates

## Usage

### Basic Example

```html
<v-map provider="deck" center="[11.5, 48.1]" zoom="10">
  <v-map-layer-terrain-geotiff
    url="https://example.com/elevation.tif"
    elevation-scale="2.0"
  >
  </v-map-layer-terrain-geotiff>
</v-map>
```

### With Texture Overlay

```html
<v-map provider="deck" center="[11.5, 48.1]" zoom="10">
  <v-map-layer-terrain-geotiff
    url="https://example.com/elevation.tif"
    texture="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    elevation-scale="2.0"
  >
  </v-map-layer-terrain-geotiff>
</v-map>
```

### Wireframe Mode

```html
<v-map provider="deck" center="[11.5, 48.1]" zoom="10">
  <v-map-layer-terrain-geotiff
    url="https://example.com/elevation.tif"
    wireframe="true"
    elevation-scale="3.0"
  >
  </v-map-layer-terrain-geotiff>
</v-map>
```

### High Detail Terrain

```html
<v-map provider="deck" center="[11.5, 48.1]" zoom="12">
  <v-map-layer-terrain-geotiff
    url="https://example.com/elevation.tif"
    mesh-max-error="1.0"
    elevation-scale="2.0"
  >
  </v-map-layer-terrain-geotiff>
</v-map>
```

## Properties

| Property           | Type                                  | Default     | Description                                                    |
| ------------------ | ------------------------------------- | ----------- | -------------------------------------------------------------- |
| `url`              | `string`                              | `null`      | URL to the GeoTIFF file containing elevation data (required)   |
| `projection`       | `string`                              | `null`      | Source projection (e.g., "EPSG:32632"), auto-detected if null |
| `forceProjection`  | `boolean`                             | `false`     | Force projection prop, ignore GeoKeys                          |
| `visible`          | `boolean`                             | `true`      | Layer visibility                                               |
| `opacity`          | `number`                              | `1.0`       | Layer opacity (0-1)                                            |
| `zIndex`           | `number`                              | `100`       | Z-index for layer stacking                                     |
| `nodata`           | `number`                              | `null`      | NoData value to discard from elevation                         |
| `meshMaxError`     | `number`                              | `4.0`       | Mesh error tolerance in meters (smaller = more detailed)       |
| `wireframe`        | `boolean`                             | `false`     | Enable wireframe mode                                          |
| `texture`          | `string`                              | `null`      | Optional texture URL (image or tile URL)                       |
| `color`            | `[number, number, number]`            | `null`      | Terrain color [r, g, b] when no texture                        |
| `colorMap`         | `string \| GeoStylerColorMap`         | `null`      | ColorMap for elevation visualization                           |
| `valueRange`       | `[number, number]`                    | `null`      | Value range for colormap normalization [min, max]              |
| `elevationScale`   | `number`                              | `1.0`       | Elevation exaggeration factor                                  |
| `minZoom`          | `number`                              | `0`         | Minimum zoom level                                             |
| `maxZoom`          | `number`                              | `24`        | Maximum zoom level                                             |
| `tileSize`         | `number`                              | `256`       | Tile size in pixels                                            |

## Events

| Event   | Description                          |
| ------- | ------------------------------------ |
| `ready` | Fired when the layer is initialized  |

## Methods

| Method        | Returns  | Description                                    |
| ------------- | -------- | ---------------------------------------------- |
| `getLayerId`  | `string` | Returns the internal layer ID                  |
| `isReady`     | `boolean`| Returns true if the layer is ready             |

## Performance Tips

1. **meshMaxError**: Use larger values (4-10) for better performance, smaller values (0.5-2) for more detail
2. **elevationScale**: Adjust to exaggerate or flatten terrain features
3. **tileSize**: Smaller tiles load faster but increase requests
4. **Projection**: Auto-detection works for most GeoTIFFs, but manual projection can be faster

## GeoTIFF Requirements

- **Elevation data**: Single-band GeoTIFF with elevation values in meters
- **Coordinate system**: Should have proper GeoKeys or use `projection` prop
- **Cloud-Optimized**: COG format recommended for better performance

## Examples of Compatible GeoTIFF Sources

- Sentinel-2 DEM tiles (Copernicus)
- SRTM elevation data
- Custom DEM files with proper georeferencing

## Browser Support

Same as deck.gl requirements:
- Chrome/Edge 79+
- Firefox 78+
- Safari 14+

## Dependencies

- deck.gl (@deck.gl/core, @deck.gl/geo-layers)
- geotiff
- proj4
- geotiff-geokeys-to-proj4

<!-- Auto Generated Below -->
