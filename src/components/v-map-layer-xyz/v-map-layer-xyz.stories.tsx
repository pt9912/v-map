// src/components/v-map-layer-xyz/v-map-layer-xyz.stories.tsx
import { h } from '@stencil/core';
import type { Meta, StoryObj } from '@stencil/storybook-plugin';

import { VMapLayerXyz } from './v-map-layer-xyz';

const meta = {
  title: 'Layers/XYZ',
  component: VMapLayerXyz,
  tags: ['autodocs'],
} satisfies Meta<VMapLayerXyz>;

export default meta;
type Story = StoryObj<VMapLayerXyz>;

export const Primary: Story = {
  args: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attributions: '© OpenStreetMap contributors',
    maxZoom: 19,
    subdomains: 'a,b,c',
  },
  render: props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="XYZ Layer">
          <v-map-layer-xyz
            url={props.url}
            attributions={props.attributions}
            max-zoom={props.maxZoom}
            subdomains={props.subdomains}
          ></v-map-layer-xyz>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const CustomTileServer: Story = {
  args: {
    url: 'https://tile.example.com/{z}/{x}/{y}.png',
    maxZoom: 18,
    tileSize: 256,
    opacity: 0.8,
  },
  render: props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="XYZ Layer">
          <v-map-layer-xyz
            url={props.url}
            max-zoom={props.maxZoom}
            tile-size={props.tileSize}
            opacity={props.opacity}
          ></v-map-layer-xyz>
        </v-map-layergroup>
      </v-map>
    );
  },
};
