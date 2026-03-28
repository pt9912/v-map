import { WCSGridLayer, createWCSGridLayer } from './WCSGridLayer';
import type { WCSGridLayerOptions } from './WCSGridLayer';

describe('WCSGridLayer', () => {
  describe('createWCSGridLayer', () => {
    it('should create a WCSGridLayer instance', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
      };

      const layer = createWCSGridLayer(options);

      expect(layer).toBeInstanceOf(WCSGridLayer);
    });

    it('should use default values for optional parameters', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
      };

      const layer = createWCSGridLayer(options);

      expect(layer).toBeDefined();
      // Default values are set in constructor
      expect((layer as any).wcsOptions.version).toBe('2.0.1');
      expect((layer as any).wcsOptions.format).toBe('image/tiff');
      expect((layer as any).wcsOptions.projection).toBe('EPSG:4326');
    });

    it('should use provided values for optional parameters', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
        version: '1.1.1',
        format: 'image/png',
        projection: 'EPSG:3857',
      };

      const layer = createWCSGridLayer(options);

      expect((layer as any).wcsOptions.version).toBe('1.1.1');
      expect((layer as any).wcsOptions.format).toBe('image/png');
      expect((layer as any).wcsOptions.projection).toBe('EPSG:3857');
    });
  });

  describe('buildWCSUrl', () => {
    it('should build WCS 2.0.1 URL with subset parameters', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
        version: '2.0.1',
        format: 'image/tiff',
      };

      const layer = createWCSGridLayer(options);

      // Mock _tileCoordsToBounds
      (layer as any)._tileCoordsToBounds = jest.fn().mockReturnValue({
        getSouthWest: () => ({ lng: 10, lat: 20 }),
        getNorthEast: () => ({ lng: 30, lat: 40 }),
      });

      const coords = { x: 1, y: 2, z: 3 } as any;
      const url = (layer as any).buildWCSUrl(coords);

      expect(url).toContain('SERVICE=WCS');
      expect(url).toContain('REQUEST=GetCoverage');
      expect(url).toContain('VERSION=2.0.1');
      expect(url).toContain('FORMAT=image%2Ftiff');
      expect(url).toContain('coverageId=test-coverage');
      expect(url).toContain('subset=X(10,30)');
      expect(url).toContain('subset=Y(20,40)');
      expect(url).toContain('geotiff%3Acompression=LZW');
    });

    it('should build WCS 1.x.x URL with BBOX parameters', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
        version: '1.1.1',
        format: 'image/tiff',
        projection: 'EPSG:4326',
      };

      const layer = createWCSGridLayer(options);

      // Mock _tileCoordsToBounds
      (layer as any)._tileCoordsToBounds = jest.fn().mockReturnValue({
        getSouthWest: () => ({ lng: 10, lat: 20 }),
        getNorthEast: () => ({ lng: 30, lat: 40 }),
      });

      // Mock getTileSize
      (layer as any).getTileSize = jest.fn().mockReturnValue(256);

      const coords = { x: 1, y: 2, z: 3 } as any;
      const url = (layer as any).buildWCSUrl(coords);

      expect(url).toContain('SERVICE=WCS');
      expect(url).toContain('REQUEST=GetCoverage');
      expect(url).toContain('VERSION=1.1.1');
      expect(url).toContain('FORMAT=image%2Ftiff');
      expect(url).toContain('COVERAGE=test-coverage');
      expect(url).toContain('BBOX=10%2C20%2C30%2C40');
      expect(url).toContain('CRS=EPSG%3A4326');
      expect(url).toContain('WIDTH=256');
      expect(url).toContain('HEIGHT=256');
    });

    it('should include additional params in URL', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
        version: '2.0.1',
        params: {
          customParam: 'customValue',
          anotherParam: 123,
        },
      };

      const layer = createWCSGridLayer(options);

      // Mock _tileCoordsToBounds
      (layer as any)._tileCoordsToBounds = jest.fn().mockReturnValue({
        getSouthWest: () => ({ lng: 10, lat: 20 }),
        getNorthEast: () => ({ lng: 30, lat: 40 }),
      });

      const coords = { x: 1, y: 2, z: 3 } as any;
      const url = (layer as any).buildWCSUrl(coords);

      expect(url).toContain('customParam=customValue');
      expect(url).toContain('anotherParam=123');
    });

    it('should handle URL with existing query parameters', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs?existing=param',
        coverageName: 'test-coverage',
      };

      const layer = createWCSGridLayer(options);

      // Mock _tileCoordsToBounds
      (layer as any)._tileCoordsToBounds = jest.fn().mockReturnValue({
        getSouthWest: () => ({ lng: 10, lat: 20 }),
        getNorthEast: () => ({ lng: 30, lat: 40 }),
      });

      const coords = { x: 1, y: 2, z: 3 } as any;
      const url = (layer as any).buildWCSUrl(coords);

      // Should append with & instead of ?
      expect(url).toContain('?existing=param&');
    });
  });

  describe('createTile', () => {
    it('should create an img element with correct src', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
      };

      const layer = createWCSGridLayer(options);

      // Mock _tileCoordsToBounds
      (layer as any)._tileCoordsToBounds = jest.fn().mockReturnValue({
        getSouthWest: () => ({ lng: 10, lat: 20 }),
        getNorthEast: () => ({ lng: 30, lat: 40 }),
      });

      const coords = { x: 1, y: 2, z: 3 } as any;
      const done = jest.fn();

      const tile = layer.createTile(coords, done) as HTMLImageElement;

      expect(tile.tagName).toBe('IMG');
      expect(tile.crossOrigin).toBe('anonymous');
      expect(tile.src).toContain('https://example.com/wcs');
      expect(tile.src).toContain('SERVICE=WCS');
    });

    it('should call done callback on image load', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
      };

      const layer = createWCSGridLayer(options);

      // Mock _tileCoordsToBounds
      (layer as any)._tileCoordsToBounds = jest.fn().mockReturnValue({
        getSouthWest: () => ({ lng: 10, lat: 20 }),
        getNorthEast: () => ({ lng: 30, lat: 40 }),
      });

      const coords = { x: 1, y: 2, z: 3 } as any;
      const done = jest.fn();

      const imgTile = layer.createTile(coords, done) as HTMLImageElement;

      // Trigger onload handler directly
      if (imgTile.onload) {
        (imgTile.onload as any)();
      }

      expect(done).toHaveBeenCalledWith(null, imgTile);
    });

    it('should call done callback on image error', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
      };

      const layer = createWCSGridLayer(options);

      // Mock _tileCoordsToBounds
      (layer as any)._tileCoordsToBounds = jest.fn().mockReturnValue({
        getSouthWest: () => ({ lng: 10, lat: 20 }),
        getNorthEast: () => ({ lng: 30, lat: 40 }),
      });

      const coords = { x: 1, y: 2, z: 3 } as any;
      const done = jest.fn();

      const imgTile = layer.createTile(coords, done) as HTMLImageElement;

      // Trigger onerror handler directly
      const errorEvent = new Event('error');
      if (imgTile.onerror) {
        (imgTile.onerror as any)(errorEvent);
      }

      expect(done).toHaveBeenCalledWith(expect.any(Error), imgTile);
    });
  });

    it('should NOT add geotiff compression for non-tiff format in WCS 2.0.x (lines 72-78)', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
        version: '2.0.1',
        format: 'image/png', // Not tiff - should skip compression param
      };

      const layer = createWCSGridLayer(options);

      (layer as any)._tileCoordsToBounds = jest.fn().mockReturnValue({
        getSouthWest: () => ({ lng: 10, lat: 20 }),
        getNorthEast: () => ({ lng: 30, lat: 40 }),
      });

      const coords = { x: 1, y: 2, z: 3 } as any;
      const url = (layer as any).buildWCSUrl(coords);

      expect(url).toContain('SERVICE=WCS');
      expect(url).toContain('VERSION=2.0.1');
      expect(url).toContain('FORMAT=image%2Fpng');
      // Should NOT contain geotiff compression
      expect(url).not.toContain('geotiff');
      expect(url).not.toContain('compression');
    });

    it('should handle WCS 1.x with getTileSize returning an object {x, y} (lines 98-99)', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
        version: '1.1.1',
        format: 'image/tiff',
        projection: 'EPSG:4326',
      };

      const layer = createWCSGridLayer(options);

      (layer as any)._tileCoordsToBounds = jest.fn().mockReturnValue({
        getSouthWest: () => ({ lng: 10, lat: 20 }),
        getNorthEast: () => ({ lng: 30, lat: 40 }),
      });

      // Return object instead of number for getTileSize
      (layer as any).getTileSize = jest.fn().mockReturnValue({ x: 512, y: 512 });

      const coords = { x: 1, y: 2, z: 3 } as any;
      const url = (layer as any).buildWCSUrl(coords);

      expect(url).toContain('WIDTH=512');
      expect(url).toContain('HEIGHT=512');
      expect(url).toContain('COVERAGE=test-coverage');
      expect(url).toContain('BBOX=10%2C20%2C30%2C40');
    });

    it('should handle WCS 1.x with extra params (lines 100-102)', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
        version: '1.0.0',
        format: 'image/tiff',
        projection: 'EPSG:4326',
        params: {
          customParam: 'value',
        },
      };

      const layer = createWCSGridLayer(options);

      (layer as any)._tileCoordsToBounds = jest.fn().mockReturnValue({
        getSouthWest: () => ({ lng: 5, lat: 15 }),
        getNorthEast: () => ({ lng: 25, lat: 35 }),
      });

      (layer as any).getTileSize = jest.fn().mockReturnValue(256);

      const coords = { x: 0, y: 0, z: 1 } as any;
      const url = (layer as any).buildWCSUrl(coords);

      expect(url).toContain('customParam=value');
      expect(url).toContain('WIDTH=256');
    });

    it('should call done with Error when onerror receives an Error object', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
      };

      const layer = createWCSGridLayer(options);

      (layer as any)._tileCoordsToBounds = jest.fn().mockReturnValue({
        getSouthWest: () => ({ lng: 10, lat: 20 }),
        getNorthEast: () => ({ lng: 30, lat: 40 }),
      });

      const coords = { x: 1, y: 2, z: 3 } as any;
      const done = jest.fn();

      const imgTile = layer.createTile(coords, done) as HTMLImageElement;

      // Trigger onerror with an actual Error object
      const realError = new Error('Network failure');
      if (imgTile.onerror) {
        (imgTile.onerror as any)(realError);
      }

      expect(done).toHaveBeenCalledWith(realError, imgTile);
    });

  describe('updateOptions', () => {
    it('should update WCS options and trigger redraw', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
        version: '2.0.1',
      };

      const layer = createWCSGridLayer(options);

      // Mock redraw method
      (layer as any).redraw = jest.fn();

      layer.updateOptions({
        version: '1.1.1',
        format: 'image/png',
      });

      expect((layer as any).wcsOptions.version).toBe('1.1.1');
      expect((layer as any).wcsOptions.format).toBe('image/png');
      expect((layer as any).wcsOptions.coverageName).toBe('test-coverage'); // unchanged
      expect((layer as any).redraw).toHaveBeenCalled();
    });

    it('should allow updating URL', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
      };

      const layer = createWCSGridLayer(options);

      // Mock redraw method
      (layer as any).redraw = jest.fn();

      layer.updateOptions({
        url: 'https://newserver.com/wcs',
      });

      expect((layer as any).wcsOptions.url).toBe('https://newserver.com/wcs');
      expect((layer as any).redraw).toHaveBeenCalled();
    });

    it('should allow updating params', () => {
      const options: WCSGridLayerOptions = {
        url: 'https://example.com/wcs',
        coverageName: 'test-coverage',
        params: {
          oldParam: 'oldValue',
        },
      };

      const layer = createWCSGridLayer(options);

      // Mock redraw method
      (layer as any).redraw = jest.fn();

      layer.updateOptions({
        params: {
          newParam: 'newValue',
        },
      });

      expect((layer as any).wcsOptions.params).toEqual({
        newParam: 'newValue',
      });
      expect((layer as any).redraw).toHaveBeenCalled();
    });
  });
});
