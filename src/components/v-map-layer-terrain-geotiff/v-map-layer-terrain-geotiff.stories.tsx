import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';

import '../v-map/v-map';
import '../v-map-layer-osm/v-map-layer-osm';
import './v-map-layer-terrain-geotiff';

type Args = {
  url: string;
  projection?: string;
  forceProjection?: boolean;
  nodata?: number;
  meshMaxError?: number;
  wireframe?: boolean;
  texture?: string;
  color?: [number, number, number];
  elevationScale?: number;
  visible?: boolean;
  opacity?: number;
  zIndex?: number;
};

const meta: Meta<Args> = {
  title: 'Layers/Terrain GeoTIFF',
  component: 'v-map-layer-terrain-geotiff',
  parameters: {
    docs: {
      description: {
        component:
          'GeoTIFF Terrain layer component for displaying 3D terrain from GeoTIFF elevation data using deck.gl.',
      },
    },
  },
  argTypes: {
    url: {
      control: 'text',
      description: 'URL to the GeoTIFF file containing elevation data',
    },
    projection: {
      control: 'text',
      description: 'Source projection (e.g., "EPSG:32632")',
      table: { defaultValue: { summary: 'auto-detected' } },
    },
    forceProjection: {
      control: 'boolean',
      description: 'Force projection prop, ignore GeoKeys',
      table: { defaultValue: { summary: 'false' } },
    },
    nodata: {
      control: 'number',
      description: 'NoData value to discard from elevation',
      table: { defaultValue: { summary: 'null' } },
    },
    meshMaxError: {
      control: { type: 'number', min: 0.5, max: 20, step: 0.5 },
      description: 'Mesh error tolerance in meters (smaller = more detailed)',
      table: { defaultValue: { summary: '4.0' } },
    },
    wireframe: {
      control: 'boolean',
      description: 'Enable wireframe mode',
      table: { defaultValue: { summary: 'false' } },
    },
    texture: {
      control: 'text',
      description: 'Optional texture URL',
      table: { defaultValue: { summary: 'null' } },
    },
    elevationScale: {
      control: { type: 'number', min: 0.1, max: 10, step: 0.1 },
      description: 'Elevation exaggeration factor',
      table: { defaultValue: { summary: '1.0' } },
    },
    visible: {
      control: 'boolean',
      description: 'Layer visibility',
      table: { defaultValue: { summary: 'true' } },
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Layer opacity (0-1)',
      table: { defaultValue: { summary: '1.0' } },
    },
    zIndex: {
      control: 'number',
      description: 'Z-index for layer stacking order',
      table: { defaultValue: { summary: '100' } },
    },
  },
};

export default meta;
type Story = StoryObj<Args>;

// Sample GeoTIFF elevation data URLs
const SAMPLE_DEM_URL =
  'https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/2020/S2A_32TPT_20200508_0_L2A/DEM.tif';

/**
 * Basic GeoTIFF Terrain Layer
 * Displays 3D terrain from a GeoTIFF elevation file using deck.gl.
 */
export const Basic: Story = {
  args: {
    url: SAMPLE_DEM_URL,
    visible: true,
    opacity: 1,
    zIndex: 100,
    meshMaxError: 4.0,
    wireframe: false,
    elevationScale: 1.0,
  },
  render: args => (
    <v-map
      provider="deck"
      zoom="10"
      center="11.5,48.1"
      style={{ width: '100%', height: '600px' }}
    >
      <v-map-layergroup group-title="Terrain">
        <v-map-layer-terrain-geotiff
          url={args.url}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
          mesh-max-error={args.meshMaxError}
          wireframe={args.wireframe}
          elevation-scale={args.elevationScale}
        ></v-map-layer-terrain-geotiff>
      </v-map-layergroup>
    </v-map>
  ),
};

/**
 * Terrain with Texture Overlay
 * Displays terrain with a texture image overlay (OpenStreetMap).
 */
