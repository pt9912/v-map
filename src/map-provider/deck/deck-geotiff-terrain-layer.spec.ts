import { vi } from 'vitest';

// Mocks müssen vor allen Imports stehen
const {
  mockCreateGlobalTriangulation,
  mockGetTileData,
  mockGetElevationData,
  mockGeoTIFFTileProcessor,
  mockGetTileProcessorConfig,
  mockLoadGeoTIFFSource,
  mockGetColorStops,
  mockTileLayer,
  mockBitmapLayer,
  mockSimpleMeshLayer,
  mockGetMesh,
  mockCreateTile,
  MockMartini,
} = vi.hoisted(() => {
  const hoistedMockCreateGlobalTriangulation = vi.fn();
  const hoistedMockGetTileData = vi
    .fn()
    .mockResolvedValue(new Uint8ClampedArray(256 * 256 * 4));
  const hoistedMockGetElevationData = vi
    .fn()
    .mockResolvedValue(new Float32Array(257 * 257));
  const hoistedMockGeoTIFFTileProcessor = vi.fn().mockImplementation(function() { return {
    createGlobalTriangulation: hoistedMockCreateGlobalTriangulation,
    getTileData: hoistedMockGetTileData,
    getElevationData: hoistedMockGetElevationData,
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
  const hoistedMockSimpleMeshLayer = vi
    .fn()
    .mockImplementation(function (this: any, p: any) {
      return { id: p.id, props: p, layerName: 'SimpleMeshLayer' };
    });
  const hoistedMockGetMesh = vi.fn().mockReturnValue({
    vertices: new Uint16Array([0, 0, 256, 0, 0, 256, 256, 256]),
    triangles: new Uint32Array([0, 1, 2, 1, 3, 2]),
  });
  const hoistedMockCreateTile = vi
    .fn()
    .mockReturnValue({ getMesh: hoistedMockGetMesh });
  const hoistedMockMartini = vi
    .fn()
    .mockImplementation(function() { return { createTile: hoistedMockCreateTile }; });

  return {
    mockCreateGlobalTriangulation: hoistedMockCreateGlobalTriangulation,
    mockGetTileData: hoistedMockGetTileData,
    mockGetElevationData: hoistedMockGetElevationData,
    mockGeoTIFFTileProcessor: hoistedMockGeoTIFFTileProcessor,
    mockGetTileProcessorConfig: hoistedMockGetTileProcessorConfig,
    mockLoadGeoTIFFSource: hoistedMockLoadGeoTIFFSource,
    mockGetColorStops: hoistedMockGetColorStops,
    mockTileLayer: hoistedMockTileLayer,
    mockBitmapLayer: hoistedMockBitmapLayer,
    mockSimpleMeshLayer: hoistedMockSimpleMeshLayer,
    mockGetMesh: hoistedMockGetMesh,
    mockCreateTile: hoistedMockCreateTile,
    MockMartini: hoistedMockMartini,
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
vi.mock('@deck.gl/mesh-layers', () => ({ SimpleMeshLayer: mockSimpleMeshLayer }));
vi.mock('@mapbox/martini', () => ({ default: MockMartini }));

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
    setNeedsRedraw = jest.fn();
    raiseError(err: Error) {
      throw err;
    }
  }
  return { CompositeLayer: MockCompositeLayer };
});

vi.mock('proj4', () => ({
  default: jest.fn((_from: any, _to: any, c: any) => c),
}));
vi.mock('geotiff', () => ({}));
vi.mock('geotiff-geokeys-to-proj4', () => ({}));

import { createDeckGLGeoTIFFTerrainLayer } from './DeckGLGeoTIFFTerrainLayer';

// ─────────────────────────────────────────────────────────────────────────────

describe('createDeckGLGeoTIFFTerrainLayer', () => {
  const defaultElevationData = new Float32Array(257 * 257);

  afterEach(() => {
    jest.clearAllMocks();
    mockGetTileData.mockResolvedValue(new Uint8ClampedArray(256 * 256 * 4));
    mockGetElevationData.mockResolvedValue(defaultElevationData);
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
    mockGeoTIFFTileProcessor.mockImplementation(function() { return {
      createGlobalTriangulation: mockCreateGlobalTriangulation,
      getTileData: mockGetTileData,
      getElevationData: mockGetElevationData,
    }; });
    mockGetColorStops.mockReturnValue({ stops: [{ value: 0, color: [0, 128, 0] }] });
    mockGetMesh.mockReturnValue({
      vertices: new Uint16Array([0, 0, 256, 0, 0, 256, 256, 256]),
      triangles: new Uint32Array([0, 1, 2, 1, 3, 2]),
    });
    mockCreateTile.mockReturnValue({ getMesh: mockGetMesh });
    MockMartini.mockImplementation(function() { return { createTile: mockCreateTile }; });
  });

  it('gibt eine Layer-Instanz zurück', async () => {
    const layer = await createDeckGLGeoTIFFTerrainLayer({
      id: 'terrain-test',
      url: 'https://example.com/dem.tif',
    });
    expect(layer).toBeTruthy();
  });

  describe('loadGeoTIFF', () => {
    it('ruft loadGeoTIFFSource mit korrekten Parametern auf', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        projection: 'EPSG:25832',
        forceProjection: true,
        noDataValue: -9999,
      });

      await (layer as any).loadGeoTIFF();

      expect(mockLoadGeoTIFFSource).toHaveBeenCalledWith(
        'https://example.com/dem.tif',
        expect.objectContaining({
          projection: 'EPSG:25832',
          forceProjection: true,
          nodata: -9999,
        }),
        expect.any(Object),
      );
    });

    it('initialisiert GeoTIFFTileProcessor über getTileProcessorConfig', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      await (layer as any).loadGeoTIFF();

      expect(mockGetTileProcessorConfig).toHaveBeenCalledWith(
        expect.any(Object),
        'EPSG:3857',
      );
      expect(mockGeoTIFFTileProcessor).toHaveBeenCalled();
      expect(mockCreateGlobalTriangulation).toHaveBeenCalled();
    });

    it('setzt fromProjection und sourceBounds aus der Quelle', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      await (layer as any).loadGeoTIFF();

      expect((layer as any).fromProjection).toBe('EPSG:25832');
      expect((layer as any).sourceBounds).toEqual([
        300000, 5000000, 400000, 5100000,
      ]);
    });

    it('überspringt das Laden wenn keine URL angegeben', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({ id: 'no-url' });

      await (layer as any).loadGeoTIFF();

      expect(mockLoadGeoTIFFSource).not.toHaveBeenCalled();
      expect(mockGeoTIFFTileProcessor).not.toHaveBeenCalled();
    });

    it('behandelt Fehler beim Laden und wirft raiseError', async () => {
      mockLoadGeoTIFFSource.mockRejectedValueOnce(new Error('Network error'));

      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      await expect((layer as any).loadGeoTIFF()).rejects.toThrow('Network error');
    });
  });

  describe('renderLayers', () => {
    it('gibt null zurück bevor GeoTIFF geladen ist', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      const result = (layer as any).renderLayers();
      expect(result).toBeNull();
    });

    it('gibt einen TileLayer zurück nach erfolgreichem Laden', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        minZoom: 2,
        maxZoom: 14,
        tileSize: 256,
      });

      await (layer as any).loadGeoTIFF();

      const result = (layer as any).renderLayers();

      expect(result).toBeTruthy();
      expect(mockTileLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'terrain-test-tiles',
          minZoom: 2,
          maxZoom: 14,
          tileSize: 256,
        }),
      );
    });

    it('übergibt getTileData und renderSubLayers an TileLayer', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const tileLayerProps = mockTileLayer.mock.calls[0][0];
      expect(typeof tileLayerProps.getTileData).toBe('function');
      expect(typeof tileLayerProps.renderSubLayers).toBe('function');
    });

    it('übergibt extent an TileLayer wenn getViewExtent einen gültigen Wert liefert', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      await (layer as any).loadGeoTIFF();

      jest.spyOn(layer as any, 'getViewExtent').mockReturnValue([8.0, 50.0, 9.0, 51.0]);

      (layer as any).renderLayers();

      const tileLayerProps = mockTileLayer.mock.calls[0][0];
      expect(tileLayerProps.extent).toEqual([8.0, 50.0, 9.0, 51.0]);
    });

    it('gibt null zurück wenn der Layer unsichtbar ist', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        visible: false,
      });

      await (layer as any).loadGeoTIFF();

      const result = (layer as any).renderLayers();
      expect(result).toBeNull();
    });
  });

  describe('getTileData — terrain-Modus (Standard)', () => {
    it('gibt null zurück wenn kein tileProcessor vorhanden', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      const result = await (layer as any).getTileData({
        index: { x: 0, y: 0, z: 0 },
      });

      expect(result).toBeNull();
    });

    it('ruft getElevationData mit korrekten Parametern auf', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        tileSize: 256,
      });

      await (layer as any).loadGeoTIFF();

      await (layer as any).getTileData({ index: { x: 3, y: 5, z: 8 } });

      expect(mockGetElevationData).toHaveBeenCalledWith(
        expect.objectContaining({ x: 3, y: 5, z: 8, tileSize: 256 }),
      );
    });

    it('gibt elevationData und gridSize zurück', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        tileSize: 256,
      });

      await (layer as any).loadGeoTIFF();
      const result = await (layer as any).getTileData({
        index: { x: 0, y: 0, z: 0 },
      });

      expect(result).toEqual(
        expect.objectContaining({
          elevationData: expect.any(Float32Array),
          gridSize: 257,
        }),
      );
    });

    it('gibt null zurück wenn getElevationData null liefert', async () => {
      mockGetElevationData.mockResolvedValueOnce(null);

      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      await (layer as any).loadGeoTIFF();
      const result = await (layer as any).getTileData({
        index: { x: 0, y: 0, z: 0 },
      });

      expect(result).toBeNull();
    });
  });

  describe('getTileData — colormap-Modus', () => {
    it('ruft getTileData des Processors auf (nicht getElevationData)', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        renderMode: 'colormap',
        tileSize: 256,
        colorMap: 'viridis',
        valueRange: [0, 3000],
      });

      await (layer as any).loadGeoTIFF();
      await (layer as any).getTileData({ index: { x: 0, y: 0, z: 0 } });

      expect(mockGetTileData).toHaveBeenCalledWith(
        expect.objectContaining({ x: 0, y: 0, z: 0, tileSize: 256 }),
      );
      expect(mockGetElevationData).not.toHaveBeenCalled();
    });

    it('übergibt colorStops aus colorMap an tileProcessor', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        renderMode: 'colormap',
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

    it('gibt Texturobjekt mit korrekten Dimensionen zurück', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        renderMode: 'colormap',
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

    it('rendert BitmapLayer mit opacity und visible aus den Layer-Props', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        renderMode: 'colormap',
        opacity: 0.4,
        visible: true,
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const renderSubLayers = mockTileLayer.mock.calls[0][0].renderSubLayers;
      renderSubLayers({
        id: 'tile-0',
        tile: {
          data: {
            data: new Uint8ClampedArray(256 * 256 * 4),
            width: 256,
            height: 256,
          },
          bbox: { west: 8.0, south: 51.0, east: 9.0, north: 52.0 },
        },
      });

      expect(mockBitmapLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          opacity: 0.4,
          visible: true,
        }),
      );
    });
  });

  describe('renderSubLayers — terrain-Modus', () => {
    it('gibt null zurück wenn keine Tile-Daten vorhanden', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        renderMode: 'terrain',
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const renderSubLayers = mockTileLayer.mock.calls[0][0].renderSubLayers;
      const result = renderSubLayers({ tile: { data: null, bbox: {} } });
      expect(result).toBeNull();
    });

    it('verwendet Martini für Mesh-Generierung', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        renderMode: 'terrain',
        tileSize: 256,
        meshMaxError: 2.0,
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const renderSubLayers = mockTileLayer.mock.calls[0][0].renderSubLayers;
      const elevationData = new Float32Array(257 * 257);
      renderSubLayers({
        id: 'tile-0',
        tile: {
          data: { elevationData, gridSize: 257 },
          bbox: { west: 8.0, south: 51.0, east: 9.0, north: 52.0 },
        },
      });

      expect(MockMartini).toHaveBeenCalledWith(257);
      expect(mockCreateTile).toHaveBeenCalledWith(elevationData);
      expect(mockGetMesh).toHaveBeenCalledWith(2.0);
    });

    it('rendert SimpleMeshLayer mit korrekten Props', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        renderMode: 'terrain',
        color: [255, 0, 0],
        wireframe: true,
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const renderSubLayers = mockTileLayer.mock.calls[0][0].renderSubLayers;
      renderSubLayers({
        id: 'tile-0',
        tile: {
          data: { elevationData: new Float32Array(257 * 257), gridSize: 257 },
          bbox: { west: 8.0, south: 51.0, east: 9.0, north: 52.0 },
        },
      });

      expect(mockSimpleMeshLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          getColor: [255, 0, 0],
          wireframe: true,
        }),
      );
    });

    it('setzt Texture-URLs mit Tile-Platzhaltern auf dem Mesh-Layer auf', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        renderMode: 'terrain',
        texture: 'https://tiles.example.com/{z}/{x}/{y}.png',
        opacity: 0.6,
        visible: true,
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const renderSubLayers = mockTileLayer.mock.calls[0][0].renderSubLayers;
      renderSubLayers({
        id: 'tile-0',
        tile: {
          index: { x: 3, y: 4, z: 5 },
          data: { elevationData: new Float32Array(257 * 257), gridSize: 257 },
          bbox: { west: 8.0, south: 51.0, east: 9.0, north: 52.0 },
        },
      });

      expect(mockSimpleMeshLayer).toHaveBeenCalledWith(
        expect.objectContaining({
          texture: 'https://tiles.example.com/5/3/4.png',
          getColor: [255, 255, 255],
          opacity: 0.6,
          visible: true,
        }),
      );
    });

    it('berechnet Vertex-Positionen in LNGLAT-Koordinaten', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        renderMode: 'terrain',
        elevationScale: 2.0,
      });

      await (layer as any).loadGeoTIFF();
      (layer as any).renderLayers();

      const renderSubLayers = mockTileLayer.mock.calls[0][0].renderSubLayers;

      // Simple 4-vertex elevation field: corners of a 257x257 grid
      const elevationData = new Float32Array(257 * 257);
      elevationData[0] = 100; // top-left vertex (px=0, py=0)

      renderSubLayers({
        id: 'tile-0',
        tile: {
          data: { elevationData, gridSize: 257 },
          bbox: { west: 10.0, south: 50.0, east: 11.0, north: 51.0 },
        },
      });

      const meshArg = mockSimpleMeshLayer.mock.calls[0][0].mesh;
      const positions = meshArg.attributes.POSITION.value;

      // First vertex (px=0, py=0): lon=west=10, lat=north=51, elev=100*2=200
      expect(positions[0]).toBeCloseTo(10.0); // west
      expect(positions[1]).toBeCloseTo(51.0); // north
      expect(positions[2]).toBeCloseTo(200.0); // elevation * scale
    });
  });

  describe('updateState', () => {
    it('löst Neuladen aus wenn URL sich ändert', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      const loadSpy = jest
        .spyOn(layer as any, '_loadAsync')
        .mockResolvedValue(undefined);

      (layer as any).updateState({
        props: { url: 'https://example.com/new.tif' },
        oldProps: { url: 'https://example.com/dem.tif' },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect(loadSpy).toHaveBeenCalled();
    });

    it('startet den initialen Terrain-GeoTIFF-Load nicht doppelt fuer dieselbe Quelle', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      mockLoadGeoTIFFSource.mockClear();

      await (layer as any).initializeState();
      (layer as any).updateState({
        props: { url: 'https://example.com/dem.tif' },
        oldProps: {},
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      await Promise.resolve();
      await Promise.resolve();

      expect(mockLoadGeoTIFFSource).toHaveBeenCalledTimes(1);
    });

    it('ruft setNeedsRedraw auf bei renderMode-Änderung', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      (layer as any).updateState({
        props: { url: 'https://example.com/dem.tif', renderMode: 'colormap' },
        oldProps: { url: 'https://example.com/dem.tif', renderMode: 'terrain' },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect((layer as any).setNeedsRedraw).toHaveBeenCalled();
    });

    it('ruft setNeedsRedraw auf bei wireframe-Änderung', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      (layer as any).updateState({
        props: { url: 'https://example.com/dem.tif', wireframe: true },
        oldProps: { url: 'https://example.com/dem.tif', wireframe: false },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect((layer as any).setNeedsRedraw).toHaveBeenCalled();
    });

    it('ruft setNeedsRedraw auf bei opacity-Änderung', async () => {
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      (layer as any).updateState({
        props: { url: 'https://example.com/dem.tif', opacity: 0.5 },
        oldProps: { url: 'https://example.com/dem.tif', opacity: 1.0 },
        changeFlags: { dataChanged: false, updateTriggersChanged: false },
      });

      expect((layer as any).setNeedsRedraw).toHaveBeenCalled();
    });

    it('stellt geladene Laufzeitdaten aus state nach einem Clone-basierten Opacity-Update wieder her', async () => {
      const originalLayer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        renderMode: 'colormap',
        visible: true,
        opacity: 1.0,
      });

      await (originalLayer as any).loadGeoTIFF();
      const runtime = (originalLayer as any).state.runtime;

      const clonedLayer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
        renderMode: 'colormap',
        visible: true,
        opacity: 0.5,
      });

      (clonedLayer as any).state = { init: true, runtime };
      mockTileLayer.mockClear();

      (clonedLayer as any).updateState({
        props: {
          url: 'https://example.com/dem.tif',
          renderMode: 'colormap',
          visible: true,
          opacity: 0.5,
        },
        oldProps: {
          url: 'https://example.com/dem.tif',
          renderMode: 'colormap',
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
      const layer = await createDeckGLGeoTIFFTerrainLayer({
        id: 'terrain-test',
        url: 'https://example.com/dem.tif',
      });

      await (layer as any).loadGeoTIFF();

      expect((layer as any).image).not.toBeNull();

      (layer as any).finalizeState();

      expect((layer as any).tiff).toBeNull();
      expect((layer as any).image).toBeNull();
    });
  });
});
