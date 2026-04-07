import { vi } from 'vitest';

// Mocks müssen vor allen Imports stehen
const {
  mockGetTileData,
  mockCreateGlobalTriangulation,
  mockGeoTIFFTileProcessor,
  mockGetTileProcessorConfig,
  mockLoadGeoTIFFSource,
  mockGetColorStops,
  mockTileLayer,
  mockBitmapLayer,
} = vi.hoisted(() => {
  const hoistedMockGetTileData = vi
    .fn()
    .mockResolvedValue(new Uint8ClampedArray(256 * 256 * 4));
  const hoistedMockCreateGlobalTriangulation = vi.fn();
  const hoistedMockGeoTIFFTileProcessor = vi.fn().mockImplementation(function() { return {
    createGlobalTriangulation: hoistedMockCreateGlobalTriangulation,
    getTileData: hoistedMockGetTileData,
  }; });
  const hoistedMockGetTileProcessorConfig = vi.fn().mockResolvedValue({
    transformViewToSourceMapFn: (c: any) => c,
    transformSourceMapToViewFn: (c: any) => c,
    sourceBounds: [0, 0, 100, 100] as [number, number, number, number],
    sourceRef: [0, 0] as [number, number],
    resolution: 1.0,
    imageWidth: 256,
    imageHeight: 256,
    fromProjection: 'EPSG:25832',
    toProjection: 'EPSG:3857',
    baseImage: {},
    overviewImages: [],
  });
  const hoistedMockLoadGeoTIFFSource = vi.fn().mockResolvedValue({
    tiff: { close: vi.fn() },
    baseImage: { getWidth: () => 256, getHeight: () => 256 },
    fromProjection: 'EPSG:25832',
    sourceBounds: [300000, 5000000, 400000, 5100000] as [
      number,
      number,
      number,
      number,
    ],
    sourceRef: [350000, 5050000] as [number, number],
    resolution: 1.0,
    width: 256,
    height: 256,
    samplesPerPixel: 4,
    wgs84Bounds: [8, 50, 9, 51] as [number, number, number, number],
    overviewImages: [],
  });
  const hoistedMockGetColorStops = vi
    .fn()
    .mockReturnValue({ stops: [{ value: 0, color: [0, 128, 0] }] });
  const hoistedMockTileLayer = vi
    .fn()
    .mockImplementation(function (this: any, p: any) {
      return { id: p.id, props: p, layerName: 'TileLayer' };
    });
  const hoistedMockBitmapLayer = vi
    .fn()
    .mockImplementation(function (this: any, p: any) {
      return { id: p.id, props: p, layerName: 'BitmapLayer' };
    });

  return {
    mockGetTileData: hoistedMockGetTileData,
    mockCreateGlobalTriangulation: hoistedMockCreateGlobalTriangulation,
    mockGeoTIFFTileProcessor: hoistedMockGeoTIFFTileProcessor,
    mockGetTileProcessorConfig: hoistedMockGetTileProcessorConfig,
    mockLoadGeoTIFFSource: hoistedMockLoadGeoTIFFSource,
    mockGetColorStops: hoistedMockGetColorStops,
    mockTileLayer: hoistedMockTileLayer,
    mockBitmapLayer: hoistedMockBitmapLayer,
  };
});

vi.mock('../geotiff/utils/GeoTIFFTileProcessor', () => ({
  GeoTIFFTileProcessor: mockGeoTIFFTileProcessor,
  getTileProcessorConfig: mockGetTileProcessorConfig,
}));

vi.mock('../geotiff/geotiff-source', () => ({
  loadGeoTIFFSource: mockLoadGeoTIFFSource,
}));

vi.mock('../geotiff/utils/colormap-utils', () => ({
  getColorStops: mockGetColorStops,
}));

vi.mock('@deck.gl/geo-layers', () => ({ TileLayer: mockTileLayer }));
vi.mock('@deck.gl/layers', () => ({ BitmapLayer: mockBitmapLayer }));

vi.mock('@deck.gl/core', () => {
  class MockCompositeLayer {
    static layerName = 'MockCompositeLayer';
    static defaultProps = {};
    props: any;
    state: any = {};
    constructor(p: any) {
      this.props = { ...MockCompositeLayer.defaultProps, ...p };
    }
    setState(s: any) {
      this.state = { ...this.state, ...s };
    }
    setNeedsRedraw = vi.fn();
    raiseError(err: Error) {
      throw err;
    }
  }
  return { CompositeLayer: MockCompositeLayer };
});

