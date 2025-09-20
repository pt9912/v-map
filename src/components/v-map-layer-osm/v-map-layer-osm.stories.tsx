// src/components/v-map/v-map.stories.ts
import { h } from '@stencil/core';
import type { Meta, StoryObj } from '@stencil/storybook-plugin';
//import { html } from 'lit';

import { VMapLayerOSM } from './v-map-layer-osm';

const meta = {
  title: 'Layers/OSM',
  component: VMapLayerOSM,
  tags: ['autodocs'],
} satisfies Meta<VMapLayerOSM>;

export default meta;
type Story = StoryObj<VMapLayerOSM>;

export const Primary: Story = {
  args: {},
  render: _props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layer-group group-title="Basis-Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layer-group>
      </v-map>
    );
  },
};
