import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { LayerErrorCallback } from '../types/mapprovider';

vi.mock('../utils/logger', () => ({
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
}));

vi.mock('../utils/events', () => ({
  VMapEvents: {
    Ready: 'ready',
    Error: 'vmap-error',
    MapProviderReady: 'map-provider-ready',
    MapProviderWillShutdown: 'map-provider-will-shutdown',
    MapMouseMove: 'map-mousemove',
  },
}));

import { VMapLayerHelper, type VMapErrorHost } from './v-map-layer-helper';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function createMockMapProvider(overrides: Record<string, unknown> = {}) {
  return {
    addBaseLayer: vi.fn().mockResolvedValue('base-layer-id'),
    addLayerToGroup: vi.fn().mockResolvedValue('group-layer-id'),
    removeLayer: vi.fn().mockResolvedValue(undefined),
    setVisible: vi.fn().mockResolvedValue(undefined),
    setOpacity: vi.fn().mockResolvedValue(undefined),
    setZIndex: vi.fn().mockResolvedValue(undefined),
    updateLayer: vi.fn().mockResolvedValue(undefined),
    onLayerError: vi.fn(),
    offLayerError: vi.fn(),
    ...overrides,
  };
}

type MockMapProvider = ReturnType<typeof createMockMapProvider>;
type MockMapProviderWithoutErrorApi = Omit<
  MockMapProvider,
  'onLayerError' | 'offLayerError'
> & {
  onLayerError?: MockMapProvider['onLayerError'];
  offLayerError?: MockMapProvider['offLayerError'];
};

type MockVMap = {
  __vMapProvider: MockMapProvider | MockMapProviderWithoutErrorApi;
  isMapProviderReady: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
};

type MockGroup = {
  getGroupId: ReturnType<typeof vi.fn>;
  visible: boolean;
  basemapid: string;
};

type HelperInternals = {
  addToMapInternal(
    group: MockGroup,
    vmap: MockVMap,
    createLayerConfig: () => { type: 'osm' },
  ): Promise<void>;
  mapProvider: MockMapProvider | MockMapProviderWithoutErrorApi;
  layerId: string | null;
};

function asHelperInternals(value: VMapLayerHelper): HelperInternals {
  return value as unknown as HelperInternals;
}

