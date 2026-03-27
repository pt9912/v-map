const helperMock = {
  initLayer: jest.fn(),
  removeLayer: jest.fn(),
  updateLayer: jest.fn(),
  setVisible: jest.fn(),
  setOpacity: jest.fn(),
  setZIndex: jest.fn(),
  getLayerId: jest.fn().mockReturnValue('geojson-layer-id'),
};

jest.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: jest.fn().mockImplementation(() => helperMock),
}));

import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerGeoJSON } from './v-map-layer-geojson';

describe('v-map-layer-geojson', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as jest.Mock).mockClear();
      }
    });
  });

  it('renders with url attribute', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGeoJSON],
      html: `<v-map-layer-geojson url="https://example.com/data.geojson"></v-map-layer-geojson>`,
    });

    expect(page.root).toBeTruthy();
    expect(page.root?.getAttribute('url')).toBe('https://example.com/data.geojson');
  });

  it('returns the layerId', async () => {
    const component = { layerId: 'my-layer' } as any;
    const result = await VMapLayerGeoJSON.prototype.getLayerId.call(component);
    expect(result).toBe('my-layer');
  });

  it('isReady reflects didLoad state', () => {
    expect(VMapLayerGeoJSON.prototype.isReady.call({ didLoad: false })).toBe(false);
    expect(VMapLayerGeoJSON.prototype.isReady.call({ didLoad: true })).toBe(true);
  });

  it('updates layer when geojson string changes', async () => {
    await VMapLayerGeoJSON.prototype.onGeoJsonChanged.call(
      { geojson: '{"type":"Point"}', helper: helperMock },
      '{"type":"OldPoint"}',
      '{"type":"Point"}',
    );

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'geojson',
      data: { geojson: '{"type":"Point"}' },
    });
  });

  it('updates layer when geojson is an object', async () => {
    const geojsonObj = { type: 'Feature', geometry: { type: 'Point', coordinates: [0, 0] } };
    await VMapLayerGeoJSON.prototype.onGeoJsonChanged.call(
      { geojson: geojsonObj, helper: helperMock },
      'old',
      'new',
    );

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'geojson',
      data: { geojson: JSON.stringify(geojsonObj) },
    });
  });

  it('does not update when geojson value is identical', async () => {
    await VMapLayerGeoJSON.prototype.onGeoJsonChanged.call(
      { geojson: 'same', helper: helperMock },
      'same',
      'same',
    );

    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('updates layer when url changes', async () => {
    await VMapLayerGeoJSON.prototype.onUrlChanged.call(
      { url: 'https://new.com/data.json', helper: helperMock },
      'https://old.com/data.json',
      'https://new.com/data.json',
    );

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'geojson',
      data: { url: 'https://new.com/data.json' },
    });
  });

  it('does not update when url value is identical', async () => {
    await VMapLayerGeoJSON.prototype.onUrlChanged.call(
      { url: 'https://same.com', helper: helperMock },
      'https://same.com',
      'https://same.com',
    );

    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('updates helper methods through watchers', async () => {
    await VMapLayerGeoJSON.prototype.onVisibleChanged.call({
      visible: false,
      helper: helperMock,
    });
    await VMapLayerGeoJSON.prototype.onOpacityChanged.call({
      opacity: 0.3,
      helper: helperMock,
    });
    await VMapLayerGeoJSON.prototype.onZIndexChanged.call({
      zIndex: 42,
      helper: helperMock,
    });

    expect(helperMock.setVisible).toHaveBeenCalledWith(false);
    expect(helperMock.setOpacity).toHaveBeenCalledWith(0.3);
    expect(helperMock.setZIndex).toHaveBeenCalledWith(42);
  });

  it('triggers layer update on style property change', async () => {
    await VMapLayerGeoJSON.prototype.onStyleChanged.call({
      geojson: '{"type":"Point"}',
      url: null,
      helper: helperMock,
    });

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'geojson',
      data: { geojson: '{"type":"Point"}', url: null },
    });
  });

  it('creates layer config with styling properties', () => {
    const component = {
      geojson: '{"type":"FeatureCollection","features":[]}',
      url: null,
      visible: true,
      opacity: 0.9,
      zIndex: 500,
      fillColor: '#ff0000',
      fillOpacity: 0.4,
      strokeColor: '#0000ff',
      strokeWidth: 2,
      strokeOpacity: 1,
      pointRadius: 8,
      pointColor: '#00ff00',
      iconUrl: 'marker.png',
      iconSize: '32,32',
      textProperty: 'label',
      textColor: '#000',
      textSize: 16,
      appliedGeostylerStyle: undefined,
    } as any;

    const config = VMapLayerGeoJSON.prototype['createLayerConfig'].call(component);

    expect(config).toEqual({
      type: 'geojson',
      opacity: 0.9,
      visible: true,
      zIndex: 500,
      url: null,
      geojson: '{"type":"FeatureCollection","features":[]}',
      style: {
        fillColor: '#ff0000',
        fillOpacity: 0.4,
        strokeColor: '#0000ff',
        strokeWidth: 2,
        strokeOpacity: 1,
        pointRadius: 8,
        pointColor: '#00ff00',
        iconUrl: 'marker.png',
        iconSize: [32, 32],
        textProperty: 'label',
        textColor: '#000',
        textSize: 16,
      },
    });
  });

  it('creates layer config with geojson object stringified', () => {
    const geojsonObj = { type: 'Point', coordinates: [0, 0] };
    const component = {
      geojson: geojsonObj,
      url: null,
      visible: true,
      opacity: 1,
      zIndex: 1000,
      iconSize: undefined,
      appliedGeostylerStyle: undefined,
    } as any;

    const config = VMapLayerGeoJSON.prototype['createLayerConfig'].call(component);
    expect(config.geojson).toBe(JSON.stringify(geojsonObj));
  });

  it('creates layer config with null geojson when not set', () => {
    const component = {
      geojson: undefined,
      url: 'https://example.com/data.json',
      visible: true,
      opacity: 1,
      zIndex: 1000,
      iconSize: undefined,
      appliedGeostylerStyle: undefined,
    } as any;

    const config = VMapLayerGeoJSON.prototype['createLayerConfig'].call(component);
    expect(config.geojson).toBeNull();
  });

  it('includes geostyler style in layer config when applied', () => {
    const geostylerStyle = { name: 'test', rules: [] };
    const component = {
      geojson: undefined,
      url: null,
      visible: true,
      opacity: 1,
      zIndex: 1000,
      iconSize: undefined,
      appliedGeostylerStyle: geostylerStyle,
    } as any;

    const config = VMapLayerGeoJSON.prototype['createLayerConfig'].call(component);
    expect(config.geostylerStyle).toEqual(geostylerStyle);
  });

  it('applies geostyler style from styleReady event when targeted', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-geojson'),
      geojson: '{}',
      url: null,
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerGeoJSON.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerGeoJSON.prototype['updateLayerWithGeostylerStyle'],
    } as any;
    component.el.id = 'geo1';

    const geostylerStyle = { name: 'Style', rules: [{ name: 'r', symbolizers: [] }] };
    await VMapLayerGeoJSON.prototype.onStyleReady.call(component, {
      detail: { style: geostylerStyle, layerIds: ['geo1'] },
    } as CustomEvent<any>);

    expect(component.appliedGeostylerStyle).toEqual(geostylerStyle);
    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'geojson',
      data: { geojson: '{}', url: null, geostylerStyle },
    });
  });

  it('ignores styleReady event when not targeted', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-geojson'),
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerGeoJSON.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerGeoJSON.prototype['updateLayerWithGeostylerStyle'],
    } as any;
    component.el.id = 'geo1';

    await VMapLayerGeoJSON.prototype.onStyleReady.call(component, {
      detail: { style: { name: 'S', rules: [] }, layerIds: ['other'] },
    } as CustomEvent<any>);

    expect(component.appliedGeostylerStyle).toBeUndefined();
  });

  it('ignores non-geostyler styles in styleReady event', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-geojson'),
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerGeoJSON.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerGeoJSON.prototype['updateLayerWithGeostylerStyle'],
    } as any;
    component.el.id = 'geo1';

    await VMapLayerGeoJSON.prototype.onStyleReady.call(component, {
      detail: { style: { color: 'red' }, layerIds: ['geo1'] },
    } as CustomEvent<any>);

    expect(component.appliedGeostylerStyle).toBeUndefined();
  });

  it('isTargetedByStyle returns false for undefined layerIds', () => {
    const component = { el: document.createElement('div') } as any;
    expect(VMapLayerGeoJSON.prototype['isTargetedByStyle'].call(component, undefined)).toBe(false);
  });

  it('isTargetedByStyle returns true for empty layerIds', () => {
    const component = { el: document.createElement('div') } as any;
    component.el.id = 'test';
    expect(VMapLayerGeoJSON.prototype['isTargetedByStyle'].call(component, [])).toBe(true);
  });

  it('updateLayerWithGeostylerStyle does nothing without style or helper', async () => {
    await VMapLayerGeoJSON.prototype['updateLayerWithGeostylerStyle'].call({
      appliedGeostylerStyle: undefined,
      helper: helperMock,
    });
    await VMapLayerGeoJSON.prototype['updateLayerWithGeostylerStyle'].call({
      appliedGeostylerStyle: { name: 'x', rules: [] },
      helper: undefined,
    });

    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('calls removeLayer and cleans up on disconnect', async () => {
    const mo = { disconnect: jest.fn() };
    const geoSlot = { removeEventListener: jest.fn() };
    const component = {
      helper: helperMock,
      mo,
      geoSlot,
      onSlotChange: jest.fn(),
    } as any;

    await VMapLayerGeoJSON.prototype.disconnectedCallback.call(component);

    expect(mo.disconnect).toHaveBeenCalled();
    expect(geoSlot.removeEventListener).toHaveBeenCalledWith('slotchange', component.onSlotChange);
    expect(helperMock.removeLayer).toHaveBeenCalled();
  });

  it('handles watcher calls gracefully when helper is undefined', async () => {
    await VMapLayerGeoJSON.prototype.onVisibleChanged.call({
      visible: false,
      helper: undefined,
    });
    await VMapLayerGeoJSON.prototype.onOpacityChanged.call({
      opacity: 0.5,
      helper: undefined,
    });
    await VMapLayerGeoJSON.prototype.onZIndexChanged.call({
      zIndex: 10,
      helper: undefined,
    });

    expect(helperMock.setVisible).not.toHaveBeenCalled();
  });
});