export const WithTexture: Story = {
  args: {
    url: SAMPLE_DEM_URL,
    texture: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    visible: true,
    opacity: 1,
    zIndex: 100,
    meshMaxError: 4.0,
    wireframe: false,
    elevationScale: 2.0,
  },
  render: args => (
    <v-map
      provider="deck"
      zoom="10"
      center="11.5,48.1"
      style={{ width: '100%', height: '600px' }}
    >
      <v-map-layergroup group-title="Terrain">
        <v-map-layer-terrain-geotiff
          url={args.url}
          texture={args.texture}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
          mesh-max-error={args.meshMaxError}
          wireframe={args.wireframe}
          elevation-scale={args.elevationScale}
        ></v-map-layer-terrain-geotiff>
      </v-map-layergroup>
    </v-map>
  ),
};

/**
 * Wireframe Mode
 * Displays terrain in wireframe mode (only mesh lines).
 */
export const Wireframe: Story = {
  args: {
    url: SAMPLE_DEM_URL,
    visible: true,
    opacity: 1,
    zIndex: 100,
    meshMaxError: 4.0,
    wireframe: true,
    elevationScale: 2.0,
  },
  render: args => (
    <v-map
      provider="deck"
      zoom="10"
      center="11.5,48.1"
      style={{ width: '100%', height: '600px' }}
    >
      <v-map-layergroup group-title="Terrain">
        <v-map-layer-terrain-geotiff
          url={args.url}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
          mesh-max-error={args.meshMaxError}
          wireframe={args.wireframe}
          elevation-scale={args.elevationScale}
        ></v-map-layer-terrain-geotiff>
      </v-map-layergroup>
    </v-map>
  ),
};

/**
 * High Detail Terrain
 * Uses a smaller meshMaxError for more detailed terrain (slower).
 */
export const HighDetail: Story = {
  args: {
    url: SAMPLE_DEM_URL,
    visible: true,
    opacity: 1,
    zIndex: 100,
    meshMaxError: 1.0,
    wireframe: false,
    elevationScale: 2.0,
  },
  render: args => (
    <v-map
      provider="deck"
      zoom="12"
      center="11.5,48.1"
      style={{ width: '100%', height: '600px' }}
    >
      <v-map-layergroup group-title="Terrain">
        <v-map-layer-terrain-geotiff
          url={args.url}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
          mesh-max-error={args.meshMaxError}
          wireframe={args.wireframe}
          elevation-scale={args.elevationScale}
        ></v-map-layer-terrain-geotiff>
      </v-map-layergroup>
    </v-map>
  ),
};

/**
 * Exaggerated Elevation
 * Uses a higher elevationScale to exaggerate terrain features.
 */
export const ExaggeratedElevation: Story = {
  args: {
    url: SAMPLE_DEM_URL,
    visible: true,
    opacity: 1,
    zIndex: 100,
    meshMaxError: 4.0,
    wireframe: false,
    elevationScale: 5.0,
  },
  render: args => (
    <v-map
      provider="deck"
      zoom="10"
      center="11.5,48.1"
      style={{ width: '100%', height: '600px' }}
    >
      <v-map-layergroup group-title="Terrain">
        <v-map-layer-terrain-geotiff
          url={args.url}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
          mesh-max-error={args.meshMaxError}
          wireframe={args.wireframe}
          elevation-scale={args.elevationScale}
        ></v-map-layer-terrain-geotiff>
      </v-map-layergroup>
    </v-map>
  ),
};

/**
 * With Base Layer
 * Displays terrain with an OSM base layer underneath.
 */
export const WithBaseLayer: Story = {
  args: {
    url: SAMPLE_DEM_URL,
    visible: true,
    opacity: 0.8,
    zIndex: 100,
    meshMaxError: 4.0,
    wireframe: false,
    elevationScale: 2.0,
  },
  render: args => (
    <v-map
      provider="deck"
      zoom="10"
      center="11.5,48.1"
      style={{ width: '100%', height: '600px' }}
    >
      <v-map-layergroup group-title="Base">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="Terrain">
        <v-map-layer-terrain-geotiff
          url={args.url}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
          mesh-max-error={args.meshMaxError}
          wireframe={args.wireframe}
          elevation-scale={args.elevationScale}
        ></v-map-layer-terrain-geotiff>
      </v-map-layergroup>
    </v-map>
  ),
};
