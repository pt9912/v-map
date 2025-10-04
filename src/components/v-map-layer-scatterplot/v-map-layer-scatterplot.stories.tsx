// src/components/v-map-layer-scatterplot/v-map-layer-scatterplot.stories.tsx
import { h } from '@stencil/core';
import type { Meta, StoryObj } from '@stencil/storybook-plugin';

import { VMapLayerScatterplot } from './v-map-layer-scatterplot';

const meta = {
  title: 'Layers/Scatterplot',
  component: VMapLayerScatterplot,
  tags: ['autodocs'],
} satisfies Meta<VMapLayerScatterplot>;

export default meta;
type Story = StoryObj<VMapLayerScatterplot>;

const sampleData = JSON.stringify([
  { position: [8.6821, 50.1109], name: 'Frankfurt' },
  { position: [13.4050, 52.5200], name: 'Berlin' },
  { position: [9.9937, 53.5511], name: 'Hamburg' },
  { position: [11.5820, 48.1351], name: 'München' },
  { position: [6.9603, 50.9375], name: 'Köln' },
]);

export const Primary: Story = {
  args: {
    data: sampleData,
    getFillColor: '#ff6b6b',
    getRadius: 5000,
  },
  render: props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Scatterplot Layer">
          <v-map-layer-scatterplot
            data={props.data}
            get-fill-color={props.getFillColor}
            get-radius={props.getRadius}
          ></v-map-layer-scatterplot>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const CustomColors: Story = {
  args: {
    data: sampleData,
    getFillColor: '#4ecdc4',
    getRadius: 8000,
    opacity: 0.8,
  },
  render: props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Scatterplot Layer">
          <v-map-layer-scatterplot
            data={props.data}
            get-fill-color={props.getFillColor}
            get-radius={props.getRadius}
            opacity={props.opacity}
          ></v-map-layer-scatterplot>
        </v-map-layergroup>
      </v-map>
    );
  },
};
