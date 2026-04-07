import { vi, describe, it, expect, beforeEach } from 'vitest';

/* ------------------------------------------------------------------ */
/*  Cesium mock module                                                 */
/* ------------------------------------------------------------------ */

function createMockCesiumModule() {
  // Helper to build instanceof-compatible constructors
  function taggedCtor(tag: string) {
    const fn = vi.fn().mockImplementation(function (this: any, ...args: any[]) {
      Object.assign(this, { __tag: tag }, args[0] ?? {});
    });
    return fn;
  }

  const GeoJsonDataSource = taggedCtor('GeoJsonDataSource');
  const DataSource = taggedCtor('DataSource');
  const Cesium3DTileset = taggedCtor('Cesium3DTileset');
  const ImageryLayer = taggedCtor('ImageryLayer');
  const Cesium3DTileStyle = vi.fn().mockImplementation(function (this: any, opts: any) {
    Object.assign(this, { __tag: 'Cesium3DTileStyle', ...opts });
  });
  const ConstantProperty = vi.fn().mockImplementation(function (this: any, v: any) {
    Object.assign(this, { _value: v });
  });
  // Color must be a callable constructor so instanceof checks work
  const ColorCtor = vi.fn().mockImplementation(function (this: any) {
    Object.assign(this, { __tag: 'Color' });
  }) as any;
  ColorCtor.WHITE = { toCssHexString: () => '#ffffff' };
  ColorCtor.BLACK = {};
  ColorCtor.fromAlpha = vi.fn((_color: any, alpha: number) => ({ alpha }));
  const Color = ColorCtor;
  const ColorBlendMode = { MIX: 'MIX' };
  const JulianDate = vi.fn();
  const ColorMaterialProperty = taggedCtor('ColorMaterialProperty');
  const ImageMaterialProperty = taggedCtor('ImageMaterialProperty');
  const PolylineOutlineMaterialProperty = taggedCtor('PolylineOutlineMaterialProperty');

  return {
    GeoJsonDataSource,
    DataSource,
    Cesium3DTileset,
    ImageryLayer,
    Cesium3DTileStyle,
    ConstantProperty,
    Color,
    ColorBlendMode,
    JulianDate,
    ColorMaterialProperty,
    ImageMaterialProperty,
    PolylineOutlineMaterialProperty,
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function createMockCollection() {
  const items: any[] = [];
  return {
    add: vi.fn((item: any) => { items.push(item); }),
    remove: vi.fn((item: any, _destroy?: boolean) => {
      const idx = items.indexOf(item);
      if (idx >= 0) items.splice(idx, 1);
      return idx >= 0;
    }),
    removeAll: vi.fn((_destroy?: boolean) => { items.length = 0; }),
    get: vi.fn((i: number) => items[i]),
    get length() { return items.length; },
    _items: items,
  };
}

function createMockViewer(overrides: Record<string, any> = {}) {
  const imageryLayers = createMockCollection();
  const primitives = createMockCollection();
  const dataSources = createMockCollection();

  return {
    imageryLayers,
    scene: {
      primitives,
      ...overrides.scene,
    },
    dataSources,
    clock: { currentTime: 0 },
    ...overrides,
  };
}

import { LayerManager } from './layer-manager';

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */
describe('LayerManager', () => {
  let Cesium: ReturnType<typeof createMockCesiumModule>;
  let viewer: ReturnType<typeof createMockViewer>;
  let manager: LayerManager;

  beforeEach(() => {
    vi.clearAllMocks();
    Cesium = createMockCesiumModule();
    viewer = createMockViewer();
    manager = new LayerManager(Cesium as any, viewer as any);
    // The source code references bare `Cesium` (global) for instanceof checks
    // inside wrapDataSourceLayer's setOpacity (e.g. Cesium.ColorMaterialProperty)
    (globalThis as any).Cesium = Cesium;
  });

  /* ================================================================ */
  /*  addLayer                                                         */
  /* ================================================================ */
  describe('addLayer', () => {
    it('throws if Cesium is not initialized', () => {
      const noManager = new LayerManager(null as any, viewer as any);
      const layer = new Cesium.ImageryLayer();
      expect(() => noManager.addLayer('l1', layer as any)).toThrow(
        'Cesium must be initialized first',
      );
    });

    it('adds an ImageryLayer to viewer.imageryLayers', () => {
      const layer = new Cesium.ImageryLayer();
      const wrapped = manager.addLayer('imagery-1', layer as any);

      expect(viewer.imageryLayers.add).toHaveBeenCalledWith(layer);
      expect(wrapped).toBeDefined();
      expect(wrapped.getVisible).toBeDefined();
    });

    it('adds a GeoJsonDataSource to viewer.dataSources', () => {
      const layer = new Cesium.GeoJsonDataSource();
      manager.addLayer('geojson-1', layer as any);

      expect(viewer.dataSources.add).toHaveBeenCalledWith(layer);
    });

    it('adds a DataSource to viewer.dataSources', () => {
      const layer = new Cesium.DataSource();
      // GeoJsonDataSource extends DataSource, so need instance not matching GeoJson first
      // Since our mock uses separate constructors, DataSource is its own check
      manager.addLayer('ds-1', layer as any);

      expect(viewer.dataSources.add).toHaveBeenCalledWith(layer);
    });

    it('adds a Cesium3DTileset to viewer.scene.primitives', () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).style = null;
      manager.addLayer('tileset-1', layer as any);

      expect(viewer.scene.primitives.add).toHaveBeenCalledWith(layer);
      // Should have set a default style since layer.style was null
      expect((layer as any).style).toBeDefined();
    });

    it('preserves existing style on Cesium3DTileset', () => {
      const layer = new Cesium.Cesium3DTileset();
      const existingStyle = { color: "color('red')" };
      (layer as any).style = existingStyle;
      manager.addLayer('tileset-2', layer as any);

      expect((layer as any).style).toBe(existingStyle);
    });

    it('sets the id on the layer', () => {
      const layer = new Cesium.ImageryLayer();
      manager.addLayer('my-id', layer as any);
      expect((layer as any).id).toBe('my-id');
    });
  });

  /* ================================================================ */
  /*  addCustomLayer                                                   */
  /* ================================================================ */
  describe('addCustomLayer', () => {
    it('stores the custom layer and returns it', () => {
      const customLayer = {
        getOptions: vi.fn(),
        setOptions: vi.fn(),
        getVisible: vi.fn().mockReturnValue(true),
        setVisible: vi.fn(),
        getOpacity: vi.fn().mockReturnValue(1),
        setOpacity: vi.fn(),
        getZIndex: vi.fn().mockReturnValue(0),
        setZIndex: vi.fn(),
        remove: vi.fn(),
      };

      const result = manager.addCustomLayer('custom-1', customLayer);
      expect(result).toBe(customLayer);
      expect(manager.getLayer('custom-1')).toBe(customLayer);
    });
  });

  /* ================================================================ */
  /*  getLayer / getLayerById                                          */
  /* ================================================================ */
  describe('getLayer', () => {
    it('returns the layer when it exists', () => {
      const layer = new Cesium.ImageryLayer();
      manager.addLayer('img-1', layer as any);

      const wrapped = manager.getLayer('img-1');
      expect(wrapped).toBeDefined();
    });

    it('throws when layer is not found', () => {
      expect(() => manager.getLayer('non-existent')).toThrow(
        'Layer mit ID "non-existent" nicht gefunden',
      );
    });
  });

  describe('getLayerById', () => {
    it('delegates to getLayer', () => {
      const layer = new Cesium.ImageryLayer();
      manager.addLayer('img-2', layer as any);

      const result = manager.getLayerById('img-2');
      expect(result).toBeDefined();
    });
  });

  /* ================================================================ */
  /*  removeLayer                                                      */
  /* ================================================================ */
  describe('removeLayer', () => {
    it('removes the layer and deletes it from the map', () => {
      const layer = new Cesium.ImageryLayer();
      viewer.imageryLayers._items.push(layer);
      manager.addLayer('img-rm', layer as any);

      manager.removeLayer('img-rm');

      expect(() => manager.getLayer('img-rm')).toThrow();
    });

    it('throws when layer does not exist', () => {
      expect(() => manager.removeLayer('missing')).toThrow(
        'Layer mit ID "missing" nicht gefunden',
      );
    });
  });

  /* ================================================================ */
  /*  setVisible                                                       */
  /* ================================================================ */
  describe('setVisible', () => {
    it('sets visibility on an ImageryLayer', () => {
      const layer = new Cesium.ImageryLayer();
      (layer as any).show = true;
      manager.addLayer('vis-1', layer as any);

      manager.setVisible('vis-1', false);

      expect((layer as any).show).toBe(false);
    });

    it('sets visibility on a DataSource', () => {
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      manager.addLayer('vis-ds', layer as any);

      manager.setVisible('vis-ds', false);
      expect((layer as any).show).toBe(false);
    });
  });

  /* ================================================================ */
  /*  setOpacity                                                       */
  /* ================================================================ */
  describe('setOpacity', () => {
    it('sets alpha on an ImageryLayer', () => {
      const layer = new Cesium.ImageryLayer();
      (layer as any).alpha = 1;
      manager.addLayer('op-1', layer as any);

      manager.setOpacity('op-1', 0.5);
      expect((layer as any).alpha).toBe(0.5);
    });

    it('sets opacity on a Cesium3DTileset via style expression', () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).style = new Cesium.Cesium3DTileStyle({
        color: "color('white', 1.0)",
      });
      manager.addLayer('op-tile', layer as any);

      manager.setOpacity('op-tile', 0.3);

      // Should have created a new Cesium3DTileStyle with updated opacity
      expect(Cesium.Cesium3DTileStyle).toHaveBeenCalled();
    });
  });

  /* ================================================================ */
  /*  setZIndex                                                        */
  /* ================================================================ */
  describe('setZIndex', () => {
    it('calls setZIndex on the wrapped layer', async () => {
      const layer = new Cesium.ImageryLayer();
      (layer as any).show = true;
      (layer as any).alpha = 1;
      viewer.imageryLayers._items.push(layer);
      manager.addLayer('z-1', layer as any);

      await manager.setZIndex('z-1', 5);

      // Should have called sort logic via sortImageryLayers
      // The collection was manipulated
      expect(viewer.imageryLayers.removeAll).toHaveBeenCalled();
    });
  });

  /* ================================================================ */
  /*  replaceLayer                                                     */
  /* ================================================================ */
  describe('replaceLayer', () => {
    it('throws if Cesium is not initialized', () => {
      const noManager = new LayerManager(null as any, viewer as any);
      const oldLayer = {
        getZIndex: vi.fn().mockReturnValue(2),
        getVisible: vi.fn().mockReturnValue(true),
        getOpacity: vi.fn().mockReturnValue(0.8),
        remove: vi.fn(),
      };

      expect(() =>
        noManager.replaceLayer('r1', oldLayer as any, new Cesium.ImageryLayer() as any),
      ).toThrow('Cesium must be initialized first');
    });

    it('removes old layer and adds new one with same properties', () => {
      // Add original layer
      const origLayer = new Cesium.ImageryLayer();
      (origLayer as any).show = true;
      (origLayer as any).alpha = 0.7;
      viewer.imageryLayers._items.push(origLayer);
      const wrappedOrig = manager.addLayer('replace-1', origLayer as any);

      // Create replacement
      const newLayer = new Cesium.ImageryLayer();
      (newLayer as any).show = true;
      (newLayer as any).alpha = 1;

      const result = manager.replaceLayer('replace-1', wrappedOrig, newLayer as any);

      expect(result).toBeDefined();
      expect(result.getVisible).toBeDefined();
    });
  });

  /* ================================================================ */
  /*  wrapImageryLayer (via addLayer + wrapped interface)              */
  /* ================================================================ */
  describe('wrapped ImageryLayer', () => {
    it('getVisible/setVisible maps to layer.show', () => {
      const layer = new Cesium.ImageryLayer();
      (layer as any).show = true;
      const wrapped = manager.addLayer('il-1', layer as any);

      expect(wrapped.getVisible()).toBe(true);
      wrapped.setVisible(false);
      expect((layer as any).show).toBe(false);
    });

    it('getOpacity/setOpacity maps to layer.alpha', () => {
      const layer = new Cesium.ImageryLayer();
      (layer as any).alpha = 0.9;
      const wrapped = manager.addLayer('il-2', layer as any);

      expect(wrapped.getOpacity()).toBe(0.9);
      wrapped.setOpacity(0.4);
      expect((layer as any).alpha).toBe(0.4);
    });

    it('getZIndex returns index in collection', () => {
      const layer = new Cesium.ImageryLayer();
      viewer.imageryLayers._items.push(layer);
      const wrapped = manager.addLayer('il-3', layer as any);

      // layer is the only item at index 0 (add also pushes)
      // items: [layer, layer] — add pushes again
      // The get mock returns from _items
      expect(wrapped.getZIndex()).toBeGreaterThanOrEqual(0);
    });

    it('getZIndex finds layer after other items in collection', () => {
      // Put a different item first, then the target layer
      const otherLayer = new Cesium.ImageryLayer();
      viewer.imageryLayers._items.push(otherLayer);
      const layer = new Cesium.ImageryLayer();
      const wrapped = manager.addLayer('il-3b', layer as any);

      // layer should be found at index 1 (otherLayer is at 0, layer added at 1)
      expect(wrapped.getZIndex()).toBe(1);
    });

    it('getZIndex returns -1 when layer not in collection', () => {
      const layer = new Cesium.ImageryLayer();
      const wrapped = manager.addLayer('il-4', layer as any);
      // Clear the collection so layer is not found
      viewer.imageryLayers._items.length = 0;

      expect(wrapped.getZIndex()).toBe(-1);
    });

    it('setZIndex does nothing when zIndex is undefined', async () => {
      const layer = new Cesium.ImageryLayer();
      const wrapped = manager.addLayer('il-5', layer as any);

      await wrapped.setZIndex(undefined as any);
      expect(viewer.imageryLayers.removeAll).not.toHaveBeenCalled();
    });

    it('remove delegates to collection.remove', () => {
      const layer = new Cesium.ImageryLayer();
      viewer.imageryLayers._items.push(layer);
      const wrapped = manager.addLayer('il-6', layer as any);

      wrapped.remove();
      expect(viewer.imageryLayers.remove).toHaveBeenCalledWith(layer);
    });

    it('getOptions/setOptions work', () => {
      const layer = new Cesium.ImageryLayer();
      const wrapped = manager.addLayer('il-7', layer as any);

      expect(wrapped.getOptions()).toEqual({});
      wrapped.setOptions({ foo: 'bar' });
      expect(wrapped.getOptions()).toEqual({ foo: 'bar' });
    });
  });

  /* ================================================================ */
  /*  wrapTilesetLayer (via addLayer + wrapped interface)              */
  /* ================================================================ */
  describe('wrapped Cesium3DTileset', () => {
    function addTileset(id: string, styleColor?: string) {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).show = true;
      (layer as any).style = styleColor
        ? new Cesium.Cesium3DTileStyle({ color: styleColor })
        : new Cesium.Cesium3DTileStyle({});
      return manager.addLayer(id, layer as any);
    }

    it('getVisible/setVisible maps to layer.show', () => {
      const wrapped = addTileset('ts-1');
      expect(wrapped.getVisible()).toBe(true);
      wrapped.setVisible(false);
    });

    it('getOpacity returns opacity from style color expression', () => {
      const wrapped = addTileset('ts-2', "color('white',0.5)");
      expect(wrapped.getOpacity()).toBe(0.5);
    });

    it('getOpacity returns 1.0 when style.color is not a string', () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).show = true;
      (layer as any).style = new Cesium.Cesium3DTileStyle({});
      (layer as any).style.color = 42; // non-string
      const wrapped = manager.addLayer('ts-3', layer as any);

      expect(wrapped.getOpacity()).toBe(1.0);
    });

    it('getOpacity returns 1.0 when no color match in expression', () => {
      const wrapped = addTileset('ts-4', 'no-match-here');
      expect(wrapped.getOpacity()).toBe(1.0);
    });

    it('setOpacity updates color expression preserving color part', () => {
      const wrapped = addTileset('ts-5', "color('red',0.8)");
      wrapped.setOpacity(0.3);
      expect(Cesium.Cesium3DTileStyle).toHaveBeenCalled();
    });

    it('setOpacity falls back to white when color string has no color() pattern', () => {
      // The string does not contain 'color(' pattern, so regex replace doesn't change it,
      // and colorPart.includes('color') is false => fallback to color('white', value)
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).show = true;
      (layer as any).style = new Cesium.Cesium3DTileStyle({});
      (layer as any).style.color = 'rgb(255,0,0)'; // no 'color()' wrapper, no 'color' word
      const wrapped = manager.addLayer('ts-no-color-pattern', layer as any);

      wrapped.setOpacity(0.4);
      expect(Cesium.Cesium3DTileStyle).toHaveBeenCalled();
    });

    it('setOpacity falls back to white when currentColor is not a string', () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).show = true;
      (layer as any).style = new Cesium.Cesium3DTileStyle({});
      (layer as any).style.color = 42; // non-string
      const wrapped = manager.addLayer('ts-6', layer as any);

      wrapped.setOpacity(0.5);
      expect(Cesium.Cesium3DTileStyle).toHaveBeenCalled();
    });

    it('getZIndex returns index when tileset is found in primitives', () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).style = new Cesium.Cesium3DTileStyle({});
      const wrapped = manager.addLayer('ts-7a', layer as any);

      // Verify layer is in primitives
      expect(viewer.scene.primitives._items).toContain(layer);
      // getZIndex should find the layer and return its index
      const idx = wrapped.getZIndex();
      expect(idx).toBe(0);
    });

    it('getZIndex returns correct index for second tileset in primitives', () => {
      const layer1 = new Cesium.Cesium3DTileset();
      (layer1 as any).style = new Cesium.Cesium3DTileStyle({});
      manager.addLayer('ts-first', layer1 as any);

      const layer2 = new Cesium.Cesium3DTileset();
      (layer2 as any).style = new Cesium.Cesium3DTileStyle({});
      const wrapped2 = manager.addLayer('ts-second', layer2 as any);

      // layer2 should be at index 1
      expect(wrapped2.getZIndex()).toBe(1);
    });

    it('getZIndex returns -1 when tileset not in primitives', () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).style = new Cesium.Cesium3DTileStyle({});
      const wrapped = manager.addLayer('ts-7', layer as any);
      viewer.scene.primitives._items.length = 0;

      expect(wrapped.getZIndex()).toBe(-1);
    });

    it('setZIndex does nothing when zIndex is undefined', async () => {
      const wrapped = addTileset('ts-8');
      await wrapped.setZIndex(undefined as any);
      expect(viewer.scene.primitives.removeAll).not.toHaveBeenCalled();
    });

    it('remove delegates to scene.primitives.remove', () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).style = new Cesium.Cesium3DTileStyle({});
      const wrapped = manager.addLayer('ts-9', layer as any);

      wrapped.remove();
      expect(viewer.scene.primitives.remove).toHaveBeenCalledWith(layer);
    });

    it('getOptions/setOptions work', () => {
      const wrapped = addTileset('ts-10');
      expect(wrapped.getOptions()).toEqual({});
      wrapped.setOptions({ custom: true });
      expect(wrapped.getOptions()).toEqual({ custom: true });
    });
  });

  /* ================================================================ */
  /*  I3DTilesLayer extra methods: setColor, setStyle                  */
  /* ================================================================ */
  describe('I3DTilesLayer setColor and setStyle', () => {
    it('setColor with a string color', () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).show = true;
      (layer as any).style = new Cesium.Cesium3DTileStyle({});
      const wrapped = manager.addLayer('sc-1', layer as any) as any;

      wrapped.setColor('#ff0000', 0.7);
      expect(Cesium.Cesium3DTileStyle).toHaveBeenCalled();
    });

    it('setColor with a Cesium.Color object', () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).show = true;
      (layer as any).style = new Cesium.Cesium3DTileStyle({});
      const wrapped = manager.addLayer('sc-2', layer as any) as any;

      // Create a real Cesium.Color instance so instanceof check passes
      const cesiumColor = new Cesium.Color();
      cesiumColor.toCssHexString = vi.fn().mockReturnValue('#ff0000');
      wrapped.setColor(cesiumColor, 0.8);
      expect(cesiumColor.toCssHexString).toHaveBeenCalled();
      expect(Cesium.Cesium3DTileStyle).toHaveBeenCalled();
    });

    it('setStyle with a plain object creates new Cesium3DTileStyle', () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).show = true;
      (layer as any).style = new Cesium.Cesium3DTileStyle({});
      const wrapped = manager.addLayer('ss-1', layer as any) as any;

      const plainStyle = { color: "color('green')" };
      wrapped.setStyle(plainStyle);
      expect(Cesium.Cesium3DTileStyle).toHaveBeenCalled();
    });

    it('setStyle with a Cesium3DTileStyle instance uses it directly', () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).show = true;
      (layer as any).style = null;
      const wrapped = manager.addLayer('ss-2', layer as any) as any;

      const tileStyle = new Cesium.Cesium3DTileStyle({ color: 'test' });
      wrapped.setStyle(tileStyle);
      expect((layer as any).style).toBe(tileStyle);
    });

    it('setColor with default opacity of 1.0', () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).show = true;
      (layer as any).style = new Cesium.Cesium3DTileStyle({});
      const wrapped = manager.addLayer('sc-3', layer as any) as any;

      wrapped.setColor('red');
      expect(Cesium.Cesium3DTileStyle).toHaveBeenCalled();
    });
  });

  /* ================================================================ */
  /*  wrapDataSourceLayer                                              */
  /* ================================================================ */
  describe('wrapped DataSource', () => {
    it('getVisible/setVisible maps to layer.show', () => {
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [] };
      const wrapped = manager.addLayer('ds-1', layer as any);

      expect(wrapped.getVisible()).toBe(true);
      wrapped.setVisible(false);
      expect((layer as any).show).toBe(false);
    });

    it('getOpacity always returns 1.0', () => {
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [] };
      const wrapped = manager.addLayer('ds-2', layer as any);

      expect(wrapped.getOpacity()).toBe(1.0);
    });

    it('setOpacity skips when __vmapLockOpacity is true', () => {
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [] };
      (layer as any).__vmapLockOpacity = true;
      const wrapped = manager.addLayer('ds-3', layer as any);

      // Should not throw or iterate
      wrapped.setOpacity(0.5);
    });

    it('setOpacity processes entities with no geometry', () => {
      const entity = {};
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-4', layer as any);

      // Should not throw
      wrapped.setOpacity(0.5);
    });

    it('getZIndex returns index when layer is found in collection', () => {
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [] };
      const wrapped = manager.addLayer('ds-5a', layer as any);

      // Verify layer is in the collection
      expect(viewer.dataSources._items).toContain(layer);
      expect(viewer.dataSources._items.length).toBeGreaterThan(0);
      // getZIndex should find the layer and return its index
      const idx = wrapped.getZIndex();
      expect(idx).toBeGreaterThanOrEqual(0);
      expect(idx).toBe(0);
    });

    it('getZIndex returns correct index for second datasource in collection', () => {
      const layer1 = new Cesium.DataSource();
      (layer1 as any).show = true;
      (layer1 as any).entities = { values: [] };
      manager.addLayer('ds-first', layer1 as any);

      const layer2 = new Cesium.DataSource();
      (layer2 as any).show = true;
      (layer2 as any).entities = { values: [] };
      const wrapped2 = manager.addLayer('ds-second', layer2 as any);

      // layer2 should be at index 1
      expect(wrapped2.getZIndex()).toBe(1);
    });

    it('getZIndex returns -1 when not in collection', () => {
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [] };
      const wrapped = manager.addLayer('ds-5', layer as any);
      viewer.dataSources._items.length = 0;

      expect(wrapped.getZIndex()).toBe(-1);
    });

    it('setZIndex does nothing when zIndex is undefined', async () => {
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [] };
      const wrapped = manager.addLayer('ds-6', layer as any);

      await wrapped.setZIndex(undefined as any);
      expect(viewer.dataSources.removeAll).not.toHaveBeenCalled();
    });

    it('remove delegates to collection.remove', () => {
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [] };
      const wrapped = manager.addLayer('ds-7', layer as any);

      wrapped.remove();
      expect(viewer.dataSources.remove).toHaveBeenCalledWith(layer);
    });

    it('getOptions/setOptions work', () => {
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [] };
      const wrapped = manager.addLayer('ds-8', layer as any);

      expect(wrapped.getOptions()).toEqual({});
      wrapped.setOptions({ key: 'value' });
      expect(wrapped.getOptions()).toEqual({ key: 'value' });
    });

    /* -------------------------------------------------------------- */
    /*  setOpacity – entity geometry branches                          */
    /* -------------------------------------------------------------- */

    it('setOpacity processes polygon with ColorMaterialProperty', () => {
      const colorMat = new Cesium.ColorMaterialProperty();
      (colorMat as any).color = undefined; // no color => setColorOpacity gets undefined
      const entity = {
        polygon: { material: colorMat },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-poly-color', layer as any);

      wrapped.setOpacity(0.5);
      expect(Cesium.ConstantProperty).toHaveBeenCalled();
    });

    it('setOpacity processes polygon with ImageMaterialProperty', () => {
      const imgMat = new Cesium.ImageMaterialProperty();
      (imgMat as any).color = undefined;
      const entity = {
        polygon: { material: imgMat },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-poly-img', layer as any);

      wrapped.setOpacity(0.5);
      expect(Cesium.ConstantProperty).toHaveBeenCalled();
    });

    it('setOpacity processes polygon with unknown material type (neither Color nor Image)', () => {
      // Material that is not instanceof ColorMaterialProperty or ImageMaterialProperty
      const unknownMat = { color: undefined };
      const entity = {
        polygon: { material: unknownMat },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-poly-unknown', layer as any);

      // Should not throw — just skips both branches
      wrapped.setOpacity(0.5);
    });

    it('setOpacity processes polyline with unknown material type', () => {
      // Material that is not instanceof ColorMaterialProperty or PolylineOutlineMaterialProperty
      const unknownMat = { color: undefined };
      const entity = {
        polyline: { material: unknownMat },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-pline-unknown', layer as any);

      // Should not throw — just skips both branches
      wrapped.setOpacity(0.5);
    });

    it('setOpacity processes polyline with ColorMaterialProperty', () => {
      const colorMat = new Cesium.ColorMaterialProperty();
      (colorMat as any).color = undefined;
      const entity = {
        polyline: { material: colorMat },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-pline-color', layer as any);

      wrapped.setOpacity(0.5);
      expect(Cesium.ConstantProperty).toHaveBeenCalled();
    });

    it('setOpacity processes polyline with PolylineOutlineMaterialProperty', () => {
      const outlineMat = new Cesium.PolylineOutlineMaterialProperty();
      (outlineMat as any).color = undefined;
      const entity = {
        polyline: { material: outlineMat },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-pline-outline', layer as any);

      wrapped.setOpacity(0.5);
      expect(Cesium.ConstantProperty).toHaveBeenCalled();
    });

    it('setOpacity processes point entity', () => {
      const entity = {
        point: { color: undefined },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-point', layer as any);

      wrapped.setOpacity(0.5);
      expect(Cesium.ConstantProperty).toHaveBeenCalled();
      expect(entity.point.color).toBeDefined();
    });

    it('setOpacity processes billboard entity', () => {
      const entity = {
        billboard: { color: undefined },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-billboard', layer as any);

      wrapped.setOpacity(0.5);
      expect(Cesium.ConstantProperty).toHaveBeenCalled();
      expect(entity.billboard.color).toBeDefined();
    });

    it('setOpacity processes label entity with fillColor and outlineColor', () => {
      const entity = {
        label: { fillColor: undefined as any, outlineColor: undefined as any },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-label', layer as any);

      wrapped.setOpacity(0.5);
      expect(Cesium.ConstantProperty).toHaveBeenCalled();
      expect(entity.label.fillColor).toBeDefined();
    });

    it('setOpacity processes label entity with outlineColor set', () => {
      // Create a property-like outlineColor so the truthy branch at line 590 fires
      const mockProperty = { getValue: vi.fn().mockReturnValue({}), setValue: vi.fn() };
      const entity = {
        label: { fillColor: undefined as any, outlineColor: mockProperty as any },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-label-outline', layer as any);

      wrapped.setOpacity(0.5);
      // outlineColor branch should be entered and setColorOpacity called
      expect(Cesium.Color.fromAlpha).toHaveBeenCalled();
    });

    it('setOpacity processes model entity', () => {
      const entity = {
        model: { color: undefined },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-model', layer as any);

      wrapped.setOpacity(0.5);
      expect(Cesium.ConstantProperty).toHaveBeenCalled();
      expect(entity.model.color).toBeDefined();
    });

    /* -------------------------------------------------------------- */
    /*  setColorOpacity inner paths                                    */
    /* -------------------------------------------------------------- */

    it('setColorOpacity: uses JulianDate fallback when viewer.clock.currentTime is undefined', () => {
      // Set viewer.clock.currentTime to undefined to trigger the ?? branch at line 518
      (viewer as any).clock = { currentTime: undefined };
      const mockProp = {
        getValue: vi.fn().mockReturnValue({ r: 1, g: 0, b: 0, a: 1 }),
        setValue: vi.fn(),
      };
      const entity = {
        point: { color: mockProp },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-juliandate', layer as any);

      wrapped.setOpacity(0.5);
      expect(mockProp.getValue).toHaveBeenCalled();
      // JulianDate constructor should have been called as fallback
      expect(Cesium.JulianDate).toHaveBeenCalled();
    });

    it('setColorOpacity: uses JulianDate fallback when viewer.clock is null', () => {
      // Set viewer.clock to null to trigger the ?. + ?? branch
      (viewer as any).clock = null;
      const mockProp = {
        getValue: vi.fn().mockReturnValue({ r: 1, g: 0, b: 0, a: 1 }),
        setValue: vi.fn(),
      };
      const entity = {
        billboard: { color: mockProp },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-nullclock', layer as any);

      wrapped.setOpacity(0.5);
      expect(mockProp.getValue).toHaveBeenCalled();
      expect(Cesium.JulianDate).toHaveBeenCalled();
    });

    it('setColorOpacity: property with getValue + setValue uses setValue', () => {
      const mockProp = {
        getValue: vi.fn().mockReturnValue({ r: 1, g: 0, b: 0, a: 1 }),
        setValue: vi.fn(),
      };
      const colorMat = new Cesium.ColorMaterialProperty();
      (colorMat as any).color = mockProp;
      const entity = {
        polygon: { material: colorMat },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-setval', layer as any);

      wrapped.setOpacity(0.7);
      // setValue should have been called (line 523)
      expect(mockProp.setValue).toHaveBeenCalled();
      // material.color should be the same mockProp (returned as-is at line 524)
      expect((colorMat as any).color).toBe(mockProp);
    });

    it('setColorOpacity: getValue returns null triggers ?? defaultColor fallback', () => {
      // When getValue returns null, applyAlpha(null) triggers color ?? defaultColor
      const mockProp = {
        getValue: vi.fn().mockReturnValue(null),
        setValue: vi.fn(),
      };
      const colorMat = new Cesium.ColorMaterialProperty();
      (colorMat as any).color = mockProp;
      const entity = {
        polygon: { material: colorMat },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-nullcolor', layer as any);

      wrapped.setOpacity(0.5);
      // fromAlpha should be called with the defaultColor (Cesium.Color.WHITE)
      // because currentColor was null, triggering ?? defaultColor in applyAlpha
      expect(Cesium.Color.fromAlpha).toHaveBeenCalled();
    });

    it('setColorOpacity: property with getValue but no setValue returns ConstantProperty', () => {
      const mockProp = {
        getValue: vi.fn().mockReturnValue({ r: 0, g: 1, b: 0, a: 1 }),
        // no setValue
      };
      const colorMat = new Cesium.ColorMaterialProperty();
      (colorMat as any).color = mockProp;
      const entity = {
        polygon: { material: colorMat },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-noval', layer as any);

      wrapped.setOpacity(0.4);
      // Should have created a ConstantProperty (line 526)
      expect(Cesium.ConstantProperty).toHaveBeenCalled();
    });

    it('setColorOpacity: colorProperty is a Cesium.Color instance', () => {
      const cesiumColorInstance = new Cesium.Color();
      const colorMat = new Cesium.ColorMaterialProperty();
      (colorMat as any).color = cesiumColorInstance;
      const entity = {
        polygon: { material: colorMat },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-colorinst', layer as any);

      wrapped.setOpacity(0.6);
      // Should enter the colorProperty instanceof Color branch (line 529-530)
      expect(Cesium.Color.fromAlpha).toHaveBeenCalled();
      expect(Cesium.ConstantProperty).toHaveBeenCalled();
    });

    it('setColorOpacity: colorProperty is a non-Property non-Color truthy value', () => {
      // A truthy value that is not a Property (no getValue) and not a Color instance
      const colorMat = new Cesium.ColorMaterialProperty();
      (colorMat as any).color = 'some-string-value';
      const entity = {
        polygon: { material: colorMat },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-fallback', layer as any);

      wrapped.setOpacity(0.3);
      // Should fall through to the final return (line 533)
      expect(Cesium.ConstantProperty).toHaveBeenCalled();
    });

    it('setOpacity processes all entity types on a single entity', () => {
      const colorMat = new Cesium.ColorMaterialProperty();
      (colorMat as any).color = undefined;
      const outlineMat = new Cesium.PolylineOutlineMaterialProperty();
      (outlineMat as any).color = undefined;
      const entity = {
        polygon: { material: colorMat },
        polyline: { material: outlineMat },
        point: { color: undefined },
        billboard: { color: undefined },
        label: { fillColor: undefined, outlineColor: undefined as any },
        model: { color: undefined },
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-all', layer as any);

      wrapped.setOpacity(0.5);
      expect(entity.point.color).toBeDefined();
      expect(entity.billboard.color).toBeDefined();
      expect(entity.model.color).toBeDefined();
    });

    it('setOpacity: label without outlineColor skips outline branch', () => {
      const entity = {
        label: { fillColor: undefined as any },
        // no outlineColor at all
      };
      const layer = new Cesium.DataSource();
      (layer as any).show = true;
      (layer as any).entities = { values: [entity] };
      const wrapped = manager.addLayer('ds-label-nooutline', layer as any);

      wrapped.setOpacity(0.5);
      expect(entity.label.fillColor).toBeDefined();
    });
  });

  /* ================================================================ */
  /*  sort logic                                                       */
  /* ================================================================ */
  describe('sort (private, tested via setZIndex)', () => {
    it('sorts imagery layers by zIndex', async () => {
      const layer1 = new Cesium.ImageryLayer();
      (layer1 as any).show = true;
      (layer1 as any).alpha = 1;
      (layer1 as any).zIndex = 1;

      const layer2 = new Cesium.ImageryLayer();
      (layer2 as any).show = true;
      (layer2 as any).alpha = 1;
      (layer2 as any).zIndex = 5;

      viewer.imageryLayers._items.push(layer1, layer2);
      manager.addLayer('sort-1', layer1 as any);
      manager.addLayer('sort-2', layer2 as any);

      // Set zIndex on layer1 to 10 (should end up after layer2)
      await manager.setZIndex('sort-1', 10);

      expect(viewer.imageryLayers.removeAll).toHaveBeenCalled();
      expect(viewer.imageryLayers.add).toHaveBeenCalled();
    });

    it('sorts data sources by zIndex', async () => {
      const layer1 = new Cesium.DataSource();
      (layer1 as any).show = true;
      (layer1 as any).entities = { values: [] };
      (layer1 as any).zIndex = 3;

      const layer2 = new Cesium.DataSource();
      (layer2 as any).show = true;
      (layer2 as any).entities = { values: [] };
      (layer2 as any).zIndex = 1;

      viewer.dataSources._items.push(layer1, layer2);
      manager.addLayer('ds-sort-1', layer1 as any);
      manager.addLayer('ds-sort-2', layer2 as any);

      await manager.setZIndex('ds-sort-1', 0);

      expect(viewer.dataSources.removeAll).toHaveBeenCalled();
    });

    it('sorts items without zIndex (|| 0 fallback)', async () => {
      // Items with no zIndex property — sort comparator uses || 0 fallback
      const layer1 = new Cesium.ImageryLayer();
      (layer1 as any).show = true;
      (layer1 as any).alpha = 1;
      // no zIndex property set

      const layer2 = new Cesium.ImageryLayer();
      (layer2 as any).show = true;
      (layer2 as any).alpha = 1;
      // no zIndex property set

      viewer.imageryLayers._items.push(layer1, layer2);
      manager.addLayer('sort-noz-1', layer1 as any);
      manager.addLayer('sort-noz-2', layer2 as any);

      // Trigger sort — items without zIndex should default to 0
      await manager.setZIndex('sort-noz-1', 5);

      expect(viewer.imageryLayers.removeAll).toHaveBeenCalled();
    });

    it('sorts 3D tilesets by zIndex', async () => {
      const layer = new Cesium.Cesium3DTileset();
      (layer as any).show = true;
      (layer as any).style = new Cesium.Cesium3DTileStyle({ color: "color('white',1.0)" });
      viewer.scene.primitives._items.push(layer);
      manager.addLayer('ts-sort-1', layer as any);

      await manager.setZIndex('ts-sort-1', 3);

      expect(viewer.scene.primitives.removeAll).toHaveBeenCalled();
    });
  });
});
