import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';

import '../v-map/v-map';
import '../v-map-layergroup/v-map-layergroup';
import '../v-map-layer-osm/v-map-layer-osm';
import './v-map-layer-wkt';

type Args = {
  wkt?: string;
  url?: string;
  visible?: boolean;
  opacity?: number;
  zIndex?: number;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  pointRadius?: number;
  pointColor?: string;
  iconUrl?: string;
  iconSize?: string;
  textProperty?: string;
  textColor?: string;
  textSize?: number;
};

const meta: Meta<Args> = {
  title: 'Layers/WKT',
  component: 'v-map-layer-wkt',
  parameters: {
    docs: {
      description: {
        component:
          'WKT (Well-Known Text) layer component for displaying geometric features from WKT strings or URLs.',
      },
    },
  },
  argTypes: {
    wkt: {
      control: 'text',
      description:
        'WKT geometry string (e.g., "POINT(11.57 48.14)" or "POLYGON((...))")',
    },
    url: {
      control: 'text',
      description: 'URL to fetch WKT geometry from (alternative to wkt prop)',
    },
    visible: {
      control: 'boolean',
      description: 'Layer visibility',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Layer opacity (0-1)',
    },
    zIndex: {
      control: 'number',
      description: 'Z-index for layer stacking order',
    },
    // Styling properties
    fillColor: {
      control: 'color',
      description: 'Fill color for polygon geometries',
    },
    fillOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Fill opacity (0-1)',
    },
    strokeColor: {
      control: 'color',
      description: 'Stroke color for lines and polygon outlines',
    },
    strokeWidth: {
      control: { type: 'range', min: 1, max: 10, step: 1 },
      description: 'Stroke width in pixels',
    },
    strokeOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Stroke opacity (0-1)',
    },
    pointRadius: {
      control: { type: 'range', min: 2, max: 20, step: 1 },
      description: 'Point radius in pixels',
    },
    pointColor: {
      control: 'color',
      description: 'Point color for point geometries',
    },
    iconUrl: {
      control: 'text',
      description: 'Icon URL for point features (alternative to point styling)',
    },
    iconSize: {
      control: 'text',
      description: 'Icon size as "width,height" (e.g., "32,32")',
    },
    textProperty: {
      control: 'text',
      description: 'Property name from feature to display as label',
    },
    textColor: {
      control: 'color',
      description: 'Text color for labels',
    },
    textSize: {
      control: { type: 'range', min: 8, max: 24, step: 1 },
      description: 'Text size in pixels',
    },
  },
};

export default meta;
type Story = StoryObj<Args>;

