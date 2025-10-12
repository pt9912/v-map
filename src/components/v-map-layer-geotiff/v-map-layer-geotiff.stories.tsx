import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';

import '../v-map/v-map';
import '../v-map-layer-osm/v-map-layer-osm';
import './v-map-layer-geotiff';

type Args = {
  url: string;
  nodata?: number;
  visible?: boolean;
  opacity?: number;
  zIndex?: number;
};

const meta: Meta<Args> = {
  title: 'Layers/GeoTIFF',
  component: 'v-map-layer-geotiff',
  parameters: {
    docs: {
      description: {
        component:
          'GeoTIFF layer component for displaying raster imagery from GeoTIFF files, including Cloud Optimized GeoTIFF (COG) format.',
      },
    },
  },
  argTypes: {
    url: {
      control: 'text',
      description: 'URL to the GeoTIFF file (e.g., COG or regular GeoTIFF)',
    },
    nodata: {
      control: 'text',
      description: 'NoData-Wert (nullable) - Values to discard',
      table: { defaultValue: { summary: 'null' } },
    },
    visible: {
      control: 'boolean',
      description: 'Layer visibility',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Layer opacity (0-1)',
    },
    zIndex: {
      control: 'number',
      description: 'Z-index for layer stacking order',
    },
  },
};

export default meta;
type Story = StoryObj<Args>;

// Sample GeoTIFF URLs for testing (using local file to avoid CORS issues)
const SAMPLE_GEOTIFF_URL =
  'https://mikenunn.net/data/MiniScale_(std_with_grid)_R23.tif';
//const SAMPLE_GEOTIFF_URL =
//  '/gcp-public-data-landsat/LC08/01/044/034/LC08_L1GT_044034_20130330_20170310_01_T2/LC08_L1GT_044034_20130330_20170310_01_T2_B4.TIF';
//const SAMPLE_GEOTIFF_URL = '/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif';
//const SAMPLE_GEOTIFF_URL =  'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/36/Q/WD/2020/7/S2A_36QWD_20200701_0_L2A/TCI.tif';

//'https://mikenunn.net/data/MiniScale_(std_with_grid)_R23.tif'

//const SAMPLE_GEOTIFF_URL = '/geotiff/GeogToWGS84GeoKey5.tif';
const SAMPLE_GEOTIFF_CEA_URL = '/geotiff/cea.tif';
const SAMPLE_GEOTIFF_LANDSAT_URL =
  'https://storage.googleapis.com/gcp-public-data-landsat/LC08/01/044/034/LC08_L1GT_044034_20130330_20170310_01_T2/LC08_L1GT_044034_20130330_20170310_01_T2_B4.TIF';

export const OpenLayersGeoTIFF: Story = {
  args: {
    url: SAMPLE_GEOTIFF_URL,
    nodata: '0',
    visible: true,
    opacity: 1,
    zIndex: 100,
  },
  render: args => {
    const nodata =
      args.nodata === '' || args.nodata === undefined
        ? null
        : Number(args.nodata);
    return (
      <v-map
        flavour="ol"
        zoom="10"
        center="-0.2,51.5"
        style={{ width: '100%', height: '600px' }}
      >
        <v-map-layergroup group-title="base-layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="raster">
          <v-map-layer-geotiff {...args} nodata={nodata}></v-map-layer-geotiff>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const LeafletGeoTIFF: Story = {
  args: {
    url: SAMPLE_GEOTIFF_URL,
    visible: true,
    opacity: 0.8,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="leaflet"
      zoom="10"
      center="-0.2,51.5"
      style={{ width: '100%', height: '600px' }}
    >
      <v-map-layergroup group-title="base-layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="raster">
        <v-map-layer-geotiff
          url={args.url}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-geotiff>
      </v-map-layergroup>
    </v-map>
  ),
};

export const DeckGLGeoTIFF: Story = {
  args: {
    url: SAMPLE_GEOTIFF_URL,
    visible: true,
    opacity: 0.8,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="deck"
      zoom="10"
      center="-0.2,51.5"
      style={{ width: '100%', height: '600px' }}
    >
      <v-map-layergroup group-title="base-layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="raster">
        <v-map-layer-geotiff
          url={args.url}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-geotiff>
      </v-map-layergroup>
    </v-map>
  ),
};

export const CesiumGeoTIFF: Story = {
  args: {
    url: SAMPLE_GEOTIFF_URL,
    visible: true,
    opacity: 0.8,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="cesium"
      zoom="14"
      center="-0.2,51.5"
      style={{ width: '100%', height: '800px' }}
    >
      <v-map-layergroup group-title="base-layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="raster">
        <v-map-layer-geotiff
          url={args.url}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-geotiff>
      </v-map-layergroup>
    </v-map>
  ),
};

export const CloudOptimizedGeoTIFF: Story = {
  args: {
    url: SAMPLE_GEOTIFF_URL,
    visible: true,
    opacity: 0.7,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="14"
      center="9.002,52.0"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="base-layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="raster">
        <v-map-layer-geotiff
          url={args.url}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-geotiff>
      </v-map-layergroup>
    </v-map>
  ),
};

export const MultipleGeoTIFFLayers: Story = {
  render: () => (
    <v-map
      flavour="ol"
      zoom="14"
      center="9.002,52.0"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="base-layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="raster">
        <v-map-layer-geotiff
          url={SAMPLE_GEOTIFF_URL}
          opacity="0.6"
          z-index="1001"
        ></v-map-layer-geotiff>
        <v-map-layer-geotiff
          url={SAMPLE_GEOTIFF_URL}
          opacity="0.4"
          z-index="1002"
        ></v-map-layer-geotiff>
      </v-map-layergroup>
    </v-map>
  ),
};

export const GeoTIFFWithOpacityControl: Story = {
  args: {
    url: SAMPLE_GEOTIFF_URL,
    visible: true,
    opacity: 0.5,
    zIndex: 1000,
  },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div
        style={{ padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}
      >
        <label htmlFor="opacity-slider">Opacity: {args.opacity}</label>
        <input
          id="opacity-slider"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={args.opacity}
          style={{ width: '100%' }}
        />
      </div>
      <v-map
        flavour="ol"
        zoom="14"
        center="9.002,52.0"
        style={{ width: '100%', height: '400px' }}
      >
        <v-map-layergroup group-title="base-layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="raster">
          <v-map-layer-geotiff
            url={args.url}
            visible={args.visible}
            opacity={args.opacity}
            z-index={args.zIndex}
          ></v-map-layer-geotiff>
        </v-map-layergroup>
      </v-map>
    </div>
  ),
};
