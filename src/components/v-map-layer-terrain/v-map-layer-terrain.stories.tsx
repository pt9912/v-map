// src/components/v-map-layer-terrain/v-map-layer-terrain.stories.tsx
import { h } from '@stencil/core';
import type { Meta, StoryObj } from '@stencil/storybook-plugin';

import { VMapLayerTerrain } from './v-map-layer-terrain';

const meta = {
  title: 'Layers/Terrain',
  component: VMapLayerTerrain,
  tags: ['autodocs'],
} satisfies Meta<VMapLayerTerrain>;

export default meta;
type Story = StoryObj<VMapLayerTerrain>;

export const Primary: Story = {
  args: {
    elevationData:
      'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
    elevationDecoder: '{"r":256,"g":1,"b":0.00390625,"offset":-32768}',
    visible: true,
    opacity: 1,
  },
  render: props => {
    return (
      <v-map flavour="cesium" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Terrain Layer">
          <v-map-layer-terrain
            elevation-data={props.elevationData}
            elevation-decoder={props.elevationDecoder}
            visible={props.visible}
            opacity={props.opacity}
          ></v-map-layer-terrain>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const WithTexture: Story = {
  args: {
    elevationData:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/terrain.png',
    texture:
      'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/terrain-mask.png',
    visible: true,
    opacity: 1,
  },
  render: props => {
    return (
      <v-map flavour="cesium" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Terrain Layer">
          <v-map-layer-terrain
            elevation-data={props.elevationData}
            texture={props.texture}
            visible={props.visible}
            opacity={props.opacity}
          ></v-map-layer-terrain>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const Wireframe: Story = {
  args: {
    elevationData:
      'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png',
    elevationDecoder: '{"r":256,"g":1,"b":0.00390625,"offset":-32768}',
    wireframe: true,
    color: '#00ff00',
    visible: true,
    opacity: 1,
  },
  render: props => {
    return (
      <v-map flavour="cesium" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Terrain Layer">
          <v-map-layer-terrain
            elevation-data={props.elevationData}
            elevation-decoder={props.elevationDecoder}
            wireframe={props.wireframe}
            color={props.color}
            visible={props.visible}
            opacity={props.opacity}
          ></v-map-layer-terrain>
        </v-map-layergroup>
      </v-map>
    );
  },
};
