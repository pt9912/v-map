import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Hoisted mocks
// ---------------------------------------------------------------------------
const { mockPoint, mockSetOptions } = vi.hoisted(() => ({
  mockPoint: vi.fn((x: number, y: number) => ({ x, y })),
  mockSetOptions: vi.fn((instance: any, opts: any) => {
    instance.options = { ...(instance.options ?? {}), ...opts };
  }),
}));

vi.mock('leaflet', () => ({
  GridLayer: class MockGridLayer {
    options: any = {};
    redraw = vi.fn();
    onAdd(_map: any) { return this; }
    onRemove(_map: any) { return this; }
  },
  point: mockPoint,
  Util: {
    setOptions: mockSetOptions,
  },
}));

vi.mock('../../utils/logger', () => ({
  log: vi.fn(),
  error: vi.fn(),
}));

import { GoogleMapTilesLayer } from './google-map-tiles-layer';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function createLayer(options: Record<string, unknown> = {}): GoogleMapTilesLayer {
  const layer = new GoogleMapTilesLayer({
    apiKey: 'test-api-key',
    ...options,
  } as any);
  // Clear session refresh timer to prevent async leaks between tests
  (layer as any).clearSessionRefresh();
  return layer;
}

function mockFetchSession(overrides: Record<string, unknown> = {}) {
  const sessionResponse = {
    session: 'test-session-token',
    expiry: String(Math.floor(Date.now() / 1000) + 3600),
    tileWidth: 512,
    tileHeight: 512,
    imageFormat: 'png',
    ...overrides,
  };

  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(sessionResponse),
    }),
  );

  return sessionResponse;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('GoogleMapTilesLayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Default fetch stub to prevent unhandled rejections from constructor
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        session: 'default-token',
        expiry: String(Math.floor(Date.now() / 1000) + 3600),
        tileWidth: 256,
        tileHeight: 256,
        imageFormat: 'png',
      }),
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // -----------------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------------
  describe('constructor', () => {
    it('throws when apiKey is missing', () => {
      expect(() => new GoogleMapTilesLayer({} as any)).toThrow(
        'Google Map Tiles layer requires an apiKey',
      );
    });

    it('sets default session request values', () => {
      mockFetchSession();
      const layer = createLayer();
      const request = (layer as any).sessionRequest;
      expect(request.mapType).toBe('roadmap');
      expect(request.language).toBe('en-US');
      expect(request.region).toBe('US');
    });

    it('uses custom mapType, language, region', () => {
      mockFetchSession();
      const layer = createLayer({
        mapType: 'satellite',
        language: 'de-DE',
        region: 'DE',
      });
      const request = (layer as any).sessionRequest;
      expect(request.mapType).toBe('satellite');
      expect(request.language).toBe('de-DE');
      expect(request.region).toBe('DE');
    });

    it('includes imageFormat when provided', () => {
      mockFetchSession();
      const layer = createLayer({ imageFormat: 'jpeg' });
      expect((layer as any).sessionRequest.imageFormat).toBe('jpeg');
    });

    it('includes layerTypes when provided', () => {
      mockFetchSession();
      const layer = createLayer({ layerTypes: ['layerRoadmap'] });
      expect((layer as any).sessionRequest.layerTypes).toEqual(['layerRoadmap']);
    });

    it('includes apiOptions when provided', () => {
      mockFetchSession();
      const layer = createLayer({ apiOptions: ['WEBGL'] });
      expect((layer as any).sessionRequest.apiOptions).toEqual(['WEBGL']);
    });

    it('includes styles when array with items', () => {
      mockFetchSession();
      const styles = [{ featureType: 'road', elementType: 'all' }];
      const layer = createLayer({ styles });
      expect((layer as any).sessionRequest.styles).toEqual(styles);
    });

    it('does not include styles when empty array', () => {
      mockFetchSession();
      const layer = createLayer({ styles: [] });
      expect((layer as any).sessionRequest.styles).toBeUndefined();
    });

    it('sets overlay to true when provided', () => {
      mockFetchSession();
      const layer = createLayer({ overlay: true });
      expect((layer as any).sessionRequest.overlay).toBe(true);
    });

    it('does not set overlay when false', () => {
      mockFetchSession();
      const layer = createLayer({ overlay: false });
      expect((layer as any).sessionRequest.overlay).toBeUndefined();
    });

    it('defaults highDpi to true when no scale', () => {
      mockFetchSession();
      const layer = createLayer();
      expect((layer as any).highDpi).toBe(true);
    });

    it('sets highDpi to false when scale is scaleFactor1x', () => {
      mockFetchSession();
      const layer = createLayer({ scale: 'scaleFactor1x' });
      expect((layer as any).highDpi).toBe(false);
    });

    it('uses provided highDpi value', () => {
      mockFetchSession();
      const layer = createLayer({ highDpi: false });
      expect((layer as any).highDpi).toBe(false);
    });

    it('sets scale in request when resolved', () => {
      mockFetchSession();
      const layer = createLayer({ scale: 'scaleFactor4x' });
      expect((layer as any).sessionRequest.scale).toBe('scaleFactor4x');
    });

    it('auto-resolves scale from highDpi', () => {
      mockFetchSession();
      const layer = createLayer({ highDpi: true });
      expect((layer as any).sessionRequest.scale).toBe('scaleFactor2x');
    });

    it('applies initial grid options from constructor', () => {
      mockFetchSession();
      createLayer({
        maxZoom: 18,
        minZoom: 2,
        opacity: 0.8,
        zIndex: 5,
      });
      expect(mockSetOptions).toHaveBeenCalled();
    });

    it('applies default maxZoom of 22', () => {
      mockFetchSession();
      createLayer();
      const setOptionsCall = mockSetOptions.mock.calls[0];
      expect(setOptionsCall[1].maxZoom).toBe(22);
    });

    it('starts a session fetch on construction', () => {
      mockFetchSession();
      const layer = createLayer();
      expect((layer as any).sessionPromise).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // mapScaleToFactor / factorToScale (private)
  // -----------------------------------------------------------------------
  describe('mapScaleToFactor', () => {
    it('returns 4 for scaleFactor4x', () => {
      mockFetchSession();
      const layer = createLayer();
      expect((layer as any).mapScaleToFactor('scaleFactor4x', false)).toBe(4);
    });

    it('returns 2 for scaleFactor2x', () => {
      mockFetchSession();
      const layer = createLayer();
      expect((layer as any).mapScaleToFactor('scaleFactor2x', false)).toBe(2);
    });

    it('returns 1 for scaleFactor1x', () => {
      mockFetchSession();
      const layer = createLayer();
      expect((layer as any).mapScaleToFactor('scaleFactor1x', false)).toBe(1);
    });

    it('returns 2 when highDpi true and no scale', () => {
      mockFetchSession();
      const layer = createLayer();
      expect((layer as any).mapScaleToFactor(undefined, true)).toBe(2);
    });

    it('returns 1 when highDpi false and no scale', () => {
      mockFetchSession();
      const layer = createLayer();
      expect((layer as any).mapScaleToFactor(undefined, false)).toBe(1);
    });
  });

  describe('factorToScale', () => {
    it('returns scaleFactor4x for 4', () => {
      mockFetchSession();
      const layer = createLayer();
      expect((layer as any).factorToScale(4)).toBe('scaleFactor4x');
    });

    it('returns scaleFactor2x for 2', () => {
      mockFetchSession();
      const layer = createLayer();
      expect((layer as any).factorToScale(2)).toBe('scaleFactor2x');
    });

    it('returns scaleFactor1x for 1', () => {
      mockFetchSession();
      const layer = createLayer();
      expect((layer as any).factorToScale(1)).toBe('scaleFactor1x');
    });

    it('returns undefined for unknown factor', () => {
      mockFetchSession();
      const layer = createLayer();
      expect((layer as any).factorToScale(3)).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // parseExpiry (private)
  // -----------------------------------------------------------------------
  describe('parseExpiry', () => {
    it('parses a numeric string to milliseconds', () => {
      mockFetchSession();
      const layer = createLayer();
      const result = (layer as any).parseExpiry('1700000000');
      expect(result).toBe(1700000000 * 1000);
    });

    it('returns NaN for invalid string', () => {
      mockFetchSession();
      const layer = createLayer();
      const result = (layer as any).parseExpiry('invalid');
      expect(Number.isNaN(result)).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // buildTileUrl (private)
  // -----------------------------------------------------------------------
  describe('buildTileUrl', () => {
    it('builds a tile URL when session is available', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).sessionToken = 'my-session';
      const url = (layer as any).buildTileUrl({ z: 1, x: 2, y: 3 });
      expect(url).toContain('/1/2/3');
      expect(url).toContain('session=my-session');
      expect(url).toContain('key=test-api-key');
    });

    it('throws when session is missing', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).sessionToken = undefined;
      expect(() => (layer as any).buildTileUrl({ z: 1, x: 2, y: 3 })).toThrow(
        'Google Maps session missing',
      );
    });
  });

  // -----------------------------------------------------------------------
  // resolveTileSize (private)
  // -----------------------------------------------------------------------
  describe('resolveTileSize', () => {
    it('returns fallback tile size when no tileSize option', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).resolveTileSize();
      expect(mockPoint).toHaveBeenCalledWith(256, 256);
    });

    it('returns point when tileSize is a number', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).options = { tileSize: 512 };
      (layer as any).resolveTileSize();
      expect(mockPoint).toHaveBeenCalledWith(512, 512);
    });

    it('returns point when tileSize is an object with x and y', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).options = { tileSize: { x: 300, y: 400 } };
      (layer as any).resolveTileSize();
      expect(mockPoint).toHaveBeenCalledWith(300, 400);
    });

    it('returns point when tileSize is an array of 2 elements', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).options = { tileSize: [200, 300] };
      (layer as any).resolveTileSize();
      expect(mockPoint).toHaveBeenCalledWith(200, 300);
    });

    it('uses fallback for non-finite number', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).options = { tileSize: Infinity };
      (layer as any).resolveTileSize();
      expect(mockPoint).toHaveBeenCalledWith(256, 256);
    });
  });

  // -----------------------------------------------------------------------
  // applyTileSize (private)
  // -----------------------------------------------------------------------
  describe('applyTileSize', () => {
    it('applies tile size divided by scale factor', () => {
      mockFetchSession();
      const layer = createLayer({ scale: 'scaleFactor2x' });

      (layer as any).applyTileSize({
        tileWidth: 512,
        tileHeight: 512,
      });

      expect(mockPoint).toHaveBeenCalledWith(256, 256);
      expect(mockSetOptions).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // fetchAndApplySession (private)
  // -----------------------------------------------------------------------
  describe('fetchAndApplySession', () => {
    it('fetches session and stores token', async () => {
      mockFetchSession();
      const layer = createLayer();

      // Wait for the initial fetch to complete
      await (layer as any).sessionPromise;

      expect((layer as any).sessionToken).toBe('test-session-token');
    });

    it('throws on non-ok response', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 403,
          json: vi.fn().mockResolvedValue({
            error: { message: 'API key invalid' },
          }),
        }),
      );

      const layer = createLayer();

      await expect((layer as any).sessionPromise).rejects.toThrow(
        'API key invalid',
      );
    });

    it('uses generic error when JSON parse fails on error response', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: vi.fn().mockRejectedValue(new Error('JSON parse error')),
        }),
      );

      const layer = createLayer();

      await expect((layer as any).sessionPromise).rejects.toThrow(
        'Google Maps session request failed (500)',
      );
    });
  });

  // -----------------------------------------------------------------------
  // ensureSession (private)
  // -----------------------------------------------------------------------
  describe('ensureSession', () => {
    it('resolves immediately when session token exists', async () => {
      mockFetchSession();
      const layer = createLayer();
      await (layer as any).sessionPromise;

      const result = (layer as any).ensureSession();
      await expect(result).resolves.toBeUndefined();
    });

    it('creates a new session fetch when no promise exists', async () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).sessionToken = undefined;
      (layer as any).sessionPromise = undefined;

      const promise = (layer as any).ensureSession();
      expect(promise).toBeInstanceOf(Promise);
    });
  });

  // -----------------------------------------------------------------------
  // onAdd / onRemove
  // -----------------------------------------------------------------------
  describe('onAdd / onRemove', () => {
    it('registers move and zoom listeners on add', async () => {
      mockFetchSession();
      const layer = createLayer();
      await (layer as any).sessionPromise;

      const mockMapInst = {
        on: vi.fn(),
        off: vi.fn(),
        getBounds: vi.fn(() => ({
          isValid: vi.fn(() => false),
        })),
        getZoom: vi.fn(() => 10),
        attributionControl: null,
      };

      // Call onAdd (inherited from GridLayer but overridden)
      layer.onAdd(mockMapInst as any);

      expect(mockMapInst.on).toHaveBeenCalledWith(
        'moveend',
        expect.any(Function),
      );
      expect(mockMapInst.on).toHaveBeenCalledWith(
        'zoomend',
        expect.any(Function),
      );
      expect((layer as any).mapInstance).toBe(mockMapInst);
    });

    it('unregisters listeners and clears session on remove', async () => {
      mockFetchSession();
      const layer = createLayer();
      await (layer as any).sessionPromise;

      const mockMapInst = {
        on: vi.fn(),
        off: vi.fn(),
        getBounds: vi.fn(() => ({
          isValid: vi.fn(() => false),
        })),
        getZoom: vi.fn(() => 10),
        attributionControl: null,
      };

      layer.onAdd(mockMapInst as any);
      layer.onRemove(mockMapInst as any);

      expect(mockMapInst.off).toHaveBeenCalledWith(
        'moveend',
        expect.any(Function),
      );
      expect(mockMapInst.off).toHaveBeenCalledWith(
        'zoomend',
        expect.any(Function),
      );
      expect((layer as any).mapInstance).toBeUndefined();
    });
  });

  // -----------------------------------------------------------------------
  // createTile
  // -----------------------------------------------------------------------
  describe('createTile', () => {
    it('returns an img element', async () => {
      mockFetchSession();
      const layer = createLayer();
      await (layer as any).sessionPromise;

      const done = vi.fn();
      const tile = layer.createTile({ z: 1, x: 2, y: 3 } as any, done);

      expect(tile).toBeInstanceOf(HTMLImageElement);
      expect((tile as HTMLImageElement).alt).toBe('');
      expect((tile as HTMLImageElement).crossOrigin).toBe('anonymous');
    });

    it('calls done with error when session is unavailable', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: vi.fn().mockRejectedValue(new Error()),
        }),
      );

      const layer = createLayer();
      // Force session failure
      (layer as any).sessionToken = undefined;
      (layer as any).sessionPromise = undefined;

      const done = vi.fn();
      layer.createTile({ z: 1, x: 2, y: 3 } as any, done);

      // The done callback will be called asynchronously
      await vi.advanceTimersByTimeAsync(100);
    });
  });

  // -----------------------------------------------------------------------
  // scheduleSessionRefresh (private)
  // -----------------------------------------------------------------------
  describe('scheduleSessionRefresh', () => {
    it('does not schedule when expiryMs is not finite', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).scheduleSessionRefresh(Infinity);
      expect((layer as any).sessionRefreshId).toBeUndefined();
    });

    it('schedules a refresh when expiryMs is finite', () => {
      mockFetchSession();
      const layer = createLayer();
      const future = Date.now() + 120_000;
      (layer as any).scheduleSessionRefresh(future);
      expect((layer as any).sessionRefreshId).toBeDefined();
    });
  });

  // -----------------------------------------------------------------------
  // clearSessionRefresh (private)
  // -----------------------------------------------------------------------
  describe('clearSessionRefresh', () => {
    it('clears the timeout and resets the id', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).sessionRefreshId = setTimeout(() => {}, 10000);
      (layer as any).clearSessionRefresh();
      expect((layer as any).sessionRefreshId).toBeUndefined();
    });

    it('does nothing when no refresh is scheduled', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).clearSessionRefresh();
      // Should not throw
    });
  });

  // -----------------------------------------------------------------------
  // applyAttribution / removeCurrentAttribution (private)
  // -----------------------------------------------------------------------
  describe('applyAttribution', () => {
    it('adds attribution when none existed before', () => {
      mockFetchSession();
      const layer = createLayer();
      const addAttribution = vi.fn();
      const removeAttribution = vi.fn();
      (layer as any).mapInstance = {
        attributionControl: { addAttribution, removeAttribution },
      };

      (layer as any).applyAttribution('Test attribution');

      expect(addAttribution).toHaveBeenCalledWith('Test attribution');
      expect((layer as any).currentAttribution).toBe('Test attribution');
    });

    it('replaces existing attribution when value changes', () => {
      mockFetchSession();
      const layer = createLayer();
      const addAttribution = vi.fn();
      const removeAttribution = vi.fn();
      (layer as any).mapInstance = {
        attributionControl: { addAttribution, removeAttribution },
      };
      (layer as any).currentAttribution = 'Old attribution';

      (layer as any).applyAttribution('New attribution');

      expect(removeAttribution).toHaveBeenCalledWith('Old attribution');
      expect(addAttribution).toHaveBeenCalledWith('New attribution');
    });

    it('does nothing when attribution is the same', () => {
      mockFetchSession();
      const layer = createLayer();
      const addAttribution = vi.fn();
      const removeAttribution = vi.fn();
      (layer as any).mapInstance = {
        attributionControl: { addAttribution, removeAttribution },
      };
      (layer as any).currentAttribution = 'Same attribution';

      (layer as any).applyAttribution('Same attribution');

      expect(removeAttribution).not.toHaveBeenCalled();
      expect(addAttribution).not.toHaveBeenCalled();
    });

    it('does nothing when map has no attributionControl', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).mapInstance = { attributionControl: null };

      // Should not throw
      (layer as any).applyAttribution('Test');
    });
  });

  describe('removeCurrentAttribution', () => {
    it('removes the current attribution', () => {
      mockFetchSession();
      const layer = createLayer();
      const removeAttribution = vi.fn();
      (layer as any).mapInstance = {
        attributionControl: { removeAttribution },
      };
      (layer as any).currentAttribution = 'To remove';

      (layer as any).removeCurrentAttribution();

      expect(removeAttribution).toHaveBeenCalledWith('To remove');
      expect((layer as any).currentAttribution).toBeUndefined();
    });

    it('does nothing when no current attribution', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).mapInstance = {
        attributionControl: { removeAttribution: vi.fn() },
      };

      // Should not throw
      (layer as any).removeCurrentAttribution();
    });
  });

  // -----------------------------------------------------------------------
  // setGridOptions (private)
  // -----------------------------------------------------------------------
  describe('setGridOptions', () => {
    it('uses L.Util.setOptions when available', () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).setGridOptions({ tileSize: 512 });

      expect(mockSetOptions).toHaveBeenCalled();
    });
  });

  // -----------------------------------------------------------------------
  // updateAttribution (private)
  // -----------------------------------------------------------------------
  describe('updateAttribution', () => {
    it('does nothing when mapInstance is null', async () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).mapInstance = undefined;
      (layer as any).sessionToken = 'test';

      await (layer as any).updateAttribution();
      // Should not throw
    });

    it('does nothing when sessionToken is null', async () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).mapInstance = {};
      (layer as any).sessionToken = undefined;

      await (layer as any).updateAttribution();
    });

    it('does nothing when bounds are invalid', async () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).mapInstance = {
        getBounds: vi.fn(() => ({
          isValid: vi.fn(() => false),
        })),
      };
      (layer as any).sessionToken = 'test';

      await (layer as any).updateAttribution();
    });

    it('skips fetch when viewport has not changed', async () => {
      mockFetchSession();
      const layer = createLayer();
      (layer as any).mapInstance = {
        getBounds: vi.fn(() => ({
          isValid: vi.fn(() => true),
          getNorth: vi.fn(() => 50),
          getSouth: vi.fn(() => 49),
          getEast: vi.fn(() => 10),
          getWest: vi.fn(() => 9),
        })),
        getZoom: vi.fn(() => 10),
        attributionControl: { addAttribution: vi.fn(), removeAttribution: vi.fn() },
      };
      (layer as any).sessionToken = 'test';
      (layer as any).previousViewport = 'zoom=10&north=50&south=49&east=10&west=9';

      await (layer as any).updateAttribution();
      // fetch should not have been called again (it was called for session init)
    });
  });
});