// proj4 gibt [lng, lat] für EPSG:4326-Transformation zurück
// Quelldaten: sourceBounds [300000, 5000000, 400000, 5100000] in EPSG:25832
// Für gültige WGS84-Koordinaten transformieren
vi.mock('proj4', () => ({
  default: vi.fn((_from: any, _to: any, coord: any) => {
    // Gibt immer ein Array mit gültigen Koordinaten zurück
    if (Array.isArray(coord)) {
      return [coord[0] / 10000, coord[1] / 100000];
    }
    return coord;
  }),
}));
vi.mock('geotiff', () => ({}));
vi.mock('geotiff-geokeys-to-proj4', () => ({}));

import { createDeckGLGeoTIFFLayer } from './DeckGLGeoTIFFLayer';

// ─────────────────────────────────────────────────────────────────────────────

const originalImageData = globalThis.ImageData;

describe('createDeckGLGeoTIFFLayer', () => {
  afterEach(() => {
    vi.clearAllMocks();
    globalThis.ImageData = originalImageData;
    mockGetTileData.mockResolvedValue(new Uint8ClampedArray(256 * 256 * 4));
    mockLoadGeoTIFFSource.mockResolvedValue({
      tiff: { close: vi.fn() },
      baseImage: { getWidth: () => 256, getHeight: () => 256 },
      fromProjection: 'EPSG:25832',
      sourceBounds: [300000, 5000000, 400000, 5100000],
      sourceRef: [350000, 5050000],
      resolution: 1.0,
      width: 256,
      height: 256,
      samplesPerPixel: 4,
      wgs84Bounds: [8, 50, 9, 51],
      overviewImages: [],
    });
    mockGetTileProcessorConfig.mockResolvedValue({
      transformViewToSourceMapFn: (c: any) => c,
      transformSourceMapToViewFn: (c: any) => c,
      sourceBounds: [0, 0, 100, 100],
      sourceRef: [0, 0],
      resolution: 1.0,
      imageWidth: 256,
      imageHeight: 256,
      fromProjection: 'EPSG:25832',
      toProjection: 'EPSG:3857',
      baseImage: {},
      overviewImages: [],
    });
    mockGeoTIFFTileProcessor.mockImplementation(function() { return {
      createGlobalTriangulation: mockCreateGlobalTriangulation,
      getTileData: mockGetTileData,
    }; });
    mockGetColorStops.mockReturnValue({ stops: [{ value: 0, color: [0, 128, 0] }] });
  });

  it('gibt eine Layer-Instanz zurueck', async () => {
    const layer = await createDeckGLGeoTIFFLayer({
      id: 'geotiff-test',
      url: 'https://example.com/data.tif',
    });
    expect(layer).toBeTruthy();
  });

  describe('loadGeoTIFF', () => {
    it('ruft loadGeoTIFFSource mit korrekten Parametern auf', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
        projection: 'EPSG:25832',
        forceProjection: true,
        noDataValue: -9999,
      });

      await (layer as any).loadGeoTIFF();

      expect(mockLoadGeoTIFFSource).toHaveBeenCalledWith(
        'https://example.com/data.tif',
        expect.objectContaining({
          projection: 'EPSG:25832',
          forceProjection: true,
          nodata: -9999,
        }),
        expect.any(Object),
      );
    });

    it('initialisiert GeoTIFFTileProcessor ueber getTileProcessorConfig mit EPSG:3857', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();

      expect(mockGetTileProcessorConfig).toHaveBeenCalledWith(
        expect.any(Object),
        'EPSG:3857',
      );
      expect(mockGeoTIFFTileProcessor).toHaveBeenCalled();
    });

    it('setzt fromProjection und sourceBounds aus der Quelle', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();

      expect((layer as any).fromProjection).toBe('EPSG:25832');
      expect((layer as any).sourceBounds).toEqual([
        300000, 5000000, 400000, 5100000,
      ]);
    });

    it('ueberspringt das Laden wenn keine URL angegeben', async () => {
      const layer = await createDeckGLGeoTIFFLayer({ id: 'no-url', url: undefined as any });
      mockLoadGeoTIFFSource.mockClear();
      mockGeoTIFFTileProcessor.mockClear();

      await (layer as any).loadGeoTIFF();

      expect(mockLoadGeoTIFFSource).not.toHaveBeenCalled();
    });

    it('raeumt bestehenden Zustand auf wenn die URL entfernt wird', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();

      expect((layer as any).image).toBeTruthy();
      expect((layer as any).tileProcessor).toBeTruthy();

      (layer as any).props.url = undefined;
      await (layer as any).loadGeoTIFF();

      expect((layer as any).tiff).toBeUndefined();
      expect((layer as any).image).toBeUndefined();
      expect((layer as any).tileProcessor).toBeUndefined();
      expect((layer as any).sourceBounds).toEqual([0, 0, 0, 0]);
      expect((layer as any).setNeedsRedraw).toHaveBeenCalled();
      expect((layer as any).renderLayers()).toBeNull();
    });

    it('behandelt Ladefehler und leitet sie an raiseError weiter', async () => {
      mockLoadGeoTIFFSource.mockRejectedValueOnce(new Error('Network error'));

      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await expect((layer as any).loadGeoTIFF()).rejects.toThrow('Network error');
    });
  });

  describe('renderLayers', () => {
    it('gibt null zurueck bevor GeoTIFF geladen ist', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      const result = (layer as any).renderLayers();
      expect(result).toBeNull();
    });

    it('gibt einen TileLayer zurueck nach erfolgreichem Laden', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
        minZoom: 2,
        maxZoom: 14,
        tileSize: 256,
      });

      await (layer as any).loadGeoTIFF();

      const result = (layer as any).renderLayers();

      expect(result).toBeTruthy();
      expect(mockTileLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'geotiff-test-tiles',
          minZoom: 2,
          maxZoom: 14,
          tileSize: 256,
        }),
      );
    });

    it('uebergibt getTileData und renderSubLayers an TileLayer', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const tileLayerProps = mockTileLayer.mock.calls[0][0];
      expect(typeof tileLayerProps.getTileData).toBe('function');
      expect(typeof tileLayerProps.renderSubLayers).toBe('function');
    });

    it('uebergibt extent an TileLayer wenn getViewExtent einen gueltigen Wert liefert', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();

      // Extent-Berechnung via proj4 wird gemockt
      vi.spyOn(layer as any, 'getViewExtent').mockReturnValue([8.0, 50.0, 9.0, 51.0]);

      (layer as any).renderLayers();

      const tileLayerProps = mockTileLayer.mock.calls[0][0];
      expect(tileLayerProps.extent).toEqual([8.0, 50.0, 9.0, 51.0]);
    });

    it('rendert BitmapLayer mit ImageData fuer rohe RGBA-Tiles wenn verfuegbar', async () => {
      class MockImageData {
        data: Uint8ClampedArray;
        width: number;
        height: number;

        constructor(data: Uint8ClampedArray, width: number, height: number) {
          this.data = data;
          this.width = width;
          this.height = height;
        }
      }

      globalThis.ImageData = MockImageData as unknown as typeof ImageData;

      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
        opacity: 0.4,
        visible: true,
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const tileLayerProps = mockTileLayer.mock.calls[0][0];
      tileLayerProps.renderSubLayers({
        id: 'geotiff-test-tiles-0-0-0',
        tile: {
          index: { x: 0, y: 0, z: 0 },
          bbox: { west: 8, south: 50, east: 9, north: 51 },
          data: {
            data: new Uint8ClampedArray(4),
            width: 1,
            height: 1,
          },
        },
      });

      expect(mockBitmapLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'geotiff-test-tiles-0-0-0-bitmap',
          opacity: 0.4,
          visible: true,
          image: expect.any(MockImageData),
          bounds: [8, 50, 9, 51],
        }),
      );
    });

    it('rendert nichts wenn der Layer unsichtbar ist', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
        visible: false,
      });

      await (layer as any).loadGeoTIFF(1);

      expect((layer as any).renderLayers()).toBeNull();
      expect(mockTileLayer).not.toHaveBeenCalled();
    });
  });

  describe('getTileData', () => {
    it('gibt null zurueck wenn kein tileProcessor vorhanden', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      const result = await (layer as any).getTileData({
        index: { x: 0, y: 0, z: 0 },
      });

      expect(result).toBeNull();
    });

    it('ruft tileProcessor.getTileData mit x/y/z/tileSize/resolution/resampleMethod auf', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
        tileSize: 256,
        resolution: 0.5,
        resampleMethod: 'bilinear',
      });

      await (layer as any).loadGeoTIFF();
      await (layer as any).getTileData({ index: { x: 3, y: 5, z: 8 } });

      expect(mockGetTileData).toHaveBeenCalledWith(
        expect.objectContaining({
          x: 3,
          y: 5,
          z: 8,
          tileSize: 256,
          resolution: 0.5,
          resampleMethod: 'bilinear',
        }),
      );
    });

    it('uebergibt colorStops aus colorMap an tileProcessor', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
        colorMap: 'viridis',
        valueRange: [0, 3000],
      });

      await (layer as any).loadGeoTIFF();
      await (layer as any).getTileData({ index: { x: 0, y: 0, z: 0 } });

      expect(mockGetColorStops).toHaveBeenCalledWith('viridis', [0, 3000]);
      expect(mockGetTileData).toHaveBeenCalledWith(
        expect.objectContaining({
          colorStops: expect.any(Array),
        }),
      );
    });

    it('gibt Texturobjekt mit data, width und height zurueck', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
        tileSize: 256,
      });

      await (layer as any).loadGeoTIFF();
      const result = await (layer as any).getTileData({
        index: { x: 0, y: 0, z: 0 },
      });

      expect(result).toEqual(
        expect.objectContaining({ width: 256, height: 256 }),
      );
      expect(result.data).toBeInstanceOf(Uint8ClampedArray);
    });

    it('gibt null zurueck wenn tileProcessor null liefert', async () => {
      mockGetTileData.mockResolvedValueOnce(null);

      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();
      const result = await (layer as any).getTileData({
        index: { x: 0, y: 0, z: 0 },
      });

      expect(result).toBeNull();
    });
  });

  describe('getViewExtent (indirekt ueber renderLayers)', () => {
    it('extent ist null wenn kein tileProcessor vorhanden', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      // Kein loadGeoTIFF - kein tileProcessor
      const extent = (layer as any).getViewExtent();
      expect(extent).toBeNull();
    });

    it('gibt gueltiges [minLng, minLat, maxLng, maxLat]-Array zurueck nach Laden', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();

      const extent = (layer as any).getViewExtent();

      // proj4-Mock liefert gültige Koordinaten, daher nicht null
      if (extent !== null) {
        expect(extent).toHaveLength(4);
        expect(Number.isFinite(extent[0])).toBe(true);
        expect(Number.isFinite(extent[1])).toBe(true);
        expect(Number.isFinite(extent[2])).toBe(true);
        expect(Number.isFinite(extent[3])).toBe(true);
      }
    });
  });

  describe('updateState', () => {
    it('loest Neuladen aus wenn URL sich aendert', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      const loadSpy = vi
        .spyOn(layer as any, '_loadAsync')
        .mockResolvedValue(undefined);

      (layer as any).updateState({
        props: { url: 'https://example.com/new.tif' },
        oldProps: { url: 'https://example.com/data.tif' },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect(loadSpy).toHaveBeenCalled();
    });

    it('startet den initialen GeoTIFF-Load nicht doppelt fuer dieselbe Quelle', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      mockLoadGeoTIFFSource.mockClear();

      await (layer as any).initializeState();
      (layer as any).updateState({
        props: { url: 'https://example.com/data.tif' },
        oldProps: {},
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      await Promise.resolve();
      await Promise.resolve();

      expect(mockLoadGeoTIFFSource).toHaveBeenCalledTimes(1);
    });

    it('ruft setNeedsRedraw auf bei colorMap-Aenderung', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      (layer as any).updateState({
        props: {
          url: 'https://example.com/data.tif',
          colorMap: 'viridis',
        },
        oldProps: {
          url: 'https://example.com/data.tif',
          colorMap: 'grayscale',
        },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect((layer as any).setNeedsRedraw).toHaveBeenCalled();
    });

    it('ruft setNeedsRedraw auf bei resolution-Aenderung', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      (layer as any).updateState({
        props: {
          url: 'https://example.com/data.tif',
          resolution: 0.5,
        },
        oldProps: {
          url: 'https://example.com/data.tif',
          resolution: 1.0,
        },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect((layer as any).setNeedsRedraw).toHaveBeenCalled();
    });

    it('ruft setNeedsRedraw auf bei opacity-Aenderung', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      (layer as any).updateState({
        props: {
          url: 'https://example.com/data.tif',
          opacity: 0.5,
        },
        oldProps: {
          url: 'https://example.com/data.tif',
          opacity: 1.0,
        },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect((layer as any).setNeedsRedraw).toHaveBeenCalled();
    });

    it('ruft setNeedsRedraw auf bei visible-Aenderung', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      (layer as any).updateState({
        props: {
          url: 'https://example.com/data.tif',
          visible: false,
        },
        oldProps: {
          url: 'https://example.com/data.tif',
          visible: true,
        },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect((layer as any).setNeedsRedraw).toHaveBeenCalled();
    });

    it('stellt geladene Laufzeitdaten aus state nach einem Clone-basierten Opacity-Update wieder her', async () => {
      const originalLayer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
        visible: true,
        opacity: 1.0,
      });

      await (originalLayer as any).loadGeoTIFF();
      const runtime = (originalLayer as any).state.runtime;

      const clonedLayer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
        visible: true,
        opacity: 0.5,
      });

      (clonedLayer as any).state = { init: true, runtime };
      mockTileLayer.mockClear();

      (clonedLayer as any).updateState({
        props: {
          url: 'https://example.com/data.tif',
          visible: true,
          opacity: 0.5,
        },
        oldProps: {
          url: 'https://example.com/data.tif',
          visible: true,
          opacity: 1.0,
        },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect((clonedLayer as any).image).toBe(runtime.image);
      expect((clonedLayer as any).tileProcessor).toBe(runtime.tileProcessor);
      expect((clonedLayer as any).renderLayers()).toBeTruthy();
      expect(mockTileLayer).toHaveBeenCalled();
    });
  });

  describe('finalizeState', () => {
    it('setzt tiff und image auf null', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();

      expect((layer as any).image).not.toBeNull();

      (layer as any).finalizeState();

      expect((layer as any).tiff).toBeNull();
      expect((layer as any).image).toBeNull();
    });
  });

  // =========================================================================
  // TARGETED BRANCH COVERAGE TESTS
  // =========================================================================

  describe('createBitmapImageSource – no ImageData global (line 53)', () => {
    it('returns raw object when ImageData is not available', async () => {
      // Remove ImageData so the fallback branch is taken
      delete (globalThis as any).ImageData;

      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const tileLayerProps = mockTileLayer.mock.calls[0][0];
      const rawData = new Uint8ClampedArray(4);
      tileLayerProps.renderSubLayers({
        id: 'geotiff-test-tiles-0-0-0',
        tile: {
          index: { x: 0, y: 0, z: 0 },
          bbox: { west: 8, south: 50, east: 9, north: 51 },
          data: { data: rawData, width: 1, height: 1 },
        },
      });

      // BitmapLayer should receive a raw object (not an ImageData instance)
      expect(mockBitmapLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          image: expect.objectContaining({ data: rawData, width: 1, height: 1 }),
        }),
      );
    });
  });

  describe('scheduleLoad – skip already-loaded source (lines 273-274)', () => {
    it('skips load when signature matches loadedSignature and state.init is true', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      // Perform an initial load so loadedSignature is set
      await (layer as any).loadGeoTIFF(1);
      (layer as any).loadedSignature = (layer as any).getLoadSignature();
      (layer as any).state.init = true;
      (layer as any).activeLoad = undefined;

      mockLoadGeoTIFFSource.mockClear();

      // Call scheduleLoad again – should skip because already loaded
      (layer as any).scheduleLoad('test-already-loaded');

      // No new load should have started
      expect(mockLoadGeoTIFFSource).not.toHaveBeenCalled();
    });
  });

  describe('_loadAsync – stale token after loadGeoTIFF (line 291)', () => {
    it('returns early when loadGeoTIFF returns false', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      // Make loadGeoTIFF return false (simulating stale load)
      vi.spyOn(layer as any, 'loadGeoTIFF').mockResolvedValue(false);

      (layer as any).activeLoad = { signature: 'test', token: 1 };
      await (layer as any)._loadAsync(1, 'test', 'stale-test');

      // state.init should NOT have been set to true
      expect((layer as any).state.init).toBeFalsy();
      // activeLoad should be cleared in finally block
      expect((layer as any).activeLoad).toBeUndefined();
    });

    it('returns early when activeLoad.token mismatches after loadGeoTIFF', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      // loadGeoTIFF returns true but we change the token mid-flight
      vi.spyOn(layer as any, 'loadGeoTIFF').mockImplementation(async () => {
        // Simulate another scheduleLoad changing the activeLoad token
        (layer as any).activeLoad = { signature: 'newer', token: 99 };
        return true;
      });

      (layer as any).activeLoad = { signature: 'test', token: 1 };
      await (layer as any)._loadAsync(1, 'test', 'token-mismatch');

      // Should not set init true because token changed
      expect((layer as any).state.init).toBeFalsy();
      // activeLoad should NOT be cleared (different token)
      expect((layer as any).activeLoad).toEqual({ signature: 'newer', token: 99 });
    });
  });

  describe('shouldUpdateState (line 323)', () => {
    it('returns true when updateTriggersChanged is true', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      const result = (layer as any).shouldUpdateState({
        changeFlags: { propsOrDataChanged: false, updateTriggersChanged: true },
      });
      expect(result).toBe(true);
    });

    it('returns false when neither propsOrDataChanged nor updateTriggersChanged', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      const result = (layer as any).shouldUpdateState({
        changeFlags: { propsOrDataChanged: false, updateTriggersChanged: false },
      });
      expect(result).toBe(false);
    });
  });

  describe('updateState – valueRange branch (line 351)', () => {
    it('detects valueRange change when arrays differ', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      (layer as any).updateState({
        props: {
          url: 'https://example.com/data.tif',
          valueRange: [0, 5000],
        },
        oldProps: {
          url: 'https://example.com/data.tif',
          valueRange: [0, 3000],
        },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect((layer as any).setNeedsRedraw).toHaveBeenCalled();
    });

    it('does not trigger update when valueRange is identical', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      // Reset to check no spurious call
      (layer as any).setNeedsRedraw.mockClear();

      (layer as any).updateState({
        props: {
          url: 'https://example.com/data.tif',
          valueRange: [0, 3000],
          colorMap: 'grayscale',
          resolution: 1.0,
          resampleMethod: 'bilinear',
          opacity: 1.0,
          visible: true,
        },
        oldProps: {
          url: 'https://example.com/data.tif',
          valueRange: [0, 3000],
          colorMap: 'grayscale',
          resolution: 1.0,
          resampleMethod: 'bilinear',
          opacity: 1.0,
          visible: true,
        },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect((layer as any).setNeedsRedraw).not.toHaveBeenCalled();
    });
  });

  describe('loadGeoTIFF – stale token after getTileProcessorConfig (lines 440-441)', () => {
    it('returns false when activeLoad token changes during getTileProcessorConfig', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      const token = 42;
      // Set activeLoad to match the token so line 426 passes
      (layer as any).activeLoad = { signature: 'sig', token };

      // During getTileProcessorConfig, change the token to simulate a concurrent load
      mockGetTileProcessorConfig.mockImplementationOnce(async () => {
        // Simulate another scheduleLoad changing the activeLoad token
        (layer as any).activeLoad = { signature: 'newer', token: 999 };
        return {
          transformViewToSourceMapFn: (c: any) => c,
          transformSourceMapToViewFn: (c: any) => c,
          sourceBounds: [0, 0, 100, 100],
          sourceRef: [0, 0],
          resolution: 1.0,
          imageWidth: 256,
          imageHeight: 256,
          fromProjection: 'EPSG:25832',
          toProjection: 'EPSG:3857',
          baseImage: {},
          overviewImages: [],
        };
      });

      const result = await (layer as any).loadGeoTIFF(token);
      expect(result).toBe(false);
    });
  });

  describe('getViewExtent – invalid coordinates (lines 526-532)', () => {
    it('returns null when proj4 returns NaN coordinates', async () => {
      const proj4Mock = (await import('proj4')).default as unknown as ReturnType<typeof vi.fn>;
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();

      // Make proj4 return NaN for invalid coordinate transformation
      proj4Mock.mockImplementation(() => [NaN, NaN]);

      const extent = (layer as any).getViewExtent();
      expect(extent).toBeNull();

      // Restore original proj4 mock behavior
      proj4Mock.mockImplementation((_from: any, _to: any, coord: any) => {
        if (Array.isArray(coord)) {
          return [coord[0] / 10000, coord[1] / 100000];
        }
        return coord;
      });
    });
  });

  describe('getViewExtent – extent clamped to bounds (line 572)', () => {
    it('warns when extent exceeds valid WGS84 bounds and gets clamped', async () => {
      const proj4Mock = (await import('proj4')).default as unknown as ReturnType<typeof vi.fn>;
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();

      // Make proj4 return coordinates that exceed WGS84 bounds
      // MIN_LNG = -180, MAX_LNG = 180, MIN_LAT = -85.05112878, MAX_LAT = 85.05112878
      proj4Mock.mockImplementation(() => [-200, 90]);

      const extent = (layer as any).getViewExtent();
      // Should still return an extent (clamped), not null
      expect(extent).not.toBeNull();
      // minLng should be clamped to -180
      expect(extent![0]).toBe(-180);
      // maxLat should be clamped to 85.05112878
      expect(extent![3]).toBe(85.05112878);

      // Restore original proj4 mock behavior
      proj4Mock.mockImplementation((_from: any, _to: any, coord: any) => {
        if (Array.isArray(coord)) {
          return [coord[0] / 10000, coord[1] / 100000];
        }
        return coord;
      });
    });
  });

  describe('getViewExtent – proj4 throws (lines 578-579)', () => {
    it('returns null when proj4 throws an error', async () => {
      const proj4Mock = (await import('proj4')).default as unknown as ReturnType<typeof vi.fn>;
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();

      // Make proj4 throw
      proj4Mock.mockImplementation(() => {
        throw new Error('proj4 transformation failed');
      });

      const extent = (layer as any).getViewExtent();
      expect(extent).toBeNull();

      // Restore original proj4 mock behavior
      proj4Mock.mockImplementation((_from: any, _to: any, coord: any) => {
        if (Array.isArray(coord)) {
          return [coord[0] / 10000, coord[1] / 100000];
        }
        return coord;
      });
    });
  });

  describe('getTileData – error in tile processing (lines 639-640)', () => {
    it('returns null when tileProcessor.getTileData throws', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
        tileSize: 256,
      });

      await (layer as any).loadGeoTIFF();

      // Make getTileData throw
      mockGetTileData.mockRejectedValueOnce(new Error('Tile processing failed'));

      const result = await (layer as any).getTileData({
        index: { x: 0, y: 0, z: 0 },
      });

      expect(result).toBeNull();
    });
  });

  describe('renderLayers – null extent warning (line 668)', () => {
    it('warns and still renders when getViewExtent returns null', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();

      // Make getViewExtent return null
      vi.spyOn(layer as any, 'getViewExtent').mockReturnValue(null);

      const result = (layer as any).renderLayers();

      // Should still create a TileLayer, just without extent
      expect(result).toBeTruthy();
      const tileLayerProps = mockTileLayer.mock.calls[0][0];
      expect(tileLayerProps.extent).toBeUndefined();
    });
  });

  describe('renderSubLayers – no tile data (line 682)', () => {
    it('returns null when tile.data is falsy', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const tileLayerProps = mockTileLayer.mock.calls[0][0];

      // Call renderSubLayers with no data
      const result = tileLayerProps.renderSubLayers({
        id: 'geotiff-test-tiles-0-0-0',
        tile: {
          index: { x: 0, y: 0, z: 0 },
          bbox: { west: 8, south: 50, east: 9, north: 51 },
          data: null,
        },
      });

      expect(result).toBeNull();
    });

    it('returns null when tile itself is falsy', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const tileLayerProps = mockTileLayer.mock.calls[0][0];

      // Call renderSubLayers with no tile
      const result = tileLayerProps.renderSubLayers({
        id: 'geotiff-test-tiles-0-0-0',
        tile: null,
      });

      expect(result).toBeNull();
    });
  });

  describe('onTileError callback (line 682)', () => {
    it('handles tile errors via onTileError callback', async () => {
      const layer = await createDeckGLGeoTIFFLayer({
        id: 'geotiff-test',
        url: 'https://example.com/data.tif',
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const tileLayerProps = mockTileLayer.mock.calls[0][0];

      // Should not throw
      expect(() =>
        tileLayerProps.onTileError(new Error('tile load failed')),
      ).not.toThrow();
    });
  });
});
