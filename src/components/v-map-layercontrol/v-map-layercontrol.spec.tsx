import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerControl } from './v-map-layercontrol';

describe('v-map-layercontrol', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('renders an empty state when no layer groups are available', async () => {
    const page = await newSpecPage({
      components: [VMapLayerControl],
      html: `<v-map-layercontrol for="map-1"></v-map-layercontrol>`,
    });

    expect(page.root?.shadowRoot?.textContent).toContain('Keine Layer verfügbar');
  });

  it('reads layer groups and layers from the target map element', async () => {
    document.body.innerHTML = `
      <v-map id="map-1">
        <v-map-layergroup id="group-1" group-title="Base maps" basemapid="osm" visible>
          <v-map-layer-osm id="osm" label="OpenStreetMap" visible opacity="0.6" zindex="3"></v-map-layer-osm>
          <v-map-layer-geotiff id="dem" label="DEM" opacity="0.9" zindex="4"></v-map-layer-geotiff>
        </v-map-layergroup>
      </v-map>
    `;

    const component = new VMapLayerControl();
    component.for = 'map-1';

    (component as any).findMapElement();

    expect(component.layerGroups).toHaveLength(1);
    expect(component.layerGroups[0].groupTitle).toBe('Base maps');
    expect(component.layerGroups[0].layers.map(layer => layer.label)).toEqual([
      'OpenStreetMap',
      'DEM',
    ]);
    expect(component.layerGroups[0].layers[0].info.opacity).toBe(0.6);
    expect(component.layerGroups[0].layers[0].info.zIndex).toBe(3);
  });

  it('updates DOM attributes through the layer handlers', () => {
    const component = new VMapLayerControl();
    const layerEl = document.createElement('v-map-layer-osm');
    const info = {
      element: layerEl,
      id: 'osm',
      visible: true,
      opacity: 1,
      zIndex: 1,
    };
    component.layerGroups = [{ info, label: 'Base', groupTitle: 'Group', layers: [] }];

    (component as any).handleVisibilityChange(info, false);
    (component as any).handleOpacityChange(info, 0.4);
    (component as any).handleZIndexChange(info, 9);

    expect(layerEl.hasAttribute('visible')).toBe(false);
    expect(layerEl.getAttribute('opacity')).toBe('0.4');
    expect(layerEl.getAttribute('zindex')).toBe('9');
  });

  it('updates the base layer id on the group element', () => {
    const component = new VMapLayerControl();
    const groupEl = document.createElement('v-map-layergroup');
    const group = {
      info: {
        element: groupEl,
        id: 'group-1',
        visible: true,
        opacity: 1,
        zIndex: 0,
      },
      label: 'Group',
      groupTitle: 'Base maps',
      basemapid: 'osm',
      layers: [],
    };
    component.layerGroups = [group];

    (component as any).handleBaseLayerChange(group, 'dem');

    expect(group.basemapid).toBe('dem');
    expect(groupEl.getAttribute('basemapid')).toBe('dem');
  });

  it('retries map discovery when the target map is missing', () => {
    const component = new VMapLayerControl();
    component.for = 'missing-map';
    const timeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation(() => 1 as any);

    (component as any).findMapElement();

    expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);
  });
});
