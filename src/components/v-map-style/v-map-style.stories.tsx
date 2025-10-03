import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';

import '../v-map/v-map';
import '../v-map-layergroup/v-map-layergroup';
import '../v-map-layer-osm/v-map-layer-osm';
import '../v-map-layer-wkt/v-map-layer-wkt';
import '../v-map-layer-geojson/v-map-layer-geojson';
import './v-map-style';

type Args = {
  format: 'sld' | 'mapbox-gl' | 'qgis' | 'lyrx' | 'cesium-3d-tiles';
  autoApply: boolean;
  layerTargets: string;
};

const meta: Meta<Args> = {
  title: 'Map/Style',
  component: 'v-map-style',
  parameters: {
    docs: {
      description: {
        component:
          'Style component for applying various style formats (SLD, Mapbox GL, QGIS, LYRX, Cesium 3D Tiles) to map layers.',
      },
    },
  },
  argTypes: {
    format: {
      control: 'select',
      options: ['sld', 'mapbox-gl', 'qgis', 'lyrx', 'cesium-3d-tiles'],
      description: 'Style format to parse',
    },
    layerTargets: {
      control: 'text',
      description: 'Comma-separated layer IDs to apply style to',
    },
    autoApply: {
      control: 'boolean',
      description: 'Automatically apply style when loaded',
    },
  },
};

export default meta;
type Story = StoryObj<Args>;

// Sample SLD for point styling
const simpleSLD = `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld">
  <NamedLayer>
    <Name>point-layer</Name>
    <UserStyle>
      <Title>Red Circle Style</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Red Circle</Name>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#ff0000</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#000000</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>16</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;

// Sample SLD for polygon styling
const polygonSLD = `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld">
  <NamedLayer>
    <Name>polygon-layer</Name>
    <UserStyle>
      <Title>Blue Polygon Style</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Blue Fill</Name>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#4dabf7</CssParameter>
              <CssParameter name="fill-opacity">0.5</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#1971c2</CssParameter>
              <CssParameter name="stroke-width">3</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;

// Sample Mapbox GL Style
const mapboxStyle = {
  version: 8,
  name: 'Simple Point Style',
  sources: {
    'point-source': {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [11.57548, 48.13743],
        },
        properties: {
          name: 'Munich Point',
        },
      },
    },
  },
  layers: [
    {
      id: 'point-layer',
      type: 'circle',
      source: 'point-source',
      paint: {
        'circle-radius': 12,
        'circle-color': '#51cf66',
        'circle-stroke-color': '#2f9e44',
        'circle-stroke-width': 2,
      },
    },
  ],
};

// Sample GeoJSON data
const pointGeoJSON = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [11.57548, 48.13743],
  },
  properties: {
    name: 'Munich Point',
  },
};

const polygonGeoJSON = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [11.5, 48.1],
        [11.6, 48.1],
        [11.6, 48.2],
        [11.5, 48.2],
        [11.5, 48.1],
      ],
    ],
  },
  properties: {
    name: 'Munich Area',
  },
};

// WKT data
const pointWKT = 'POINT(11.57548 48.13743)';
const polygonWKT =
  'POLYGON((11.5 48.1, 11.6 48.1, 11.6 48.2, 11.5 48.2, 11.5 48.1))';

