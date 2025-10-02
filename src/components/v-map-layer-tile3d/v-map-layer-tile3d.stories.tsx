import type { Meta, StoryObj } from '@stencil/storybook-plugin';
import { h } from '@stencil/core';
import '../v-map/v-map';
import '../v-map-style/v-map-style';
import '../v-map-layergroup/v-map-layergroup';
import './v-map-layer-tile3d';

// 1. Arg-Typ definieren
type Args = {
  tilesetUrl: string;
  tilesetOptions: Record<string, unknown> | null;
  opacity: number;
  visible: boolean;
  zIndex: number;
  styleContent: Record<string, unknown>;
};

const defaultStyle: Record<string, unknown> = {
  color: "color('white', 0.6)",
  show: true,
};

// 2. Meta-Definition exportieren
const meta: Meta<Args> = {
  title: 'Layers/Cesium 3D Tiles',
  component: ['v-map-layer-tile3d', 'v-map-style', 'v-map-layergroup'],
  argTypes: {
    tilesetUrl: {
      control: 'text',
      description:
        'Öffentlich erreichbare Cesium 3D Tileset-URL. Standard zeigt auf das Cesium-Sandcastle-Beispiel.',
    },
    tilesetOptions: {
      control: 'object',
      description: 'Optionen, die direkt an Cesium3DTileset.fromUrl weitergereicht werden.',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      defaultValue: 1,
    },
    visible: {
      control: 'boolean',
      defaultValue: true,
    },
    zIndex: {
      control: 'number',
      defaultValue: 1000,
    },
    styleContent: {
      control: 'object',
      description: 'Cesium-Style-JSON, das an v-map-style übergeben wird.',
    },
  },
  args: {
    tilesetUrl:
      'https://sandcastle.cesium.com/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json',
    tilesetOptions: null,
    opacity: 1,
    visible: true,
    zIndex: 1000,
    styleContent: defaultStyle,
  },
  render: (args: Args) => (
    <v-map
      flavour="cesium"
      style={{ display: 'block', width: '100%', height: '420px' }}
      zoom="13"
      center="[8.5417, 47.3769]"
    >
      <v-map-style
        format="cesium-3d-tiles"
        layer-targets="cesium-tileset"
        content={JSON.stringify(args.styleContent)}
      ></v-map-style>

      <v-map-layergroup group-title="3D Tiles">
        <v-map-layer-tile3d
          id="cesium-tileset"
          url={args.tilesetUrl}
          opacity={args.opacity}
          visible={args.visible}
          zIndex={args.zIndex}
          tilesetOptions={args.tilesetOptions ? JSON.stringify(args.tilesetOptions) : undefined}
        ></v-map-layer-tile3d>
      </v-map-layergroup>
    </v-map>
  ),
};

export default meta;

type Story = StoryObj<Args>;

export const Default: Story = {
  name: 'Cesium 3D Tiles Layer',
};
