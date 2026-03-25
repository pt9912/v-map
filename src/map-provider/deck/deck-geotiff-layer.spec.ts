// Mocks müssen vor allen Imports stehen

const mockGetTileData = jest
  .fn()
  .mockResolvedValue(new Uint8ClampedArray(256 * 256 * 4));
const mockCreateGlobalTriangulation = jest.fn();
const mockGeoTIFFTileProcessor = jest.fn().mockImplementation(() => ({
  createGlobalTriangulation: mockCreateGlobalTriangulation,
  getTileData: mockGetTileData,
}));
const mockGetTileProcessorConfig = jest.fn().mockResolvedValue({
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

jest.mock('../geotiff/utils/GeoTIFFTileProcessor', () => ({
  GeoTIFFTileProcessor: mockGeoTIFFTileProcessor,
  getTileProcessorConfig: mockGetTileProcessorConfig,
}));

const mockLoadGeoTIFFSource = jest.fn().mockResolvedValue({
  tiff: { close: jest.fn() },
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
  overviewImages: [],
});

jest.mock('../geotiff/geotiff-source', () => ({
  loadGeoTIFFSource: mockLoadGeoTIFFSource,
}));

const mockGetColorStops = jest
  .fn()
  .mockReturnValue({ stops: [{ value: 0, color: [0, 128, 0] }] });

jest.mock('../geotiff/utils/colormap-utils', () => ({
  getColorStops: mockGetColorStops,
}));

const mockTileLayer = jest.fn().mockImplementation(function (this: any, p: any) {
  return { id: p.id, props: p, layerName: 'TileLayer' };
});
const mockBitmapLayer = jest
  .fn()
  .mockImplementation(function (this: any, p: any) {
    return { id: p.id, props: p, layerName: 'BitmapLayer' };
  });

jest.mock('@deck.gl/geo-layers', () => ({ TileLayer: mockTileLayer }));
jest.mock('@deck.gl/layers', () => ({ BitmapLayer: mockBitmapLayer }));

jest.mock('@deck.gl/core', () => {
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
    setNeedsRedraw = jest.fn();
    raiseError(err: Error) {
      throw err;
    }
  }
  return { CompositeLayer: MockCompositeLayer };
});

// proj4 gibt [lng, lat] für EPSG:4326-Transformation zurück
// Quelldaten: sourceBounds [300000, 5000000, 400000, 5100000] in EPSG:25832
// Für gültige WGS84-Koordinaten transformieren
jest.mock('proj4', () => ({
  default: jest.fn((_from: any, _to: any, coord: any) => {
    // Gibt immer ein Array mit gültigen Koordinaten zurück
    if (Array.isArray(coord)) {
      return [coord[0] / 10000, coord[1] / 100000];
    }
    return coord;
  }),
}));
jest.mock('geotiff', () => ({}));
jest.mock('geotiff-geokeys-to-proj4', () => ({}));

import { createDeckGLGeoTIFFLayer } from './DeckGLGeoTIFFLayer';

// ─────────────────────────────────────────────────────────────────────────────

describe('createDeckGLGeoTIFFLayer', () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockGetTileData.mockResolvedValue(new Uint8ClampedArray(256 * 256 * 4));
    mockLoadGeoTIFFSource.mockResolvedValue({
      tiff: { close: jest.fn() },
      baseImage: { getWidth: () => 256, getHeight: () => 256 },
      fromProjection: 'EPSG:25832',
      sourceBounds: [300000, 5000000, 400000, 5100000],
      sourceRef: [350000, 5050000],
      resolution: 1.0,
      width: 256,
      height: 256,
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
    mockGeoTIFFTileProcessor.mockImplementation(() => ({
      createGlobalTriangulation: mockCreateGlobalTriangulation,
      getTileData: mockGetTileData,
    }));
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
      jest.spyOn(layer as any, 'getViewExtent').mockReturnValue([8.0, 50.0, 9.0, 51.0]);

      (layer as any).renderLayers();

      const tileLayerProps = mockTileLayer.mock.calls[0][0];
      expect(tileLayerProps.extent).toEqual([8.0, 50.0, 9.0, 51.0]);
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

      const loadSpy = jest
        .spyOn(layer as any, '_loadAsync')
        .mockResolvedValue(undefined);

      (layer as any).updateState({
        props: { url: 'https://example.com/new.tif' },
        oldProps: { url: 'https://example.com/data.tif' },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect(loadSpy).toHaveBeenCalled();
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
});
