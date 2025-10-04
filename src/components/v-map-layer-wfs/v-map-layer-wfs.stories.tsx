// src/components/v-map-layer-wfs/v-map-layer-wfs.stories.tsx
import { h } from '@stencil/core';
import type { Meta, StoryObj } from '@stencil/storybook-plugin';

import { VMapLayerWfs } from './v-map-layer-wfs';

const meta = {
  title: 'Layers/WFS',
  component: VMapLayerWfs,
  tags: ['autodocs'],
} satisfies Meta<VMapLayerWfs>;

export default meta;
type Story = StoryObj<VMapLayerWfs>;

export const Primary: Story = {
  args: {
    url: 'https://demo.mapserver.org/cgi-bin/wfs',
    typeName: 'continents',
    version: '1.1.0',
    outputFormat: 'GML2',
    srsName: 'EPSG:3857',
  },
  render: props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WFS Layer">
          <v-map-layer-wfs
            url={props.url}
            type-name={props.typeName}
            version={props.version}
            output-format={props.outputFormat}
            srs-name={props.srsName}
          ></v-map-layer-wfs>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const WithFilter: Story = {
  args: {
    url: 'https://demo.mapserver.org/cgi-bin/wfs',
    typeName: 'cities',
    version: '1.1.0',
    outputFormat: 'GML2',
    srsName: 'EPSG:3857',
    params: JSON.stringify({ maxFeatures: 50 }),
  },
  render: props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WFS Layer">
          <v-map-layer-wfs
            url={props.url}
            type-name={props.typeName}
            version={props.version}
            output-format={props.outputFormat}
            srs-name={props.srsName}
            params={props.params}
          ></v-map-layer-wfs>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const Leaflet: Story = {
  args: {
    url: 'https://demo.mapserver.org/cgi-bin/wfs',
    typeName: 'continents',
    version: '1.1.0',
    outputFormat: 'GML2',
    srsName: 'EPSG:3857',
  },
  render: props => {
    return (
      <v-map flavour="leaflet" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WFS Layer">
          <v-map-layer-wfs
            url={props.url}
            type-name={props.typeName}
            version={props.version}
            output-format={props.outputFormat}
            srs-name={props.srsName}
          ></v-map-layer-wfs>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const DeckGL: Story = {
  args: {
    url: 'https://demo.mapserver.org/cgi-bin/wfs',
    typeName: 'cities',
    version: '1.1.0',
    outputFormat: 'GML2',
    srsName: 'EPSG:3857',
    params: JSON.stringify({ maxFeatures: 100 }),
  },
  render: props => {
    return (
      <v-map flavour="deck" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WFS Layer">
          <v-map-layer-wfs
            url={props.url}
            type-name={props.typeName}
            version={props.version}
            output-format={props.outputFormat}
            srs-name={props.srsName}
            params={props.params}
          ></v-map-layer-wfs>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const Cesium: Story = {
  args: {
    url: 'https://demo.mapserver.org/cgi-bin/wfs',
    typeName: 'continents',
    version: '1.1.0',
    outputFormat: 'GML2',
    srsName: 'EPSG:3857',
  },
  render: props => {
    return (
      <v-map flavour="cesium" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WFS Layer">
          <v-map-layer-wfs
            url={props.url}
            type-name={props.typeName}
            version={props.version}
            output-format={props.outputFormat}
            srs-name={props.srsName}
          ></v-map-layer-wfs>
        </v-map-layergroup>
      </v-map>
    );
  },
};
