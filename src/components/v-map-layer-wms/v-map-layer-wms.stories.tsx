// src/components/v-map/v-map.stories.ts
import { h } from '@stencil/core';
import type { Meta, StoryObj } from '@stencil/storybook-plugin';
//import { html } from 'lit';
import '../v-map/v-map';
import '../v-map-layergroup/v-map-layergroup';
import './v-map-layer-wms';

type Args = {
  url: string;
  layers: string;
  opacity: number;
  visible: boolean;
  zIndex: number;
};

const meta: Meta<Args> = {
  title: 'Layers/WMS',
  component: ['v-map-layer-wms', 'v-map-layer-osm'],
  argTypes: {
    url: {
      control: 'text',
      description: 'WMS url',
    },
    layers: {
      control: 'text',
      description: 'Layers',
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
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<Args>;

export const Primary: Story = {
  args: {
    url: 'https://ahocevar.com/geoserver/wms',
    layers:
      'opengeo:countries,ne:ne_10m_admin_0_boundary_lines_land,topp:states,ne:ne_10m_populated_places',
    opacity: 1.0,
    visible: true,
    zIndex: 100,
  },
  render: (args: Args) => {
    return (
      <v-map
        flavour="ol"
        center="-96,36"
        zoom="4.5"
        style={{ display: 'block', height: '600px', width: '100%' }}
      >
        <v-map-layergroup group-title="WMS-Layer">
          <v-map-layer-wms
            url={args.url}
            layers={args.layers}
            opacity={args.opacity}
            visible={args.visible}
            zIndex={args.zIndex}
          ></v-map-layer-wms>
        </v-map-layergroup>
      </v-map>
    );
  },
};
