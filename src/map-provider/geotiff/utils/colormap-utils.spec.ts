import {
  parseHexColor,
  convertGeoStylerColorMap,
  applyColorMap,
  getColorStops,
  PREDEFINED_COLORMAPS,
  type ColorStop,
} from './colormap-utils';
import type { ColorMap as GeoStylerColorMap } from 'geostyler-style';

describe('ColorMap Utilities', () => {
  describe('parseHexColor', () => {
    it('should parse 6-digit hex color with hash', () => {
      expect(parseHexColor('#FF0000')).toEqual([255, 0, 0]);
      expect(parseHexColor('#00FF00')).toEqual([0, 255, 0]);
      expect(parseHexColor('#0000FF')).toEqual([0, 0, 255]);
    });

    it('should parse 6-digit hex color without hash', () => {
      expect(parseHexColor('FF0000')).toEqual([255, 0, 0]);
      expect(parseHexColor('FFFFFF')).toEqual([255, 255, 255]);
    });

    it('should parse 3-digit shorthand hex color', () => {
      expect(parseHexColor('#F00')).toEqual([255, 0, 0]);
      expect(parseHexColor('#0F0')).toEqual([0, 255, 0]);
      expect(parseHexColor('#00F')).toEqual([0, 0, 255]);
      expect(parseHexColor('ABC')).toEqual([170, 187, 204]); // #AABBCC
    });

    it('should handle lowercase hex', () => {
      expect(parseHexColor('#ff0000')).toEqual([255, 0, 0]);
      expect(parseHexColor('abc')).toEqual([170, 187, 204]);
    });

    it('should handle whitespace', () => {
      expect(parseHexColor('  #FF0000  ')).toEqual([255, 0, 0]);
    });

    it('should return black for invalid hex colors', () => {
      expect(parseHexColor('#GGGGGG')).toEqual([0, 0, 0]);
      expect(parseHexColor('#12')).toEqual([0, 0, 0]);
      expect(parseHexColor('#1234567')).toEqual([0, 0, 0]);
      expect(parseHexColor('invalid')).toEqual([0, 0, 0]);
    });
  });

  describe('convertGeoStylerColorMap', () => {
    it('should convert simple GeoStyler ColorMap', () => {
      const geoStylerColorMap: GeoStylerColorMap = {
        type: 'ramp',
        colorMapEntries: [
          { color: '#000000', quantity: 0 },
          { color: '#FFFFFF', quantity: 100 },
        ],
      };

      const result = convertGeoStylerColorMap(geoStylerColorMap);

      expect(result.stops).toHaveLength(2);
      expect(result.stops[0]).toEqual({ value: 0, color: [0, 0, 0] });
      expect(result.stops[1]).toEqual({ value: 1, color: [255, 255, 255] });
      expect(result.computedRange).toEqual([0, 100]);
    });

    it('should normalize values to 0-1 range', () => {
      const geoStylerColorMap: GeoStylerColorMap = {
        type: 'ramp',
        colorMapEntries: [
          { color: '#FF0000', quantity: 500 },
          { color: '#00FF00', quantity: 1000 },
          { color: '#0000FF', quantity: 1500 },
        ],
      };

      const result = convertGeoStylerColorMap(geoStylerColorMap);

      expect(result.stops).toHaveLength(3);
      expect(result.stops[0].value).toBe(0); // (500-500)/(1500-500) = 0
      expect(result.stops[1].value).toBe(0.5); // (1000-500)/(1500-500) = 0.5
      expect(result.stops[2].value).toBe(1); // (1500-500)/(1500-500) = 1
      expect(result.computedRange).toEqual([500, 1500]);
    });

    it('should use provided valueRange', () => {
      const geoStylerColorMap: GeoStylerColorMap = {
        type: 'ramp',
        colorMapEntries: [
          { color: '#FF0000', quantity: 500 },
          { color: '#0000FF', quantity: 1500 },
        ],
      };

      const result = convertGeoStylerColorMap(geoStylerColorMap, [0, 2000]);

      expect(result.stops[0].value).toBe(0.25); // (500-0)/(2000-0) = 0.25
      expect(result.stops[1].value).toBe(0.75); // (1500-0)/(2000-0) = 0.75
      expect(result.computedRange).toBeUndefined();
    });

    it('should sort stops by value', () => {
      const geoStylerColorMap: GeoStylerColorMap = {
        type: 'ramp',
        colorMapEntries: [
          { color: '#0000FF', quantity: 1500 },
          { color: '#FF0000', quantity: 500 },
          { color: '#00FF00', quantity: 1000 },
        ],
      };

      const result = convertGeoStylerColorMap(geoStylerColorMap);

      expect(result.stops[0].value).toBe(0); // 500
      expect(result.stops[1].value).toBe(0.5); // 1000
      expect(result.stops[2].value).toBe(1); // 1500
    });

    it('should handle empty colorMapEntries', () => {
      const geoStylerColorMap: GeoStylerColorMap = {
        type: 'ramp',
        colorMapEntries: [],
      };

      const result = convertGeoStylerColorMap(geoStylerColorMap);

      expect(result.stops).toEqual(PREDEFINED_COLORMAPS.grayscale);
    });

    it('should handle entries without quantities', () => {
      const geoStylerColorMap: GeoStylerColorMap = {
        type: 'ramp',
        colorMapEntries: [
          { color: '#FF0000' },
          { color: '#0000FF' },
        ],
      };

      const result = convertGeoStylerColorMap(geoStylerColorMap);

      expect(result.stops).toHaveLength(2);
      // Should assume 0-1 range when no quantities
      expect(result.computedRange).toEqual([0, 1]);
    });

    it('should handle single value (avoid division by zero)', () => {
      const geoStylerColorMap: GeoStylerColorMap = {
        type: 'ramp',
        colorMapEntries: [
          { color: '#FF0000', quantity: 100 },
          { color: '#0000FF', quantity: 100 },
        ],
      };

      const result = convertGeoStylerColorMap(geoStylerColorMap);

      expect(result.stops).toHaveLength(2);
      // Should handle maxVal === minVal by adding 1
      expect(result.computedRange).toEqual([100, 101]);
    });

    it('should clamp normalized values to [0, 1]', () => {
      const geoStylerColorMap: GeoStylerColorMap = {
        type: 'ramp',
        colorMapEntries: [
          { color: '#FF0000', quantity: -100 }, // Will be normalized to value < 0
          { color: '#0000FF', quantity: 200 }, // Will be normalized to value > 1
        ],
      };

      const result = convertGeoStylerColorMap(geoStylerColorMap, [0, 100]);

      // Values should be clamped
      expect(result.stops[0].value).toBeGreaterThanOrEqual(0);
      expect(result.stops[1].value).toBeLessThanOrEqual(1);
    });
  });

  describe('applyColorMap', () => {
    const simpleStops: ColorStop[] = [
      { value: 0.0, color: [0, 0, 0] }, // black
      { value: 1.0, color: [255, 255, 255] }, // white
    ];

    it('should return exact color at stop positions', () => {
      expect(applyColorMap(0.0, simpleStops)).toEqual([0, 0, 0]);
      expect(applyColorMap(1.0, simpleStops)).toEqual([255, 255, 255]);
    });

    it('should interpolate between stops', () => {
      const color = applyColorMap(0.5, simpleStops);
      expect(color[0]).toBe(128); // (0 + 255) / 2 = 127.5 -> 128
      expect(color[1]).toBe(128);
      expect(color[2]).toBe(128);
    });

    it('should handle values below minimum', () => {
      expect(applyColorMap(-0.5, simpleStops)).toEqual([0, 0, 0]);
    });

    it('should handle values above maximum', () => {
      expect(applyColorMap(1.5, simpleStops)).toEqual([255, 255, 255]);
    });

    it('should work with multiple stops', () => {
      const multiStops: ColorStop[] = [
        { value: 0.0, color: [255, 0, 0] }, // red
        { value: 0.5, color: [0, 255, 0] }, // green
        { value: 1.0, color: [0, 0, 255] }, // blue
      ];

      expect(applyColorMap(0.0, multiStops)).toEqual([255, 0, 0]);
      expect(applyColorMap(0.5, multiStops)).toEqual([0, 255, 0]);
      expect(applyColorMap(1.0, multiStops)).toEqual([0, 0, 255]);

      // Test interpolation between red and green
      const color25 = applyColorMap(0.25, multiStops);
      expect(color25[0]).toBe(128); // (255 + 0) / 2
      expect(color25[1]).toBe(128); // (0 + 255) / 2
      expect(color25[2]).toBe(0);
    });

    it('should use binary search for large colormap (performance test)', () => {
      // Create a large colormap with 256 stops
      const largeStops: ColorStop[] = Array.from({ length: 256 }, (_, i) => ({
        value: i / 255,
        color: [i, i, i] as [number, number, number],
      }));

      const color = applyColorMap(0.5, largeStops);
      expect(color[0]).toBe(128);
      expect(color[1]).toBe(128);
      expect(color[2]).toBe(128);
    });

    it('should handle single stop', () => {
      const singleStop: ColorStop[] = [{ value: 0.5, color: [100, 150, 200] }];

      expect(applyColorMap(0.0, singleStop)).toEqual([100, 150, 200]);
      expect(applyColorMap(0.5, singleStop)).toEqual([100, 150, 200]);
      expect(applyColorMap(1.0, singleStop)).toEqual([100, 150, 200]);
    });

    it('should handle empty stops array', () => {
      expect(applyColorMap(0.5, [])).toEqual([0, 0, 0]); // Black fallback
    });
  });

  describe('getColorStops', () => {
    it('should return predefined colormap by name', () => {
      const result = getColorStops('viridis');
      expect(result.stops).toEqual(PREDEFINED_COLORMAPS.viridis);
      expect(result.computedRange).toBeUndefined();
    });

    it('should handle all predefined colormaps', () => {
      expect(getColorStops('grayscale').stops).toBeDefined();
      expect(getColorStops('viridis').stops).toBeDefined();
      expect(getColorStops('terrain').stops).toBeDefined();
      expect(getColorStops('turbo').stops).toBeDefined();
      expect(getColorStops('rainbow').stops).toBeDefined();
    });

    it('should fallback to grayscale for unknown name', () => {
      const result = getColorStops('unknown' as any);
      expect(result.stops).toEqual(PREDEFINED_COLORMAPS.grayscale);
    });

    it('should convert GeoStyler ColorMap', () => {
      const geoStylerColorMap: GeoStylerColorMap = {
        type: 'ramp',
        colorMapEntries: [
          { color: '#FF0000', quantity: 0 },
          { color: '#0000FF', quantity: 100 },
        ],
      };

      const result = getColorStops(geoStylerColorMap);
      expect(result.stops).toHaveLength(2);
      expect(result.computedRange).toEqual([0, 100]);
    });

    it('should pass valueRange to GeoStyler converter', () => {
      const geoStylerColorMap: GeoStylerColorMap = {
        type: 'ramp',
        colorMapEntries: [
          { color: '#FF0000', quantity: 50 },
          { color: '#0000FF', quantity: 150 },
        ],
      };

      const result = getColorStops(geoStylerColorMap, [0, 200]);
      expect(result.stops[0].value).toBe(0.25); // 50/200
      expect(result.stops[1].value).toBe(0.75); // 150/200
    });
  });

  describe('PREDEFINED_COLORMAPS', () => {
    it('should have all expected colormaps', () => {
      expect(PREDEFINED_COLORMAPS.grayscale).toBeDefined();
      expect(PREDEFINED_COLORMAPS.viridis).toBeDefined();
      expect(PREDEFINED_COLORMAPS.terrain).toBeDefined();
      expect(PREDEFINED_COLORMAPS.turbo).toBeDefined();
      expect(PREDEFINED_COLORMAPS.rainbow).toBeDefined();
    });

    it('should have sorted values in each colormap', () => {
      Object.values(PREDEFINED_COLORMAPS).forEach(colormap => {
        for (let i = 1; i < colormap.length; i++) {
          expect(colormap[i].value).toBeGreaterThanOrEqual(colormap[i - 1].value);
        }
      });
    });

    it('should have values in [0, 1] range', () => {
      Object.values(PREDEFINED_COLORMAPS).forEach(colormap => {
        colormap.forEach(stop => {
          expect(stop.value).toBeGreaterThanOrEqual(0);
          expect(stop.value).toBeLessThanOrEqual(1);
        });
      });
    });

    it('should have RGB values in [0, 255] range', () => {
      Object.values(PREDEFINED_COLORMAPS).forEach(colormap => {
        colormap.forEach(stop => {
          expect(stop.color[0]).toBeGreaterThanOrEqual(0);
          expect(stop.color[0]).toBeLessThanOrEqual(255);
          expect(stop.color[1]).toBeGreaterThanOrEqual(0);
          expect(stop.color[1]).toBeLessThanOrEqual(255);
          expect(stop.color[2]).toBeGreaterThanOrEqual(0);
          expect(stop.color[2]).toBeLessThanOrEqual(255);
        });
      });
    });
  });
});
