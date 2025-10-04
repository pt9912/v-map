// src/components/v-map-layer-wcs/v-map-layer-wcs.stories.tsx
import { h } from '@stencil/core';
import type { Meta, StoryObj } from '@stencil/storybook-plugin';

import { VMapLayerWcs } from './v-map-layer-wcs';

const meta = {
  title: 'Layers/WCS',
  component: VMapLayerWcs,
  tags: ['autodocs'],
} satisfies Meta<VMapLayerWcs>;

export default meta;
type Story = StoryObj<VMapLayerWcs>;

export const Primary: Story = {
  args: {
    url: 'https://maps.isric.org/mapserv',
    coverageName: 'nitrogen_0-5cm_mean',
    format: 'image/tiff',
    version: '2.0.1',
  },
  render: props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WCS Layer">
          <v-map-layer-wcs
            url={props.url}
            coverage-name={props.coverageName}
            format={props.format}
            version={props.version}
          ></v-map-layer-wcs>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const WithCustomParams: Story = {
  args: {
    url: 'https://ofmpub.epa.gov/rsig/rsigserver',
    coverageName: 'CMAQ_O3',
    format: 'image/tiff',
    version: '2.0.1',
    params: JSON.stringify({ subset: 'Long(-100,-80)', subset2: 'Lat(30,45)' }),
  },
  render: props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WCS Layer">
          <v-map-layer-wcs
            url={props.url}
            coverage-name={props.coverageName}
            format={props.format}
            version={props.version}
            params={props.params}
          ></v-map-layer-wcs>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const Leaflet: Story = {
  args: {
    url: 'https://maps.isric.org/mapserv',
    coverageName: 'nitrogen_0-5cm_mean',
    format: 'image/tiff',
    version: '2.0.1',
  },
  render: props => {
    return (
      <v-map flavour="leaflet" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WCS Layer">
          <v-map-layer-wcs
            url={props.url}
            coverage-name={props.coverageName}
            format={props.format}
            version={props.version}
          ></v-map-layer-wcs>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const DeckGL: Story = {
  args: {
    url: 'https://maps.isric.org/mapserv',
    coverageName: 'nitrogen_0-5cm_mean',
    format: 'image/tiff',
    version: '2.0.1',
  },
  render: props => {
    return (
      <v-map flavour="deck" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WCS Layer">
          <v-map-layer-wcs
            url={props.url}
            coverage-name={props.coverageName}
            format={props.format}
            version={props.version}
          ></v-map-layer-wcs>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const Cesium: Story = {
  args: {
    url: 'https://maps.isric.org/mapserv',
    coverageName: 'nitrogen_0-5cm_mean',
    format: 'image/tiff',
    version: '2.0.1',
  },
  render: props => {
    return (
      <v-map flavour="cesium" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WCS Layer">
          <v-map-layer-wcs
            url={props.url}
            coverage-name={props.coverageName}
            format={props.format}
            version={props.version}
          ></v-map-layer-wcs>
        </v-map-layergroup>
      </v-map>
    );
  },
};
