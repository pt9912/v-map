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
    elevationData: 'https://example.com/terrain/elevation.tif',
    visible: true,
    opacity: 1,
  },
  render: props => {
    return (
      <v-map flavour="cesium" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Terrain Layer">
          <v-map-layer-terrain
            elevation-data={props.elevationData}
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
    elevationData: 'https://example.com/terrain/elevation.tif',
    texture: 'https://example.com/terrain/texture.png',
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
    elevationData: 'https://example.com/terrain/elevation.tif',
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