function createMockVMap(
  provider: MockMapProvider | MockMapProviderWithoutErrorApi,
): MockVMap {
  return {
    __vMapProvider: provider,
    isMapProviderReady: vi.fn().mockResolvedValue(true),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
}

function createMockGroup(groupId = 'test-group-id'): MockGroup {
  return {
    getGroupId: vi.fn().mockResolvedValue(groupId),
    visible: true,
    basemapid: '',
  };
}

function createMockElement(): HTMLElement {
  return {
    nodeName: 'V-MAP-LAYER-XYZ',
    closest: vi.fn(() => null),
    dispatchEvent: vi.fn(),
  } as unknown as HTMLElement;
}

function createMockHost(): VMapErrorHost & { states: string[] } {
  return {
    states: [] as string[],
    setLoadState(state: 'idle' | 'loading' | 'ready' | 'error') {
      this.states.push(state);
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Tests                                                              */
/* ------------------------------------------------------------------ */
describe('VMapLayerHelper – runtime error propagation', () => {
  let helper: VMapLayerHelper;
  let mockEl: HTMLElement;
  let mockProvider: MockMapProvider;
  let mockHost: ReturnType<typeof createMockHost>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mockProvider = createMockMapProvider();
    mockEl = createMockElement();
    mockHost = createMockHost();
    helper = new VMapLayerHelper(mockEl, mockHost);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /* ================================================================ */
  /*  setRuntimeError – leading-edge throttle                          */
  /* ================================================================ */
  describe('setRuntimeError', () => {
    it('fires immediately on first call', () => {
      const detail = { type: 'network' as const, message: 'Tile load error' };

      helper.setRuntimeError(detail);

      expect(helper.getError()).toEqual(detail);
      expect(mockHost.states).toContain('error');
      expect(mockEl.dispatchEvent).toHaveBeenCalledTimes(1);
    });

    it('suppresses repeated calls within the 5s window', () => {
      const detail1 = { type: 'network' as const, message: 'Error 1' };
      const detail2 = { type: 'network' as const, message: 'Error 2' };

      helper.setRuntimeError(detail1);
      expect(helper.getError()).toEqual(detail1);

      // Advance less than 5s
      vi.advanceTimersByTime(3000);

      helper.setRuntimeError(detail2);

      // Error should still be the first one – second was suppressed
      expect(helper.getError()).toEqual(detail1);
      expect(mockEl.dispatchEvent).toHaveBeenCalledTimes(1);
    });

    it('fires again after the 5s window expires', () => {
      const detail1 = { type: 'network' as const, message: 'Error 1' };
      const detail2 = { type: 'network' as const, message: 'Error 2' };

      helper.setRuntimeError(detail1);
      expect(mockEl.dispatchEvent).toHaveBeenCalledTimes(1);

      // Advance past the 5s debounce window
      vi.advanceTimersByTime(5001);

      helper.setRuntimeError(detail2);

      expect(helper.getError()).toEqual(detail2);
      expect(mockEl.dispatchEvent).toHaveBeenCalledTimes(2);
    });

    it('suppresses at exactly 5s but fires at 5001ms', () => {
      const detail1 = { type: 'network' as const, message: 'Error 1' };
      const detail2 = { type: 'network' as const, message: 'Error 2' };
      const detail3 = { type: 'network' as const, message: 'Error 3' };

      helper.setRuntimeError(detail1);

      // At exactly 4999ms – still suppressed
      vi.advanceTimersByTime(4999);
      helper.setRuntimeError(detail2);
      expect(helper.getError()).toEqual(detail1);
      expect(mockEl.dispatchEvent).toHaveBeenCalledTimes(1);

      // At 5001ms from the first call
      vi.advanceTimersByTime(2);
      helper.setRuntimeError(detail3);
      expect(helper.getError()).toEqual(detail3);
      expect(mockEl.dispatchEvent).toHaveBeenCalledTimes(2);
    });
  });

  /* ================================================================ */
  /*  clearError resets the debounce timer                             */
  /* ================================================================ */
  describe('clearError resets debounce timer', () => {
    it('allows immediate fire after clearError', () => {
      const detail1 = { type: 'network' as const, message: 'Error 1' };
      const detail2 = { type: 'network' as const, message: 'Error 2' };

      helper.setRuntimeError(detail1);
      expect(mockEl.dispatchEvent).toHaveBeenCalledTimes(1);

      // Only 1s in – normally would be suppressed
      vi.advanceTimersByTime(1000);

      helper.clearError();

      // Should fire immediately after clearError, even within the 5s window
      helper.setRuntimeError(detail2);
      expect(helper.getError()).toEqual(detail2);
      expect(mockEl.dispatchEvent).toHaveBeenCalledTimes(2);
    });

    it('clearError removes the stored error', () => {
      helper.setRuntimeError({ type: 'network', message: 'err' });
      expect(helper.getError()).toBeDefined();

      helper.clearError();
      expect(helper.getError()).toBeUndefined();
    });
  });

  /* ================================================================ */
  /*  registerLayerError / unregisterLayerError                        */
  /* ================================================================ */
  describe('registerLayerError', () => {
    it('calls mapProvider.onLayerError after addLayer succeeds', async () => {
      const testHelper = asHelperInternals(helper);
      const mockVMap = createMockVMap(mockProvider);
      const mockGroup = createMockGroup();

      await testHelper.addToMapInternal(
        mockGroup,
        mockVMap,
        () => ({ type: 'osm' }),
      );

      expect(mockProvider.onLayerError).toHaveBeenCalledWith(
        'group-layer-id',
        expect.any(Function),
      );
    });

    it('onLayerError callback delegates to setRuntimeError', async () => {
      let capturedCallback: (err: { type: string; message: string; cause?: unknown }) => void;
      mockProvider.onLayerError.mockImplementation((_id: string, cb: LayerErrorCallback) => {
        capturedCallback = cb;
      });

      const testHelper = asHelperInternals(helper);
      const mockVMap = createMockVMap(mockProvider);
      const mockGroup = createMockGroup();

      await testHelper.addToMapInternal(
        mockGroup,
        mockVMap,
        () => ({ type: 'osm' }),
      );

      // Simulate a layer error from the provider
      capturedCallback!({ type: 'network', message: 'Tile load error' });

      expect(helper.getError()).toEqual({
        type: 'network',
        message: 'Tile load error',
      });
      expect(mockHost.states).toContain('error');
    });

    it('does not call onLayerError if provider lacks the method', async () => {
      const testHelper = asHelperInternals(helper);
      const providerWithoutError =
        createMockMapProvider() as MockMapProviderWithoutErrorApi;
      delete providerWithoutError.onLayerError;
      delete providerWithoutError.offLayerError;

      const mockVMap = createMockVMap(providerWithoutError);
      const mockGroup = createMockGroup('g1');

      // Should not throw
      await testHelper.addToMapInternal(
        mockGroup,
        mockVMap,
        () => ({ type: 'osm' }),
      );

      expect(helper.getLayerId()).toBe('group-layer-id');
    });
  });

  describe('unregisterLayerError', () => {
    it('calls mapProvider.offLayerError on removeLayer', async () => {
      const testHelper = asHelperInternals(helper);
      testHelper.mapProvider = mockProvider;
      testHelper.layerId = 'layer-1';

      await helper.removeLayer();

      expect(mockProvider.offLayerError).toHaveBeenCalledWith('layer-1');
      expect(helper.getLayerId()).toBeNull();
    });

    it('calls offLayerError before removing old layer in addToMapInternal', async () => {
      const testHelper = asHelperInternals(helper);
      testHelper.layerId = 'old-layer';
      testHelper.mapProvider = mockProvider;

      const mockVMap = createMockVMap(mockProvider);
      const mockGroup = createMockGroup('g1');

      await testHelper.addToMapInternal(
        mockGroup,
        mockVMap,
        () => ({ type: 'osm' }),
      );

      // offLayerError should have been called for the old layer
      expect(mockProvider.offLayerError).toHaveBeenCalledWith('old-layer');
      // And onLayerError for the new layer
      expect(mockProvider.onLayerError).toHaveBeenCalledWith(
        'group-layer-id',
        expect.any(Function),
      );
    });

    it('does not throw if provider lacks offLayerError', async () => {
      const testHelper = asHelperInternals(helper);
      const providerWithoutOff =
        createMockMapProvider() as MockMapProviderWithoutErrorApi;
      delete providerWithoutOff.offLayerError;

      testHelper.mapProvider = providerWithoutOff;
      testHelper.layerId = 'layer-1';

      // Should not throw
      await helper.removeLayer();
      expect(helper.getLayerId()).toBeNull();
    });
  });
});
