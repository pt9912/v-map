import { vi, describe, it, expect, afterEach } from 'vitest';
import { render, h } from '@stencil/vitest';
import { forceUpdate } from '@stencil/core';
import { VMapLayerControl } from './v-map-layercontrol';

describe('v-map-layercontrol', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renders an empty state when no layer groups are available', async () => {
    const { root } = await render(
      h('v-map-layercontrol', { for: 'map-1' }),
    );

    expect(root?.shadowRoot?.textContent).toContain('Keine Layer verfügbar');
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
    const timeoutSpy = vi.spyOn(global, 'setTimeout').mockImplementation(() => 1 as any);

    (component as any).findMapElement();

    expect(timeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);
    timeoutSpy.mockRestore();
  });

  it('readNumber falls back to default when attribute value is NaN', () => {
    const component = new VMapLayerControl();
    const el = document.createElement('div');
    el.setAttribute('opacity', 'not-a-number');

    const result = (component as any).readNumber(el, 'missingProp', 0.5, 'opacity');
    expect(result).toBe(0.5);
  });

  it('readNumber returns value from second attribute when first is missing', () => {
    const component = new VMapLayerControl();
    const el = document.createElement('div');
    el.setAttribute('z-index', '7');

    const result = (component as any).readNumber(el, 'missingProp', 0, 'missing-attr', 'z-index');
    expect(result).toBe(7);
  });

  it('auto-generates group IDs for groups without an id', () => {
    document.body.innerHTML = `
      <v-map id="map-auto">
        <v-map-layergroup group-title="Auto Group" visible>
          <v-map-layer-osm label="OSM" visible></v-map-layer-osm>
        </v-map-layergroup>
      </v-map>
    `;

    const component = new VMapLayerControl();
    component.for = 'map-auto';
    (component as any).findMapElement();

    expect(component.layerGroups).toHaveLength(1);
    expect(component.layerGroups[0].info.id).toMatch(/^auto-/);

    document.body.innerHTML = '';
  });

  it('auto-generates layer IDs for layers without an id', () => {
    document.body.innerHTML = `
      <v-map id="map-auto-layers">
        <v-map-layergroup id="grp-1" group-title="Group" visible>
          <v-map-layer-wms label="WMS"></v-map-layer-wms>
        </v-map-layergroup>
      </v-map>
    `;

    const component = new VMapLayerControl();
    component.for = 'map-auto-layers';
    (component as any).findMapElement();

    expect(component.layerGroups[0].layers[0].info.id).toMatch(/^auto-/);

    document.body.innerHTML = '';
  });

  it('renders layer groups with checkboxes and controls', async () => {
    const { root, instance, waitForChanges } = await render(
      h('v-map-layercontrol', { for: 'map-render' }),
    );

    const component = (instance ?? root) as any;
    const groupEl = document.createElement('v-map-layergroup');
    const layerEl = document.createElement('v-map-layer-osm');
    layerEl.id = 'osm-1';
    Object.defineProperty(layerEl, 'label', { value: 'OSM', writable: true, configurable: true });
    Object.defineProperty(layerEl, 'visible', { value: true, writable: true, configurable: true });
    Object.defineProperty(layerEl, 'opacity', { value: 0.8, writable: true, configurable: true });

    component.layerGroups = [
      {
        info: {
          element: groupEl,
          id: 'grp-1',
          visible: true,
          opacity: undefined,
          zIndex: undefined,
        },
        label: 'Base',
        groupTitle: 'Base Maps',
        basemapid: null,
        layers: [
          {
            info: {
              element: layerEl,
              id: 'osm-1',
              visible: true,
              opacity: 0.8,
              zIndex: 0,
            },
            label: 'OSM',
          },
        ],
      },
    ];

    forceUpdate(root);
    await waitForChanges();

    const shadow = root?.shadowRoot;
    expect(shadow?.querySelector('.layer-control')).not.toBeNull();
    expect(shadow?.querySelector('.layer-group-title')?.textContent).toBe('Base Maps');
    expect(shadow?.querySelector('.layer-item-title')?.textContent).toBe('OSM');
  });

  it('renders basemap selector when basemapid is set', async () => {
    const { root, instance, waitForChanges } = await render(
      h('v-map-layercontrol', { for: 'map-basemap' }),
    );

    const component = (instance ?? root) as any;
    const groupEl = document.createElement('v-map-layergroup');
    const layerEl = document.createElement('v-map-layer-osm');
    layerEl.id = 'osm-1';

    component.layerGroups = [
      {
        info: {
          element: groupEl,
          id: 'grp-1',
          visible: true,
          opacity: undefined,
          zIndex: undefined,
        },
        label: 'Base',
        groupTitle: 'Base Maps',
        basemapid: 'osm-1',
        layers: [
          {
            info: {
              element: layerEl,
              id: 'osm-1',
              visible: true,
              opacity: 1,
              zIndex: 0,
            },
            label: 'OSM',
          },
        ],
      },
    ];

    forceUpdate(root);
    await waitForChanges();

    const shadow = root?.shadowRoot;
    expect(shadow?.querySelector('.basemap-selector')).not.toBeNull();
  });

  it('triggers group visibility change via rendered checkbox', async () => {
    const { root, instance, waitForChanges } = await render(
      h('v-map-layercontrol', { for: 'map-events' }),
    );

    const component = (instance ?? root) as any;
    const groupEl = document.createElement('v-map-layergroup');
    const layerEl = document.createElement('v-map-layer-osm');
    layerEl.id = 'osm-1';

    component.layerGroups = [
      {
        info: { element: groupEl, id: 'grp-1', visible: true, opacity: undefined, zIndex: undefined },
        label: 'Base', groupTitle: 'Base Maps', basemapid: null,
        layers: [
          { info: { element: layerEl, id: 'osm-1', visible: true, opacity: 1, zIndex: 0 }, label: 'OSM' },
        ],
      },
    ];
    forceUpdate(root);
    await waitForChanges();

    const shadow = root?.shadowRoot;
    const groupCheckbox = shadow?.querySelector('.layer-group-checkbox') as HTMLInputElement;
    expect(groupCheckbox).not.toBeNull();

    // Simulate unchecking the group
    groupCheckbox.checked = false;
    groupCheckbox.dispatchEvent(new Event('change'));

    expect(component.layerGroups[0].info.visible).toBe(false);
  });

  it('triggers layer opacity change via rendered slider', async () => {
    const { root, instance, waitForChanges } = await render(
      h('v-map-layercontrol', { for: 'map-opacity' }),
    );

    const component = (instance ?? root) as any;
    const groupEl = document.createElement('v-map-layergroup');
    const layerEl = document.createElement('v-map-layer-osm');
    layerEl.id = 'lyr-1';

    component.layerGroups = [
      {
        info: { element: groupEl, id: 'grp-1', visible: true, opacity: undefined, zIndex: undefined },
        label: 'Base', groupTitle: 'Base Maps', basemapid: null,
        layers: [
          { info: { element: layerEl, id: 'lyr-1', visible: true, opacity: 1, zIndex: 0 }, label: 'Layer' },
        ],
      },
    ];
    forceUpdate(root);
    await waitForChanges();

    const shadow = root?.shadowRoot;
    const slider = shadow?.querySelector('.layer-item-opacity') as HTMLInputElement;
    expect(slider).not.toBeNull();

    slider.value = '0.5';
    slider.dispatchEvent(new Event('input'));

    expect(layerEl.getAttribute('opacity')).toBe('0.5');
  });

  it('triggers layer z-index change via rendered number input', async () => {
    const { root, instance, waitForChanges } = await render(
      h('v-map-layercontrol', { for: 'map-zindex' }),
    );

    const component = (instance ?? root) as any;
    const groupEl = document.createElement('v-map-layergroup');
    const layerEl = document.createElement('v-map-layer-osm');
    layerEl.id = 'lyr-z';

    component.layerGroups = [
      {
        info: { element: groupEl, id: 'grp-1', visible: true, opacity: undefined, zIndex: undefined },
        label: 'Base', groupTitle: 'Base Maps', basemapid: null,
        layers: [
          { info: { element: layerEl, id: 'lyr-z', visible: true, opacity: 1, zIndex: 0 }, label: 'Layer' },
        ],
      },
    ];
    forceUpdate(root);
    await waitForChanges();

    const shadow = root?.shadowRoot;
    const zInput = shadow?.querySelector('.layer-item-zindex') as HTMLInputElement;
    expect(zInput).not.toBeNull();

    zInput.value = '5';
    zInput.dispatchEvent(new Event('change'));

    expect(layerEl.getAttribute('zindex')).toBe('5');
  });

  it('triggers basemap selector change via rendered select', async () => {
    const { root, instance, waitForChanges } = await render(
      h('v-map-layercontrol', { for: 'map-base' }),
    );

    const component = (instance ?? root) as any;
    const groupEl = document.createElement('v-map-layergroup');
    const layerEl1 = document.createElement('v-map-layer-osm');
    layerEl1.id = 'osm-1';
    const layerEl2 = document.createElement('v-map-layer-wms');
    layerEl2.id = 'wms-1';

    component.layerGroups = [
      {
        info: { element: groupEl, id: 'grp-1', visible: true, opacity: undefined, zIndex: undefined },
        label: 'Base', groupTitle: 'Base Maps', basemapid: 'osm-1',
        layers: [
          { info: { element: layerEl1, id: 'osm-1', visible: true, opacity: 1, zIndex: 0 }, label: 'OSM' },
          { info: { element: layerEl2, id: 'wms-1', visible: true, opacity: 1, zIndex: 0 }, label: 'WMS' },
        ],
      },
    ];
    forceUpdate(root);
    await waitForChanges();

    const shadow = root?.shadowRoot;
    const select = shadow?.querySelector('.basemap-selector') as HTMLSelectElement;
    expect(select).not.toBeNull();

    // Simulate selecting the second layer
    select.value = 'wms-1';
    select.dispatchEvent(new Event('change'));

    expect(component.layerGroups[0].basemapid).toBe('wms-1');
    expect(groupEl.getAttribute('basemapid')).toBe('wms-1');
  });

  it('triggers layer checkbox visibility change via rendered checkbox', async () => {
    const { root, instance, waitForChanges } = await render(
      h('v-map-layercontrol', { for: 'map-lyr-vis' }),
    );

    const component = (instance ?? root) as any;
    const groupEl = document.createElement('v-map-layergroup');
    const layerEl = document.createElement('v-map-layer-osm');
    layerEl.id = 'lyr-vis';

    component.layerGroups = [
      {
        info: { element: groupEl, id: 'grp-1', visible: true, opacity: undefined, zIndex: undefined },
        label: 'Base', groupTitle: 'Base Maps', basemapid: null,
        layers: [
          { info: { element: layerEl, id: 'lyr-vis', visible: true, opacity: 1, zIndex: 0 }, label: 'Layer' },
        ],
      },
    ];
    forceUpdate(root);
    await waitForChanges();

    const shadow = root?.shadowRoot;
    const layerCheckbox = shadow?.querySelector('.layer-item-checkbox') as HTMLInputElement;
    expect(layerCheckbox).not.toBeNull();

    layerCheckbox.checked = false;
    layerCheckbox.dispatchEvent(new Event('change'));

    expect(layerEl.hasAttribute('visible')).toBe(false);
  });

  it('initObserver sets up mutation observer on mapElement', () => {
    const component = new VMapLayerControl();
    const mockObserve = vi.fn();
    const mockDisconnect = vi.fn();

    const OriginalMutationObserver = global.MutationObserver;
    global.MutationObserver = class {
      observe = mockObserve;
      disconnect = mockDisconnect;
      takeRecords = vi.fn().mockReturnValue([]);
      constructor(_cb: MutationCallback) {}
    } as any;

    const mapEl = document.createElement('v-map');
    (component as any).mapElement = mapEl;

    (component as any).initObserver();

    expect(mockObserve).toHaveBeenCalledWith(mapEl, expect.objectContaining({
      childList: true,
      subtree: true,
      attributes: true,
    }));

    global.MutationObserver = OriginalMutationObserver;
  });
});
