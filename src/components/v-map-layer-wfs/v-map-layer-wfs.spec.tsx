import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, h } from '@stencil/vitest';

const { helperMock } = vi.hoisted(() => {
  const helperMock = {
    initLayer: vi.fn(),
    removeLayer: vi.fn(),
    updateLayer: vi.fn(),
    setVisible: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn(),
  };
  return { helperMock };
});

vi.mock('../../layer/v-map-layer-helper', () => ({
  VMapLayerHelper: vi.fn().mockImplementation(() => helperMock),
}));

import { VMapLayerWfs } from './v-map-layer-wfs';

describe('<v-map-layer-wfs>', () => {
  beforeEach(() => {
    Object.values(helperMock).forEach(value => {
      if (typeof value === 'function' && 'mockClear' in value) {
        (value as ReturnType<typeof vi.fn>).mockClear();
      }
    });
  });

  it('renders with required attributes', async () => {
    const { root } = await render(
      h('v-map-layer-wfs', { url: 'https://example.com/wfs', 'type-name': 'namespace:layer' }),
    );

    expect(root?.getAttribute('type-name')).toBe('namespace:layer');
    expect(root?.getAttribute('url')).toBe('https://example.com/wfs');
    expect(root?.getAttribute('version')).toBe('1.1.0');
    expect(root?.getAttribute('output-format')).toBe('application/json');
    expect(root?.getAttribute('srs-name')).toBe('EPSG:3857');
    expect(root?.classList.contains('hydrated')).toBe(true);
  });

  it('initializes layer and sets didLoad on componentDidLoad', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-wfs'),
      didLoad: false,
      createLayerConfig: VMapLayerWfs.prototype['createLayerConfig'],
      applyExistingStyles: vi.fn(),
      url: 'https://example.com/wfs',
      typeName: 'ns:layer',
      version: '1.1.0',
      outputFormat: 'application/json',
      srsName: 'EPSG:3857',
      params: undefined,
      visible: true,
      opacity: 1,
      zIndex: 1000,
      appliedGeostylerStyle: undefined,
    } as any;
    component.el.id = 'wfs1';

    await VMapLayerWfs.prototype.componentDidLoad.call(component);

    expect(helperMock.initLayer).toHaveBeenCalledWith(expect.any(Function), 'wfs1');
    expect(component.didLoad).toBe(true);
  });

  it('isReady returns didLoad state', async () => {
    expect(await VMapLayerWfs.prototype.isReady.call({ didLoad: false })).toBe(false);
    expect(await VMapLayerWfs.prototype.isReady.call({ didLoad: true })).toBe(true);
  });

  it('skips watcher calls before didLoad', async () => {
    const ctx = { didLoad: false, helper: helperMock, visible: false, opacity: 0.5, zIndex: 5 };
    await VMapLayerWfs.prototype.onVisibleChanged.call(ctx);
    await VMapLayerWfs.prototype.onOpacityChanged.call(ctx);
    await VMapLayerWfs.prototype.onZIndexChanged.call(ctx);
    await VMapLayerWfs.prototype.onSourceChanged.call(ctx);

    expect(helperMock.setVisible).not.toHaveBeenCalled();
    expect(helperMock.setOpacity).not.toHaveBeenCalled();
    expect(helperMock.setZIndex).not.toHaveBeenCalled();
    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });

  it('updates helper via watchers after didLoad', async () => {
    await VMapLayerWfs.prototype.onVisibleChanged.call({
      didLoad: true, visible: false, helper: helperMock,
    });
    await VMapLayerWfs.prototype.onOpacityChanged.call({
      didLoad: true, opacity: 0.4, helper: helperMock,
    });
    await VMapLayerWfs.prototype.onZIndexChanged.call({
      didLoad: true, zIndex: 77, helper: helperMock,
    });

    expect(helperMock.setVisible).toHaveBeenCalledWith(false);
    expect(helperMock.setOpacity).toHaveBeenCalledWith(0.4);
    expect(helperMock.setZIndex).toHaveBeenCalledWith(77);
  });

  it('updates layer on source property change after didLoad', async () => {
    const component = {
      didLoad: true,
      helper: helperMock,
      url: 'https://new.com/wfs',
      typeName: 'ns:new',
      version: '2.0.0',
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
      params: undefined,
      visible: true,
      opacity: 1,
      zIndex: 1000,
      appliedGeostylerStyle: undefined,
      createLayerConfig: VMapLayerWfs.prototype['createLayerConfig'],
      parseParams: VMapLayerWfs.prototype['parseParams'],
    } as any;

    await VMapLayerWfs.prototype.onSourceChanged.call(component);

    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'wfs',
      data: expect.objectContaining({
        type: 'wfs',
        url: 'https://new.com/wfs',
        typeName: 'ns:new',
        version: '2.0.0',
      }),
    });
  });

  it('parseParams returns parsed JSON object', () => {
    const component = { params: '{"cql_filter":"status=1"}' } as any;
    const result = VMapLayerWfs.prototype['parseParams'].call(component);
    expect(result).toEqual({ cql_filter: 'status=1' });
  });

  it('parseParams returns undefined for invalid JSON', () => {
    const component = { params: '{invalid' } as any;
    const result = VMapLayerWfs.prototype['parseParams'].call(component);
    expect(result).toBeUndefined();
  });

  it('parseParams returns undefined when params is not set', () => {
    const component = { params: undefined } as any;
    const result = VMapLayerWfs.prototype['parseParams'].call(component);
    expect(result).toBeUndefined();
  });

  it('parseParams returns undefined for non-object JSON', () => {
    const component = { params: '"just-a-string"' } as any;
    const result = VMapLayerWfs.prototype['parseParams'].call(component);
    expect(result).toBeUndefined();
  });

  it('creates layer config with all properties', () => {
    const component = {
      url: 'https://example.com/wfs',
      typeName: 'ns:layer',
      version: '2.0.0',
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
      params: '{"maxFeatures":"100"}',
      visible: true,
      opacity: 0.8,
      zIndex: 500,
      appliedGeostylerStyle: undefined,
      parseParams: VMapLayerWfs.prototype['parseParams'],
    } as any;

    const config = VMapLayerWfs.prototype['createLayerConfig'].call(component);

    expect(config).toEqual({
      type: 'wfs',
      url: 'https://example.com/wfs',
      typeName: 'ns:layer',
      version: '2.0.0',
      outputFormat: 'application/json',
      srsName: 'EPSG:4326',
      params: { maxFeatures: '100' },
      visible: true,
      opacity: 0.8,
      zIndex: 500,
    });
  });

  it('includes geostyler style in layer config when applied', () => {
    const geostylerStyle = { name: 'test', rules: [] };
    const component = {
      url: 'https://example.com/wfs',
      typeName: 'ns:layer',
      version: '1.1.0',
      outputFormat: 'application/json',
      srsName: 'EPSG:3857',
      params: undefined,
      visible: true,
      opacity: 1,
      zIndex: 1000,
      appliedGeostylerStyle: geostylerStyle,
      parseParams: VMapLayerWfs.prototype['parseParams'],
    } as any;

    const config = VMapLayerWfs.prototype['createLayerConfig'].call(component);
    expect(config.geostylerStyle).toEqual(geostylerStyle);
  });

  it('removes layer on disconnect', async () => {
    await VMapLayerWfs.prototype.disconnectedCallback.call({ helper: helperMock });
    expect(helperMock.removeLayer).toHaveBeenCalledTimes(1);
  });

  it('applies geostyler style from styleReady event when targeted', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-wfs'),
      url: 'https://example.com/wfs',
      typeName: 'ns:layer',
      version: '1.1.0',
      outputFormat: 'application/json',
      srsName: 'EPSG:3857',
      params: undefined,
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerWfs.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerWfs.prototype['updateLayerWithGeostylerStyle'],
      parseParams: VMapLayerWfs.prototype['parseParams'],
    } as any;
    component.el.id = 'wfs1';

    const geostylerStyle = { name: 'Style', rules: [{ name: 'r', symbolizers: [] }] };
    await VMapLayerWfs.prototype.onStyleReady.call(component, {
      detail: { style: geostylerStyle, layerIds: ['wfs1'] },
    } as CustomEvent<any>);

    expect(component.appliedGeostylerStyle).toEqual(geostylerStyle);
    expect(helperMock.updateLayer).toHaveBeenCalledWith({
      type: 'wfs',
      data: expect.objectContaining({ geostylerStyle }),
    });
  });

  it('ignores styleReady event when not targeted', async () => {
    const component = {
      helper: helperMock,
      el: document.createElement('v-map-layer-wfs'),
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerWfs.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerWfs.prototype['updateLayerWithGeostylerStyle'],
    } as any;
    component.el.id = 'wfs1';

    await VMapLayerWfs.prototype.onStyleReady.call(component, {
      detail: { style: { name: 'S', rules: [] }, layerIds: ['other'] },
    } as CustomEvent<any>);

    expect(component.appliedGeostylerStyle).toBeUndefined();
  });

  it('isTargetedByStyle returns false for undefined layerIds', () => {
    const component = { el: document.createElement('div') } as any;
    expect(VMapLayerWfs.prototype['isTargetedByStyle'].call(component, undefined)).toBe(false);
  });

  it('isTargetedByStyle returns true for empty layerIds array', () => {
    const component = { el: document.createElement('div') } as any;
    expect(VMapLayerWfs.prototype['isTargetedByStyle'].call(component, [])).toBe(true);
  });

  it('applyExistingStyles applies geostyler styles from v-map-style elements', async () => {
    const geostylerStyle = { name: 'test', rules: [{ name: 'r', symbolizers: [] }] };
    const styleEl = document.createElement('v-map-style');
    Object.defineProperty(styleEl, 'getStyle', { value: vi.fn().mockResolvedValue(geostylerStyle), writable: true, configurable: true });
    Object.defineProperty(styleEl, 'getLayerTargetIds', { value: vi.fn().mockResolvedValue(['wfs1']), writable: true, configurable: true });
    document.body.appendChild(styleEl);

    const component = {
      el: document.createElement('v-map-layer-wfs'),
      helper: helperMock,
      url: 'https://example.com/wfs',
      typeName: 'ns:layer',
      version: '1.1.0',
      outputFormat: 'application/json',
      srsName: 'EPSG:3857',
      params: undefined,
      visible: true,
      opacity: 1,
      zIndex: 1000,
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerWfs.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerWfs.prototype['updateLayerWithGeostylerStyle'],
      createLayerConfig: VMapLayerWfs.prototype['createLayerConfig'],
      parseParams: VMapLayerWfs.prototype['parseParams'],
    } as any;
    component.el.id = 'wfs1';

    await VMapLayerWfs.prototype['applyExistingStyles'].call(component);

    expect(component.appliedGeostylerStyle).toEqual(geostylerStyle);
    expect(helperMock.updateLayer).toHaveBeenCalled();

    document.body.innerHTML = '';
  });

  it('applyExistingStyles skips non-targeted and non-geostyler styles', async () => {
    const cesiumStyle = { color: 'red' };
    const styleEl = document.createElement('v-map-style');
    Object.defineProperty(styleEl, 'getStyle', { value: vi.fn().mockResolvedValue(cesiumStyle), writable: true, configurable: true });
    Object.defineProperty(styleEl, 'getLayerTargetIds', { value: vi.fn().mockResolvedValue(['wfs1']), writable: true, configurable: true });
    document.body.appendChild(styleEl);

    const component = {
      el: document.createElement('v-map-layer-wfs'),
      helper: helperMock,
      appliedGeostylerStyle: undefined,
      isTargetedByStyle: VMapLayerWfs.prototype['isTargetedByStyle'],
      updateLayerWithGeostylerStyle: VMapLayerWfs.prototype['updateLayerWithGeostylerStyle'],
    } as any;
    component.el.id = 'wfs1';

    await VMapLayerWfs.prototype['applyExistingStyles'].call(component);

    expect(component.appliedGeostylerStyle).toBeUndefined();

    document.body.innerHTML = '';
  });

  it('updateLayerWithGeostylerStyle does nothing without style or helper', async () => {
    await VMapLayerWfs.prototype['updateLayerWithGeostylerStyle'].call({
      appliedGeostylerStyle: undefined,
      helper: helperMock,
    });
    await VMapLayerWfs.prototype['updateLayerWithGeostylerStyle'].call({
      appliedGeostylerStyle: { name: 'x', rules: [] },
      helper: undefined,
    });

    expect(helperMock.updateLayer).not.toHaveBeenCalled();
  });
});
