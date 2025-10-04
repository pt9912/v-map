import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';

import '../v-map/v-map';
import '../v-map-layer-osm/v-map-layer-osm';
import './v-map-layer-geotiff';

type Args = {
  url: string;
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

// Sample COG URLs for testing
const SAMPLE_COG_URL =
  'https://cloud.google.com/storage/docs/samples/storage-download-file';
const SAMPLE_GEOTIFF_URL =
  'https://storage.googleapis.com/gcp-public-data-landsat/LC08/01/044/034/LC08_L1GT_044034_20130330_20170310_01_T2/LC08_L1GT_044034_20130330_20170310_01_T2_B4.TIF';

export const OpenLayersGeoTIFF: Story = {
  args: {
    url: SAMPLE_GEOTIFF_URL,
    visible: true,
    opacity: 0.8,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="8"
      center="-122.4,37.8"
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
      zoom="8"
      center="-122.4,37.8"
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
      zoom="8"
      center="-122.4,37.8"
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
      zoom="8"
      center="-122.4,37.8"
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

export const CloudOptimizedGeoTIFF: Story = {
  args: {
    url: 'https://landsat-pds.s3.amazonaws.com/c1/L8/139/045/LC08_L1TP_139045_20170304_20170316_01_T1/LC08_L1TP_139045_20170304_20170316_01_T1_B4.TIF',
    visible: true,
    opacity: 0.7,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="10"
      center="2.35,48.85"
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
      zoom="8"
      center="-122.4,37.8"
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
          url="https://landsat-pds.s3.amazonaws.com/c1/L8/139/045/LC08_L1TP_139045_20170304_20170316_01_T1/LC08_L1TP_139045_20170304_20170316_01_T1_B3.TIF"
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
        zoom="8"
        center="-122.4,37.8"
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
