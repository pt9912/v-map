// src/components/v-map/v-map.stories.ts
import { h } from '@stencil/core';
import type { Meta, StoryObj } from '@stencil/storybook-plugin';

import { VMap } from './v-map';

const meta = {
  title: 'VMap',
  component: VMap,
  tags: ['autodocs'],
  argTypes: {
    flavour: { control: 'select', options: ['ol', 'cesium'] },
    center: { control: 'text' },
    zoom: { control: 'number' },
  },
} satisfies Meta<VMap>;

export default meta;
type Story = StoryObj<VMap>;

export const OpenLayersFlavour: Story = {
  args: { flavour: 'ol', center: '8.5417,49.0069', zoom: 10 },
  render: props => {
    return (
      <v-map {...props} style={{ height: '600px', width: '600px' }}>
        <v-map-layer-group group-title="Basis-Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layer-group>
      </v-map>
    );
  },
};

export const LeafletFlavour: Story = {
  args: { flavour: 'leaflet', center: '8.5417,49.0069', zoom: 10 },
  render: props => {
    return (
      <v-map {...props} style={{ height: '600px', width: '600px' }}>
        <v-map-layer-group group-title="Basis-Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layer-group>
      </v-map>
    );
  },
};

export const CesiumFlavour: Story = {
  args: { flavour: 'cesium', center: '8.5417,49.0069', zoom: 10 },
  render: props => {
    return (
      <v-map {...props} style={{ height: '600px', width: '600px' }}>
        <v-map-layer-group group-title="Basis-Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layer-group>
      </v-map>
    );
  },
};

export const DeckFlavour: Story = {
  args: { flavour: 'deck', center: '8.5417,49.0069', zoom: 10 },
  render: props => {
    return (
      <v-map
        {...props}
        style={{ position: 'relative', height: '600px', width: '600px' }}
      >
        <v-map-layer-group group-title="Basis-Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layer-group>
      </v-map>
    );
  },
};
