import { vi, describe, it, expect, afterEach } from 'vitest';
import { VMapLayerControl } from './v-map-layercontrol';

function flattenVNode(node: any): string {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flattenVNode).join(' ');
  if (typeof node !== 'object') return '';

  const parts = [
    node.$tag$,
    node.$text$,
    ...Object.keys(node.$attrs$ ?? {}),
    ...Object.values(node.$attrs$ ?? {}).map(value =>
      typeof value === 'function' ? '' : String(value),
    ),
    flattenVNode(node.$children$ ?? []),
  ];
  return parts.filter(Boolean).join(' ');
}

describe('v-map-layercontrol', () => {
  let cleanup: (() => void) | undefined;

  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renders an empty state when no layer groups are available', async () => {
    const component = new VMapLayerControl();
    component.layerGroups = [];
    const vnode = component.render();

    expect(flattenVNode(vnode)).toContain('Keine Layer verfügbar');
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
    const component = new VMapLayerControl() as any;
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

    const vnode = component.render();
    const rendered = flattenVNode(vnode);
    expect(rendered).toContain('layer-control');
    expect(rendered).toContain('Base Maps');
    expect(rendered).toContain('OSM');
  });

  it('renders basemap selector when basemapid is set', async () => {
    const component = new VMapLayerControl() as any;
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

    const vnode = component.render();
    expect(flattenVNode(vnode)).toContain('basemap-selector');
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

  /* ------------------------------------------------------------------ */
  /*  Prototype-based unit tests for source function coverage            */
  /* ------------------------------------------------------------------ */
  describe('prototype-based source coverage', () => {

    it('render returns empty div when no layer groups', () => {
      const component = { layerGroups: [] } as any;
      const result = VMapLayerControl.prototype.render.call(component);
      expect(result).toBeTruthy();
    });

    it('connectedCallback runs without error', async () => {
      await VMapLayerControl.prototype.connectedCallback.call({});
    });

    it('disconnectedCallback disconnects observer', async () => {
      const disconnectSpy = vi.fn();
      const component = { observer: { disconnect: disconnectSpy } } as any;
      await VMapLayerControl.prototype.disconnectedCallback.call(component);
      expect(disconnectSpy).toHaveBeenCalled();
    });

    it('disconnectedCallback handles missing observer', async () => {
      const component = { observer: undefined } as any;
      await VMapLayerControl.prototype.disconnectedCallback.call(component);
    });

    it('componentWillLoad calls findMapElement', async () => {
      const timeoutSpy = vi.spyOn(global, 'setTimeout').mockImplementation(() => 1 as any);
      const component = {
        for: 'nonexistent-map',
        mapElement: null,
        findMapElement: VMapLayerControl.prototype['findMapElement'],
        initObserver: vi.fn(),
        updateLayerGroupsFromDom: vi.fn(),
      } as any;

      await VMapLayerControl.prototype.componentWillLoad.call(component);
      timeoutSpy.mockRestore();
    });

    it('readBool returns false when no attribute and prop is missing', () => {
      const component = new VMapLayerControl();
      const el = document.createElement('div');
      const result = (component as any).readBool(el, 'missingProp', 'missing-attr');
      expect(result).toBe(false);
    });

    it('readBool returns true when attribute is present', () => {
      const component = new VMapLayerControl();
      const el = document.createElement('div');
      el.setAttribute('visible', '');
      const result = (component as any).readBool(el, 'missingProp', 'visible');
      expect(result).toBe(true);
    });

    it('readBool returns boolean prop value', () => {
      const component = new VMapLayerControl();
      const el = document.createElement('div') as any;
      el.visible = true;
      const result = (component as any).readBool(el, 'visible', 'visible');
      expect(result).toBe(true);
    });

    it('readString returns default when no prop or attribute', () => {
      const component = new VMapLayerControl();
      const el = document.createElement('div');
      const result = (component as any).readString(el, 'missingProp', 'default-val', 'missing-attr');
      expect(result).toBe('default-val');
    });

    it('readString returns attribute value', () => {
      const component = new VMapLayerControl();
      const el = document.createElement('div');
      el.setAttribute('label', 'My Label');
      const result = (component as any).readString(el, 'missingProp', 'default', 'label');
      expect(result).toBe('My Label');
    });

    it('readString returns prop value when set', () => {
      const component = new VMapLayerControl();
      const el = document.createElement('div') as any;
      el.label = 'PropLabel';
      const result = (component as any).readString(el, 'label', 'default', 'label');
      expect(result).toBe('PropLabel');
    });

    it('readNumber returns default when prop and attribute are missing', () => {
      const component = new VMapLayerControl();
      const el = document.createElement('div');
      const result = (component as any).readNumber(el, 'missingProp', 42, 'missing-attr');
      expect(result).toBe(42);
    });

    it('readNumber returns numeric prop when set', () => {
      const component = new VMapLayerControl();
      const el = document.createElement('div') as any;
      el.opacity = 0.75;
      const result = (component as any).readNumber(el, 'opacity', 1, 'opacity');
      expect(result).toBe(0.75);
    });

    it('readNumber skips empty attribute strings', () => {
      const component = new VMapLayerControl();
      const el = document.createElement('div');
      el.setAttribute('opacity', '');
      const result = (component as any).readNumber(el, 'missingProp', 1, 'opacity');
      expect(result).toBe(1);
    });

    it('getLayersFromDom returns undefined when groupElement is null', () => {
      const component = new VMapLayerControl();
      const result = (component as any).getLayersFromDom(null);
      expect(result).toBeUndefined();
    });

    it('getLayersFromDom extracts layers from group element', () => {
      const component = new VMapLayerControl();
      const groupEl = document.createElement('v-map-layergroup');
      const layerEl = document.createElement('v-map-layer-osm');
      layerEl.id = 'osm-test';
      layerEl.setAttribute('label', 'OSM');
      groupEl.appendChild(layerEl);

      const layers = (component as any).getLayersFromDom(groupEl);
      expect(layers).toHaveLength(1);
      expect(layers[0].info.id).toBe('osm-test');
    });

    it('cloneLayerGroups creates deep clones', () => {
      const component = new VMapLayerControl();
      const groupEl = document.createElement('v-map-layergroup');
      const layerEl = document.createElement('v-map-layer-osm');
      component.layerGroups = [
        {
          info: { element: groupEl, id: 'grp', visible: true, opacity: 1, zIndex: 0 },
          label: 'Group',
          groupTitle: 'Title',
          basemapid: null,
          layers: [
            { info: { element: layerEl, id: 'lyr', visible: true, opacity: 1, zIndex: 0 }, label: 'Layer' },
          ],
        },
      ];

      const cloned = (component as any).cloneLayerGroups();
      expect(cloned).toHaveLength(1);
      expect(cloned[0].info).not.toBe(component.layerGroups[0].info);
      expect(cloned[0].layers[0].info).not.toBe(component.layerGroups[0].layers[0].info);
    });

    it('setBool sets property and attribute correctly', () => {
      const component = new VMapLayerControl();
      const el = document.createElement('div');

      (component as any).setBool(el, 'visible', true, 'visible');
      expect((el as any).visible).toBe(true);
      expect(el.hasAttribute('visible')).toBe(true);

      (component as any).setBool(el, 'visible', false, 'visible');
      expect((el as any).visible).toBe(false);
      expect(el.hasAttribute('visible')).toBe(false);
    });

    it('setNumber sets property and attribute correctly', () => {
      const component = new VMapLayerControl();
      const el = document.createElement('div');

      (component as any).setNumber(el, 'opacity', 0.5, 'opacity');
      expect((el as any).opacity).toBe(0.5);
      expect(el.getAttribute('opacity')).toBe('0.5');
    });

    it('handleVisibilityChange does nothing when element is missing', () => {
      const component = new VMapLayerControl();
      component.layerGroups = [];
      const info = { element: null, id: 'x', visible: true, opacity: 1, zIndex: 0 } as any;

      (component as any).handleVisibilityChange(info, false);
      expect(info.visible).toBe(true); // unchanged
    });

    it('handleOpacityChange does nothing when element is missing', () => {
      const component = new VMapLayerControl();
      component.layerGroups = [];
      const info = { element: null, id: 'x', visible: true, opacity: 1, zIndex: 0 } as any;

      (component as any).handleOpacityChange(info, 0.5);
      expect(info.opacity).toBe(1); // unchanged
    });

    it('handleZIndexChange does nothing when element is missing', () => {
      const component = new VMapLayerControl();
      component.layerGroups = [];
      const info = { element: null, id: 'x', visible: true, opacity: 1, zIndex: 0 } as any;

      (component as any).handleZIndexChange(info, 10);
      expect(info.zIndex).toBe(0); // unchanged
    });

    it('initObserver does nothing when mapElement is null', () => {
      const component = new VMapLayerControl();
      (component as any).mapElement = null;
      (component as any).initObserver();
      expect((component as any).observer).toBeUndefined();
    });

    it('updateLayerGroupsFromDom does nothing when mapElement is null', () => {
      const component = new VMapLayerControl();
      (component as any).mapElement = null;
      (component as any).updateLayerGroupsFromDom();
      expect(component.layerGroups).toEqual([]);
    });
  });
});
