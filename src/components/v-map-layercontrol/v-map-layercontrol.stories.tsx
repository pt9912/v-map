import type { Meta, StoryObj, StoryFn } from '@stencil/storybook-plugin';
import { useArgs } from 'storybook/preview-api';
import { h } from '@stencil/core';

// 1. Komponenten-Imports
import '../v-map/v-map';
import '../v-map-layergroup/v-map-layergroup';
import '../v-map-layer-wms/v-map-layer-wms';
import '../v-map-layer-osm/v-map-layer-osm'; // Für Hintergrund-Layer
import './v-map-layercontrol';

// 2. Typdefinition mit besseren Defaults
type Args = {
  for: string;
  mockLayerGroups: Array<{
    basemapid: string | null;
    group: string;
    layers: Array<{
      id: string;
      label: string;
      visible: boolean;
      opacity: number;
      zIndex: number;
      layerType: 'wms' | 'osm';
      url?: string; // Optional für WMS-Layer
      sublayers?: string; // Optional für WMS-Layer
    }>;
  }>;
};

// // 3. Helper-Funktionen mit Typisierung
// const emitLayersReady = (mapId: string, layerGroups: Args['mockLayerGroups']) => {
//   setTimeout(() => {
//     document.dispatchEvent(
//       new CustomEvent('layersReady', {
//         detail: {
//           mapId,
//           layers: layerGroups.map(layerGroup => ({
//             ...layer,
//             // Standardwerte für fehlende Attribute
//             visible: layer.visible !== undefined ? layer.visible : true,
//             opacity: layer.opacity !== undefined ? layer.opacity : 1,
//             zIndex: layer.zIndex !== undefined ? layer.zIndex : 0,
//           })),
//         },
//       }),
//     );
//   }, 500);
// };

// 4. Meta-Konfiguration mit besseren Controls
const meta: Meta<Args> = {
  title: 'Controls/Layer Control',
  component: [
    'v-map-layergroup',
    'v-map-layer-wms',
    'v-map-layer-osm',
    'v-map-layercontrol',
  ],
  argTypes: {
    for: {
      control: 'text',
      description: 'ID der zu steuernden Karte (z. B. "map1")',
      defaultValue: 'map1',
    },
    mockLayerGroups: [
      {
        layers: {
          control: 'object',
          description: 'Array mit Mock-Layer-Daten für die Story',
        },
      },
    ],
  },
  args: {
    for: 'map1',
    mockLayerGroups: [
      {
        group: 'Hintergrund',
        basemapid: 'osm',
        layers: [
          {
            id: 'countries',
            label: 'Länder',
            visible: true,
            opacity: 0.7,
            zIndex: 100,
            layerType: 'wms',
            url: 'https://ahocevar.com/geoserver/wms',
            sublayers: 'opengeo:countries',
          },
          {
            id: 'osm',
            layerType: 'osm',
            label: 'OpenStreetMap',
            visible: true,
            opacity: 1,
            zIndex: 0,
          },
        ],
      },
    ],
  },
  // Render-Funktion mit Fehlerbehandlung
  render: (args: Args) => {
    // Event-Logging und Mock-Daten nach dem Rendern auslösen
    return (
      <div
        style={{
          display: 'flex',
          gap: '20px',
          padding: '20px',
          flexWrap: 'wrap',
        }}
      >
        <v-map
          id={args.for}
          flavour="ol"
          style={{
            display: 'block',
            width: '800px',
            height: '500px',
            border: '1px solid #ccc',
            background: '#f0f0f0',
          }}
        >
          {/* Hintergrund-Layer (Base) */}
          {args.mockLayerGroups.map(layerGroup => (
            <v-map-layergroup
              basemapid={layerGroup.basemapid}
              group-title={layerGroup.group}
              key={`base-${layerGroup.group}`}
            >
              {layerGroup.layers.map(layer =>
                layer.layerType === 'osm' ? (
                  <v-map-layer-osm
                    key={layer.id}
                    id={layer.id}
                    url={layer.url}
                    label={layer.label}
                    visible={layer.visible}
                    opacity={layer.opacity}
                    zIndex={layer.zIndex}
                  />
                ) : layer.layerType === 'wms' ? (
                  <v-map-layer-wms
                    key={layer.id}
                    id={layer.id}
                    label={layer.label}
                    url={layer.url}
                    layers={layer.sublayers}
                    visible={layer.visible}
                    opacity={layer.opacity}
                    zIndex={layer.zIndex}
                  />
                ) : null,
              )}
            </v-map-layergroup>
          ))}
        </v-map>

        <v-map-layercontrol for={args.for} style={{ width: '340px' }} />
      </div>
    );
  },
};

