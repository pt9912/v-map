// src/components/v-map-layer-google/v-map-layer-google.stories.tsx
import { h } from '@stencil/core';
import type { Meta, StoryObj } from '@stencil/storybook-plugin';

import { VMapLayerGoogle } from './v-map-layer-google';

const meta = {
  title: 'Layers/Google',
  component: VMapLayerGoogle,
  tags: ['autodocs'],
} satisfies Meta<VMapLayerGoogle>;

export default meta;
type Story = StoryObj<VMapLayerGoogle>;

export const Primary: Story = {
  args: {
    mapType: 'roadmap',
    apiKey: 'YOUR_API_KEY',
  },
  render: props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Google Maps">
          <v-map-layer-google
            map-type={props.mapType}
            api-key={props.apiKey}
          ></v-map-layer-google>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const Satellite: Story = {
  args: {
    mapType: 'satellite',
    apiKey: 'YOUR_API_KEY',
  },
  render: props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Google Maps">
          <v-map-layer-google
            map-type={props.mapType}
            api-key={props.apiKey}
          ></v-map-layer-google>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const Terrain: Story = {
  args: {
    mapType: 'terrain',
    apiKey: 'YOUR_API_KEY',
  },
  render: props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Google Maps">
          <v-map-layer-google
            map-type={props.mapType}
            api-key={props.apiKey}
          ></v-map-layer-google>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const Hybrid: Story = {
  args: {
    mapType: 'hybrid',
    apiKey: 'YOUR_API_KEY',
  },
  render: props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Google Maps">
          <v-map-layer-google
            map-type={props.mapType}
            api-key={props.apiKey}
          ></v-map-layer-google>
        </v-map-layergroup>
      </v-map>
    );
  },
};