export const Point: Story = {
  args: {
    wkt: 'POINT(11.57548 48.13743)',
    visible: true,
    opacity: 1,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="10"
      center="11.57548,48.13743"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const LineString: Story = {
  args: {
    wkt: 'LINESTRING(11.5 48.1, 11.6 48.15, 11.65 48.2)',
    visible: true,
    opacity: 1,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="10"
      center="11.57,48.15"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const Polygon: Story = {
  args: {
    wkt: 'POLYGON((11.5 48.1, 11.6 48.1, 11.6 48.2, 11.5 48.2, 11.5 48.1))',
    visible: true,
    opacity: 0.7,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="10"
      center="11.55,48.15"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const MunichArea: Story = {
  args: {
    wkt: 'POLYGON((11.360 48.061, 11.723 48.061, 11.723 48.248, 11.360 48.248, 11.360 48.061))',
    visible: true,
    opacity: 0.5,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="9"
      center="11.541,48.154"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const LeafletPoint: Story = {
  args: {
    wkt: 'POINT(11.57548 48.13743)',
    visible: true,
    opacity: 1,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="leaflet"
      zoom="10"
      center="11.57548,48.13743"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const LeafletPolygon: Story = {
  args: {
    wkt: 'POLYGON((11.5 48.1, 11.6 48.1, 11.6 48.2, 11.5 48.2, 11.5 48.1))',
    visible: true,
    opacity: 0.7,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="leaflet"
      zoom="10"
      center="11.55,48.15"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const DeckGLPoint: Story = {
  args: {
    wkt: 'POINT(11.57548 48.13743)',
    visible: true,
    opacity: 1,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="deck"
      zoom="10"
      center="11.57548,48.13743"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const DeckGLPolygon: Story = {
  args: {
    wkt: 'POLYGON((11.5 48.1, 11.6 48.1, 11.6 48.2, 11.5 48.2, 11.5 48.1))',
    visible: true,
    opacity: 0.7,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="deck"
      zoom="10"
      center="11.55,48.15"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const CesiumPoint: Story = {
  args: {
    wkt: 'POINT(11.57548 48.13743)',
    visible: true,
    opacity: 1,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="cesium"
      zoom="10"
      center="11.57548,48.13743"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const CesiumPolygon: Story = {
  args: {
    wkt: 'POLYGON((11.5 48.1, 11.6 48.1, 11.6 48.2, 11.5 48.2, 11.5 48.1))',
    visible: true,
    opacity: 0.7,
    zIndex: 1000,
  },
  render: args => (
    <v-map
      flavour="cesium"
      zoom="10"
      center="11.55,48.15"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const StyledPoint: Story = {
  args: {
    wkt: 'POINT(11.57548 48.13743)',
    visible: true,
    opacity: 1,
    zIndex: 1000,
    pointRadius: 12,
    pointColor: '#ff0000',
    strokeColor: '#ffffff',
    strokeWidth: 3,
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="12"
      center="11.57548,48.13743"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
          point-radius={args.pointRadius}
          point-color={args.pointColor}
          stroke-color={args.strokeColor}
          stroke-width={args.strokeWidth}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const StyledPolygon: Story = {
  args: {
    wkt: 'POLYGON((11.5 48.1, 11.6 48.1, 11.6 48.2, 11.5 48.2, 11.5 48.1))',
    visible: true,
    opacity: 1,
    zIndex: 1000,
    fillColor: '#ff6b6b',
    fillOpacity: 0.4,
    strokeColor: '#c92a2a',
    strokeWidth: 3,
    strokeOpacity: 0.8,
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="11"
      center="11.55,48.15"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
          fill-color={args.fillColor}
          fill-opacity={args.fillOpacity}
          stroke-color={args.strokeColor}
          stroke-width={args.strokeWidth}
          stroke-opacity={args.strokeOpacity}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const WithIcon: Story = {
  args: {
    wkt: 'POINT(11.57548 48.13743)',
    visible: true,
    opacity: 1,
    zIndex: 1000,
    iconUrl: 'https://cdn-icons-png.flaticon.com/32/684/684908.png',
    iconSize: '32,32',
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="12"
      center="11.57548,48.13743"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
          icon-url={args.iconUrl}
          icon-size={args.iconSize}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const DashedLine: Story = {
  args: {
    wkt: 'LINESTRING(11.5 48.1, 11.6 48.15, 11.65 48.2)',
    visible: true,
    opacity: 1,
    zIndex: 1000,
    strokeColor: '#4dabf7',
    strokeWidth: 4,
    strokeOpacity: 0.9,
  },
  render: args => (
    <v-map
      flavour="ol"
      zoom="11"
      center="11.575,48.15"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layer">
        <v-map-layer-wkt
          wkt={args.wkt}
          visible={args.visible}
          opacity={args.opacity}
          z-index={args.zIndex}
          stroke-color={args.strokeColor}
          stroke-width={args.strokeWidth}
          stroke-opacity={args.strokeOpacity}
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};

export const MultipleGeometries: Story = {
  render: () => (
    <v-map
      flavour="ol"
      zoom="9"
      center="11.541,48.154"
      style={{ width: '100%', height: '400px' }}
    >
      <v-map-layergroup group-title="Base Layer">
        <v-map-layer-osm></v-map-layer-osm>
      </v-map-layergroup>
      <v-map-layergroup group-title="WKT Layers">
        {/* Red styled point */}
        <v-map-layer-wkt
          wkt="POINT(11.57548 48.13743)"
          z-index="1001"
          point-radius="10"
          point-color="#e03131"
          stroke-color="#ffffff"
          stroke-width="2"
        ></v-map-layer-wkt>
        {/* Blue styled line */}
        <v-map-layer-wkt
          wkt="LINESTRING(11.5 48.1, 11.6 48.15, 11.65 48.2)"
          z-index="1002"
          stroke-color="#1971c2"
          stroke-width="4"
        ></v-map-layer-wkt>
        {/* Green styled polygon */}
        <v-map-layer-wkt
          wkt="POLYGON((11.45 48.08, 11.55 48.08, 11.55 48.18, 11.45 48.18, 11.45 48.08))"
          opacity="0.8"
          z-index="1003"
          fill-color="#51cf66"
          fill-opacity="0.3"
          stroke-color="#2f9e44"
          stroke-width="2"
        ></v-map-layer-wkt>
      </v-map-layergroup>
    </v-map>
  ),
};
