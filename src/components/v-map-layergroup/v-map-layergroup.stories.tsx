// src/components/v-map/v-map.stories.ts
import { h } from '@stencil/core';
import type { Meta, StoryObj } from '@stencil/storybook-plugin';
//import { html } from 'lit';

import { VMapEvents } from '../../utils/events';

//import { VMapLayerOSMoup } from '../v-map-layer-osm/v-map-layer-osm';
import { VMapLayerGroup } from './v-map-layergroup';
import { log } from '../../utils/logger';

const meta = {
  title: 'Container/LayerGroup',
  component: VMapLayerGroup,
  tags: ['autodocs'],
} satisfies Meta<VMapLayerGroup>;

export default meta;
type Story = StoryObj<VMapLayerGroup>;

export const Primary: Story = {
  args: {},
  render: _props => {
    return (
      <v-map flavour="ol" style={{ height: '600px', width: '600px' }}>
        <v-map-layergroup group-title="Basis-Layer">
          <v-map-layer-osm></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
    );
  },
  play: async ({ canvasElement }) => {
    const win = canvasElement.ownerDocument.defaultView!;
    const ce = win.customElements;

    log('Realm check – same window?', win === window); // Erwartet: false (Iframe)
    log('Vor define – registriert?', !!ce.get('v-map-layer-osm')); // Erwartet: true (wenn Loader lief)

    // 1) Sicherstellen, dass das CE registriert ist
    log('Before await customElements.whenDefined(v-map-layer-osm)');
    await customElements.whenDefined('v-map-layer-osm');
    log('After await customElements.whenDefined(v-map-layer-osm)');

    // 2) Element bekommen
    const layerOsm = canvasElement.querySelector('v-map-layer-osm') as any;
    if (!layerOsm) throw new Error('v-map-layer-osm nicht gefunden');

    // 3) Auf Stencil-Upgrade warten
    if (typeof layerOsm.componentOnReady === 'function') {
      await layerOsm.componentOnReady();
      log('v-map-layer-osm ist bereit!');
    } else {
      log('layerOsm.componentOnReady ist keine Funktion! - addEventListener');
      layerOsm.addEventListener(VMapEvents.Ready, () => {
        log('v-map-layer-osm ist bereit!');
      });
    }
  },
};
