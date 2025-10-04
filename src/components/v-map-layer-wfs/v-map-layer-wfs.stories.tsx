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
    outputFormat: 'GML3',
    srsName: 'EPSG:3857',
  },
  render: props => {
    return (
      <v-map
        zoom="10"
        center="-79,43"
        flavour="ol"
        style={{ height: '600px', width: '600px' }}
      >
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WFS Layer">
          <v-map-layer-wfs
            zIndex="100"
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

export const OSMWaterAreaGML3: Story = {
  args: {
    url: 'https://ahocevar.com/geoserver/wfs',
    typeName: 'osm:water_areas',
    version: '1.1.0',
    outputFormat: 'GML3',
    srsName: 'EPSG:3857',
  },
  render: props => {
    return (
      <v-map
        zoom="10"
        center="-79,43"
        flavour="ol"
        style={{ height: '600px', width: '600px' }}
      >
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WFS Layer">
          <v-map-layer-wfs
            zIndex="100"
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

export const OSMWaterAreaJSON: Story = {
  args: {
    url: 'https://ahocevar.com/geoserver/wfs',
    typeName: 'osm:water_areas',
    version: '1.1.0',
    outputFormat: 'application/json',
    srsName: 'EPSG:3857',
  },
  render: props => {
    return (
      <v-map
        zoom="10"
        center="-79,43"
        flavour="ol"
        style={{ height: '600px', width: '600px' }}
      >
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WFS Layer">
          <v-map-layer-wfs
            zIndex="100"
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

export const OpenLayersWithFilter: Story = {
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
      <v-map
        zoom="4"
        center="-100,45"
        flavour="ol"
        style={{ height: '600px', width: '600px' }}
      >
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

export const LeafletJsonWithFilter: Story = {
  args: {
    url: 'https://ahocevar.com/geoserver/wfs',
    typeName: 'usa:states',
    version: '1.1.0',
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    params: JSON.stringify({ maxFeatures: 20 }),
  },
  render: props => {
    return (
      <v-map
        zoom="3"
        center="-120,48"
        flavour="leaflet"
        style={{ height: '600px', width: '600px' }}
      >
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

export const LeafletOSMWaterAreaJSON: Story = {
  args: {
    url: 'https://ahocevar.com/geoserver/wfs',
    typeName: 'osm:water_areas',
    version: '1.1.0',
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    params: JSON.stringify({
      maxFeatures: 2000,
      bbox: ['-81', '41', '-75', '45', 'EPSG:4326'],
    }),
  },
  render: props => {
    return (
      <v-map
        zoom="10"
        center="-79,43"
        flavour="leaflet"
        style={{ height: '600px', width: '600px' }}
      >
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WFS Layer">
          <v-map-layer-wfs
            zIndex="100"
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

export const DeckOSMWaterAreaJSON: Story = {
  args: {
    url: 'https://ahocevar.com/geoserver/wfs',
    typeName: 'osm:water_areas',
    version: '1.1.0',
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    params: JSON.stringify({
      maxFeatures: 2000,
      bbox: ['-81', '41', '-75', '45', 'EPSG:4326'],
    }),
  },
  render: props => {
    return (
      <v-map
        zoom="9"
        center="-79,43"
        flavour="deck"
        style={{ height: '600px', width: '600px' }}
      >
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WFS Layer">
          <v-map-layer-wfs
            zIndex="100"
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

export const CesiumOSMWaterAreaJSON: Story = {
  args: {
    url: 'https://ahocevar.com/geoserver/wfs',
    typeName: 'osm:water_areas',
    version: '1.1.0',
    outputFormat: 'application/json',
    srsName: 'EPSG:4326',
    params: JSON.stringify({
      maxFeatures: 2000,
      bbox: ['-81', '41', '-75', '45', 'EPSG:4326'],
    }),
  },
  render: props => {
    return (
      <v-map
        zoom="10"
        center="-79,42"
        flavour="cesium"
        style={{ height: '600px', width: '600px' }}
      >
        <v-map-layergroup group-title="Base Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
        <v-map-layergroup group-title="WFS Layer">
          <v-map-layer-wfs
            zIndex="100"
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
