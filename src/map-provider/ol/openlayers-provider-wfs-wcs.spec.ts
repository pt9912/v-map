import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { LayerConfig } from '../../types/layerconfig';

// vi.hoisted lets us share the mock function instance between the
// top-level vi.mock factory (which runs first, before any imports
// resolve) and the test bodies below. The previous version of this
// file relied on `vi.resetModules()` + `vi.doMock()` inside the test,
// which is racy with vitest's ESM mock cache and produced flaky CI
// failures (assertion that mockImageLayer was called fired before
// the doMock'd version had actually replaced the original).
const { mockImageLayer } = vi.hoisted(() => ({
  mockImageLayer: vi.fn().mockImplementation(function (this: any, opts: any) {
    Object.assign(this, opts);
    this.set = vi.fn();
    this.setOpacity = vi.fn();
    this.setVisible = vi.fn();
  }),
}));

// Mock all OpenLayers modules before they are imported
vi.mock('ol/Map', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/View', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/layer/Layer', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/layer/Base', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/layer/Vector', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/layer/Group', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/layer/Tile', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/layer/Image', () => ({ __esModule: true, default: mockImageLayer }));
vi.mock('ol/layer/WebGLTile', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/source/Vector', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/source/TileWMS', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/source/OSM', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/source/XYZ', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/source/Google', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/source/TileArcGISRest', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/source/ImageWMS', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/source/Image', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/source/GeoTIFF', () => ({ __esModule: true, default: vi.fn(), SourceInfo: vi.fn() }));
vi.mock('ol/Image', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/format/GeoJSON', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/format/GML2', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/format/GML3', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/format/GML32', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/format/WKT', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/control/Control', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Style', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Fill', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Stroke', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Circle', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Icon', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/style/Text', () => ({ __esModule: true, default: vi.fn() }));
vi.mock('ol/loadingstrategy', () => ({ __esModule: true, bbox: vi.fn() }));
vi.mock('ol/proj', () => ({ __esModule: true, fromLonLat: vi.fn(), ProjectionLike: vi.fn() }));

// Mock local helper modules
vi.mock('./openlayers-helper', () => ({
  __esModule: true,
  injectOlCss: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./CustomGeoTiff', () => ({
  __esModule: true,
  createCustomGeoTiff: vi.fn().mockResolvedValue(vi.fn()),
}));

describe('OpenLayersProvider WFS/WCS support', () => {
  beforeEach(() => {
    mockImageLayer.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // it('delegiert das Erstellen eines WFS-Layers an Hilfsfunktionen', async () => {
  //   vi.resetModules();

  //   const mockVectorLayer = vi.fn().mockImplementation(() => ({
  //     set: vi.fn(),
  //     setOpacity: vi.fn(),
  //     setVisible: vi.fn(),
  //   }));

  //   vi.doMock('ol/layer/Vector', () => ({
  //     __esModule: true,
  //     default: mockVectorLayer,
  //   }));

  //   const { OpenLayersProvider } = await import('./openlayers-provider');
  //   const provider = new OpenLayersProvider();

  //   const fetchWfsSpy = vi
  //     .spyOn(provider as any, 'fetchWFSGeoJSON')
  //     .mockResolvedValue({ type: 'FeatureCollection', features: [] });
  //   const createSourceSpy = vi
  //     .spyOn(provider as any, 'createVectorSourceFromGeoJSON')
  //     .mockResolvedValue({});

  //   const layer = await (provider as any).createWFSLayer({
  //     type: 'wfs',
  //     url: 'https://example.com/wfs',
  //     typeName: 'namespace:layer',
  //   } as Extract<LayerConfig, { type: 'wfs' }>);

  //   expect(layer).toBeTruthy();
  //   expect(fetchWfsSpy).toHaveBeenCalledWith(
  //     expect.objectContaining({ typeName: 'namespace:layer' }),
  //   );
  //   expect(createSourceSpy).toHaveBeenCalled();
  //   expect(mockVectorLayer).toHaveBeenCalled();
  // });

  it('verwendet createWcsSource zum Erstellen eines WCS-Layers', async () => {
    const { OpenLayersProvider } = await import('./openlayers-provider');
    const provider = new OpenLayersProvider();

    const createWcsSourceSpy = vi
      .spyOn(provider as any, 'createWcsSource')
      .mockResolvedValue({});

    const layer = await (provider as any).createWCSLayer({
      type: 'wcs',
      url: 'https://example.com/wcs',
      coverageName: 'DEM',
    } as Extract<LayerConfig, { type: 'wcs' }>);

    expect(layer).toBeTruthy();
    expect(createWcsSourceSpy).toHaveBeenCalledWith(
      expect.objectContaining({ coverageName: 'DEM' }),
    );
    expect(mockImageLayer).toHaveBeenCalled();
  });
});
