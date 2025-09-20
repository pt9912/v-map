// src/components/v-map-layer-geojson/v-map-layer-geojson.stories.tsx
import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';
import '../v-map/v-map';
import '../v-map-layer-group/v-map-layer-group';
import './v-map-layer-geojson';
import '../v-map-layer-osm/v-map-layer-osm';

// 1. Define the args type
type Args = {
  geoJsonContent: unknown;
  opacity: number;
  visible: boolean;
  zIndex: number;
};

// 2. Export `meta` as the DEFAULT export
const meta: Meta<Args> = {
  title: 'Layers/GeoJSON',
  component: ['v-map-layer-geojson', 'v-map-layer-osm'], // String for lazy-loaded components
  argTypes: {
    geoJsonContent: {
      control: 'object',
      description: 'GeoJSON data for the slot',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      defaultValue: 1.0,
    },
    visible: {
      control: 'boolean',
      defaultValue: true,
    },
    zIndex: {
      control: 'number',
      defaultValue: 1000,
    },
  },
  args: {
    geoJsonContent: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Munich' },
          geometry: { type: 'Point', coordinates: [11.576124, 48.137154] },
        },
      ],
    },
    opacity: 1.0,
    visible: true,
    zIndex: 1000,
  },
  render: (args: Args) => (
    <v-map
      flavour="ol"
      style={{ display: 'block', width: '100%', height: '420px' }}
    >
      <v-map-layer-group group-title="GeoJSON Layers">
        <v-map-layer-osm zIndex="100"></v-map-layer-osm>
        <v-map-layer-geojson
          opacity={args.opacity}
          visible={args.visible}
          zIndex={args.zIndex}
        >
          <div slot="geojson">{JSON.stringify(args.geoJsonContent)}</div>
        </v-map-layer-geojson>
      </v-map-layer-group>
    </v-map>
  ),
};

export default meta; // ✅ DEFAULT export (required by Storybook)

// 3. Define and export the story
type Story = StoryObj<Args>;
export const Default: Story = {
  name: 'Default GeoJSON Layer',
};