export const SLDWithWKTPoint: Story = {
  args: {
    format: 'sld',
    autoApply: true,
    layerTargets: 'styled-point',
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="12"
      center="11.57548,48.13743"
      style={{ width: '100%', height: '500px' }}
    >
      <v-map-style
        format={args.format}
        content={simpleSLD}
        layer-targets={args.layerTargets}
        auto-apply={args.autoApply}
      ></v-map-style>

      <v-map-layergroup group-title="Base Layers">
        <v-map-layer-osm zIndex="0"></v-map-layer-osm>
      </v-map-layergroup>

      <v-map-layergroup group-title="Styled Layers">
        <v-map-layer-wkt
          id="styled-point"
          wkt={pointWKT}
          zIndex="100"
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const SLDWithGeoJSONPolygon: Story = {
  args: {
    format: 'sld',
    autoApply: true,
    layerTargets: 'styled-polygon',
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="10"
      center="11.55,48.15"
      style={{ width: '100%', height: '500px' }}
    >
      <v-map-style
        format={args.format}
        content={polygonSLD}
        layer-targets={args.layerTargets}
        auto-apply={args.autoApply}
      ></v-map-style>

      <v-map-layergroup group-title="Base Layers">
        <v-map-layer-osm zIndex="0"></v-map-layer-osm>
      </v-map-layergroup>

      <v-map-layergroup group-title="Styled Layers">
        <v-map-layer-geojson
          id="styled-polygon"
          geojson={JSON.stringify(polygonGeoJSON)}
          zIndex="100"
        ></v-map-layer-geojson>
      </v-map-layergroup>
    </v-map>
  ),
};

export const MapboxGLStyle: Story = {
  args: {
    format: 'mapbox-gl',
    autoApply: true,
    layerTargets: 'mapbox-layer',
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="12"
      center="11.57548,48.13743"
      style={{ width: '100%', height: '500px' }}
    >
      <v-map-style
        format={args.format}
        content={JSON.stringify(mapboxStyle)}
        layer-targets={args.layerTargets}
        auto-apply={args.autoApply}
      ></v-map-style>

      <v-map-layergroup group-title="Base Layers">
        <v-map-layer-osm zIndex="0"></v-map-layer-osm>
      </v-map-layergroup>

      <v-map-layergroup group-title="Styled Layers">
        <v-map-layer-geojson
          id="mapbox-layer"
          geojson={JSON.stringify(pointGeoJSON)}
          zIndex="100"
        ></v-map-layer-geojson>
      </v-map-layergroup>
    </v-map>
  ),
};

export const MultipleStylesMultipleLayers: Story = {
  render: () => (
    <v-map
      flavour="ol"
      zoom="10"
      center="11.55,48.15"
      style={{ width: '100%', height: '500px' }}
    >
      {/* Style for points */}
      <v-map-style
        format="sld"
        content={simpleSLD}
        layer-targets="point-1,point-2"
      ></v-map-style>

      {/* Style for polygon */}
      <v-map-style
        format="sld"
        content={polygonSLD}
        layer-targets="polygon-1"
      ></v-map-style>

      <v-map-layergroup group-title="Base Layers">
        <v-map-layer-osm zIndex="0"></v-map-layer-osm>
      </v-map-layergroup>

      <v-map-layergroup group-title="Styled Layers">
        {/* Points with red circle style */}
        <v-map-layer-wkt
          id="point-1"
          wkt="POINT(11.52 48.13)"
          zIndex="100"
        ></v-map-layer-wkt>
        <v-map-layer-wkt
          id="point-2"
          wkt="POINT(11.58 48.17)"
          zIndex="100"
        ></v-map-layer-wkt>

        {/* Polygon with blue fill style */}
        <v-map-layer-geojson
          id="polygon-1"
          geojson={JSON.stringify(polygonGeoJSON)}
          zIndex="80"
        ></v-map-layer-geojson>
      </v-map-layergroup>
    </v-map>
  ),
};

export const AutoApplyDisabled: Story = {
  args: {
    format: 'sld',
    autoApply: false,
    layerTargets: 'manual-point',
  },
  render: args => (
    <div>
      <p
        style={{
          marginBottom: '1rem',
          padding: '0.5rem',
          background: '#fff3cd',
          borderRadius: '4px',
        }}
      >
        ℹ️ <strong>Auto-apply is disabled.</strong> The style is parsed but not
        automatically applied to layers. You would need to manually call{' '}
        <code>loadAndParseStyle()</code> or set <code>auto-apply="true"</code>.
      </p>
      <v-map
        flavour="ol"
        zoom="12"
        center="11.57548,48.13743"
        style={{ width: '100%', height: '500px' }}
      >
        <v-map-style
          format={args.format}
          content={simpleSLD}
          layer-targets={args.layerTargets}
          auto-apply={args.autoApply}
        ></v-map-style>

        <v-map-layergroup group-title="Base Layers">
          <v-map-layer-osm zIndex="0"></v-map-layer-osm>
        </v-map-layergroup>

        <v-map-layergroup group-title="Styled Layers">
          <v-map-layer-wkt
            id="manual-point"
            wkt={pointWKT}
            zIndex="100"
          ></v-map-layer-wkt>
        </v-map-layergroup>
      </v-map>
    </div>
  ),
};

export const LeafletWithSLD: Story = {
  args: {
    format: 'sld',
    autoApply: true,
    layerTargets: 'leaflet-polygon',
  },
  render: args => (
    <v-map
      flavour="leaflet"
      zoom="10"
      center="11.55,48.15"
      style={{ width: '100%', height: '500px' }}
    >
      <v-map-style
        format={args.format}
        content={polygonSLD}
        layer-targets={args.layerTargets}
        auto-apply={args.autoApply}
      ></v-map-style>

      <v-map-layergroup group-title="Base Layers">
        <v-map-layer-osm zIndex="0" opacity="0.7"></v-map-layer-osm>
      </v-map-layergroup>

      <v-map-layergroup group-title="Styled Layers">
        <v-map-layer-wkt
          id="leaflet-polygon"
          wkt={polygonWKT}
          zIndex="100"
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const DeckGLWithSLD: Story = {
  args: {
    format: 'sld',
    autoApply: true,
    layerTargets: 'deck-point',
  },
  render: args => (
    <v-map
      flavour="deck"
      zoom="12"
      center="11.57548,48.13743"
      style={{ width: '100%', height: '500px' }}
    >
      <v-map-style
        format={args.format}
        content={simpleSLD}
        layer-targets={args.layerTargets}
        auto-apply={args.autoApply}
      ></v-map-style>

      <v-map-layergroup group-title="Base Layers">
        <v-map-layer-osm zIndex="0"></v-map-layer-osm>
      </v-map-layergroup>

      <v-map-layergroup group-title="Styled Layers">
        <v-map-layer-geojson
          id="deck-point"
          geojson={JSON.stringify(pointGeoJSON)}
          zIndex="100"
        ></v-map-layer-geojson>
      </v-map-layergroup>
    </v-map>
  ),
};

export const CesiumWithoutSLD: Story = {
  args: {
    format: 'sld',
    autoApply: true,
    layerTargets: 'cesium-polygon',
  },
  render: args => (
    <v-map
      flavour="cesium"
      zoom="10"
      center="11.55,48.15"
      style={{ width: '100%', height: '500px' }}
    >
      <v-map-layergroup group-title="Base Layers">
        <v-map-layer-osm zIndex="0"></v-map-layer-osm>
      </v-map-layergroup>

      <v-map-layergroup group-title="Styled Layers">
        <v-map-layer-geojson
          id="cesium-polygon"
          geojson={JSON.stringify(polygonGeoJSON)}
          zIndex="100"
        ></v-map-layer-geojson>
      </v-map-layergroup>
    </v-map>
  ),
};

export const CesiumWithSLD: Story = {
  args: {
    format: 'sld',
    autoApply: true,
    layerTargets: 'cesium-polygon',
  },
  render: args => (
    <v-map
      flavour="cesium"
      zoom="10"
      center="11.55,48.15"
      style={{ width: '100%', height: '500px' }}
    >
      <v-map-style
        format={args.format}
        content={polygonSLD}
        layer-targets={args.layerTargets}
        auto-apply={args.autoApply}
      ></v-map-style>

      <v-map-layergroup group-title="Base Layers">
        <v-map-layer-osm zIndex="0"></v-map-layer-osm>
      </v-map-layergroup>

      <v-map-layergroup group-title="Styled Layers">
        <v-map-layer-geojson
          id="cesium-polygon"
          geojson={JSON.stringify(polygonGeoJSON)}
          zIndex="100"
        ></v-map-layer-geojson>
      </v-map-layergroup>
    </v-map>
  ),
};

export const ComplexSLDWithLineString: Story = {
  render: () => {
    const lineSLD = `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld">
  <NamedLayer>
    <Name>line-layer</Name>
    <UserStyle>
      <Title>Bold Red Line Style</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Bold Red Line</Name>
          <LineSymbolizer>
            <Stroke>
              <CssParameter name="stroke">#ff0000</CssParameter>
              <CssParameter name="stroke-width">6</CssParameter>
              <CssParameter name="stroke-opacity">1.0</CssParameter>
            </Stroke>
          </LineSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;

    const lineWKT =
      'LINESTRING(11.5 48.1, 11.55 48.14, 11.6 48.18, 11.65 48.15)';

    return (
      <v-map
        flavour="ol"
        zoom="11"
        center="11.575,48.14"
        style={{ width: '100%', height: '500px' }}
      >
        <v-map-style
          format="sld"
          content={lineSLD}
          layer-targets="line-layer"
        ></v-map-style>

        <v-map-layergroup group-title="Base Layers">
          <v-map-layer-osm zIndex="0" opacity="0.7"></v-map-layer-osm>
        </v-map-layergroup>

        <v-map-layergroup group-title="Styled Layers">
          <v-map-layer-wkt
            id="line-layer"
            wkt={lineWKT}
            zIndex="100"
          ></v-map-layer-wkt>
        </v-map-layergroup>
      </v-map>
    );
  },
};

export const StyleWithoutTargets: Story = {
  render: () => (
    <div>
      <p
        style={{
          marginBottom: '1rem',
          padding: '0.5rem',
          background: '#e3f2fd',
          borderRadius: '4px',
        }}
      >
        ℹ️ <strong>No layer targets specified.</strong> The style is parsed and
        ready, but not applied to any specific layers. It could be applied
        programmatically to all compatible layers.
      </p>
      <v-map
        flavour="ol"
        zoom="12"
        center="11.57548,48.13743"
        style={{ width: '100%', height: '500px' }}
      >
        <v-map-style format="sld" content={simpleSLD}></v-map-style>

        <v-map-layergroup group-title="Base Layers">
          <v-map-layer-osm zIndex="0"></v-map-layer-osm>
        </v-map-layergroup>

        <v-map-layergroup group-title="Styled Layers">
          <v-map-layer-wkt wkt={pointWKT} zIndex="100"></v-map-layer-wkt>
        </v-map-layergroup>
      </v-map>
    </div>
  ),
};
