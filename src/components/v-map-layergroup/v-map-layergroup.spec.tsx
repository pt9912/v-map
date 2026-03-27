import { newSpecPage } from '@stencil/core/testing';
import { VMapLayerGroup } from './v-map-layergroup';

describe('v-map-layergroup', () => {
  it('renders with default attributes', async () => {
    const page = await newSpecPage({
      components: [VMapLayerGroup],
      html: `<v-map-layergroup title="Test Group"></v-map-layergroup>`,
    });
    expect(page.root).toEqualHtml(`
      <v-map-layergroup opacity="1" title="Test Group" visible="">
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </v-map-layergroup>
    `);
  });

  it('returns a group id via getGroupId', async () => {
    const component = { groupId: 'test-uuid-123' } as any;
    const result = await VMapLayerGroup.prototype.getGroupId.call(component);
    expect(result).toBe('test-uuid-123');
  });

  it('calls setGroupVisible on visibility change when provider supports it', async () => {
    const mapProvider = {
      setGroupVisible: jest.fn(),
    };
    const component = {
      mapProvider,
      groupId: 'grp-1',
      visible: false,
    } as any;

    await VMapLayerGroup.prototype.onVisibleChanged.call(component);
    expect(mapProvider.setGroupVisible).toHaveBeenCalledWith('grp-1', false);
  });

  it('handles visibility change when mapProvider has no setGroupVisible', async () => {
    const component = {
      mapProvider: {},
      groupId: 'grp-1',
      visible: true,
    } as any;

    // Should not throw
    await VMapLayerGroup.prototype.onVisibleChanged.call(component);
  });

  it('handles visibility change when mapProvider is null', async () => {
    const component = {
      mapProvider: null,
      groupId: 'grp-1',
      visible: true,
    } as any;

    // Should not throw
    await VMapLayerGroup.prototype.onVisibleChanged.call(component);
  });

  it('calls setBaseLayer on basemapid change when provider supports it', async () => {
    const mapProvider = {
      setBaseLayer: jest.fn(),
    };
    const component = {
      mapProvider,
      groupId: 'grp-2',
      basemapid: 'osm-base',
    } as any;

    await VMapLayerGroup.prototype.onBaseMapIdChanged.call(component);
    expect(mapProvider.setBaseLayer).toHaveBeenCalledWith('grp-2', 'osm-base');
  });

  it('handles basemapid change when mapProvider has no setBaseLayer', async () => {
    const component = {
      mapProvider: {},
      groupId: 'grp-2',
      basemapid: 'osm',
    } as any;

    // Should not throw
    await VMapLayerGroup.prototype.onBaseMapIdChanged.call(component);
  });

  it('init sets up the map provider and calls ensureGroup, setGroupVisible, setBaseLayer', async () => {
    const mapProvider = {
      ensureGroup: jest.fn(),
      setGroupVisible: jest.fn(),
      setBaseLayer: jest.fn(),
    };
    const component = {
      mapProvider: null,
      groupId: 'grp-3',
      visible: true,
      basemapid: 'satellite',
    } as any;

    await VMapLayerGroup.prototype['init'].call(component, mapProvider);

    expect(component.mapProvider).toBe(mapProvider);
    expect(mapProvider.ensureGroup).toHaveBeenCalledWith('grp-3', true, {
      basemapid: 'satellite',
    });
    expect(mapProvider.setGroupVisible).toHaveBeenCalledWith('grp-3', true);
    expect(mapProvider.setBaseLayer).toHaveBeenCalledWith('grp-3', 'satellite');
  });

  it('init does nothing if mapProvider is already set', async () => {
    const existingProvider = { ensureGroup: jest.fn() };
    const newProvider = { ensureGroup: jest.fn() };
    const component = {
      mapProvider: existingProvider,
      groupId: 'grp-4',
      visible: true,
      basemapid: null,
    } as any;

    await VMapLayerGroup.prototype['init'].call(component, newProvider);

    expect(newProvider.ensureGroup).not.toHaveBeenCalled();
    expect(component.mapProvider).toBe(existingProvider);
  });

  it('init handles null mapProvider argument', async () => {
    const component = {
      mapProvider: null,
      groupId: 'grp-5',
      visible: true,
      basemapid: null,
    } as any;

    // null is assigned but then early-returns because mapProvider === null
    await VMapLayerGroup.prototype['init'].call(component, null);
    expect(component.mapProvider).toBeNull();
  });

  it('init works without ensureGroup on the provider', async () => {
    const mapProvider = {
      setGroupVisible: jest.fn(),
      setBaseLayer: jest.fn(),
    };
    const component = {
      mapProvider: null,
      groupId: 'grp-6',
      visible: false,
      basemapid: null,
    } as any;

    await VMapLayerGroup.prototype['init'].call(component, mapProvider);

    expect(mapProvider.setGroupVisible).toHaveBeenCalledWith('grp-6', false);
    expect(mapProvider.setBaseLayer).toHaveBeenCalledWith('grp-6', null);
  });
});