export default meta;

// 5. Story-Definitionen mit zusätzlichen Szenarien
type Story = StoryObj<Args>;

export const Default: Story = {
  name: 'Standard Layer Control',
  args: meta.args, // Standard-Args verwenden
};

export const MultipleGroups: Story = {
  name: 'Mehrere Layer-Gruppen',
  args: {
    for: 'map2',
    mockLayerGroups: [
      {
        basemapid: 'osm',
        group: 'Hintergrund',
        layers: [
          {
            id: 'osm',
            layerType: 'osm',
            label: 'OpenStreetMap',
            visible: true,
            opacity: 1,
            zIndex: 0,
          },
          {
            id: 'satellite',
            label: 'Satellit',
            layerType: 'osm',
            visible: false,
            opacity: 1,
            zIndex: 1,
          },
        ],
      },
      {
        basemapid: null,
        group: 'WMS-Layer',
        layers: [
          {
            id: 'countries',
            label: 'Länder',
            visible: true,
            opacity: 0.7,
            layerType: 'wms',
            zIndex: 100,
            url: 'https://ahocevar.com/geoserver/wms',
            sublayers: 'opengeo:countries',
          },
          {
            id: 'states',
            label: 'Bundesstaaten',
            visible: false,
            opacity: 0.5,
            zIndex: 120,
            layerType: 'wms',
            url: 'https://ahocevar.com/geoserver/wms',
            sublayers: 'topp:states',
          },

          {
            id: 'boundaries',
            label: 'Grenzlinien',
            visible: true,
            opacity: 0.8,
            zIndex: 110,
            layerType: 'wms',
            url: 'https://ahocevar.com/geoserver/wms',
            sublayers: 'ne:ne_10m_admin_0_boundary_lines_land',
          },
        ],
      },
    ],
  },
};

export const Empty: Story = {
  name: 'Leere Layer Control',
  args: {
    for: 'map3',
    mockLayerGroups: [],
  },
};

export const BaseLayersOnly: Story = {
  name: 'Nur Base-Layer (Radio-Buttons)',
  args: {
    for: 'map4',
    mockLayerGroups: [
      {
        basemapid: 'osm',
        group: 'Hintergrund',
        layers: [
          {
            id: 'osm',
            layerType: 'osm',
            label: 'OpenStreetMap',
            visible: true,
            opacity: 1,
            zIndex: 0,
          },
          {
            id: 'osm-de',
            layerType: 'osm',
            label: 'OpenStreetMap DE',
            url: 'https://tile.openstreetmap.de/',
            visible: false,
            opacity: 1,
            zIndex: 1,
          },
          {
            id: 'terrain',
            layerType: 'wms',
            label: 'Gelände',
            visible: false,
            opacity: 1,
            zIndex: 2,
          },
        ],
      },
    ],
  },
};

// Neue Story: Dark Mode
export const DarkMode: Story = {
  name: 'Dark Mode',
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    for: 'map7',
    mockLayerGroups: [
      {
        basemapid: null,
        group: 'Hintergrund',
        layers: [
          {
            id: 'osm-dark',
            layerType: 'osm',
            label: 'OpenStreetMap (Dark)',
            visible: true,
            opacity: 1,
            zIndex: 0,
          },
          {
            id: 'countries-dark',
            label: 'Länder (Dark)',
            visible: true,
            opacity: 0.7,
            zIndex: 100,
            layerType: 'wms',
            url: 'https://ahocevar.com/geoserver/wms',
            sublayers: 'opengeo:countries',
          },
        ],
      },
    ],
  },
  decorators: [
    Story => (
      <div style={{ background: '#222', padding: '20px', color: 'green' }}>
        <Story />
      </div>
    ),
  ],
};
