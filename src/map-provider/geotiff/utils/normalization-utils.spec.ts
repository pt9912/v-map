import {
  normalizeValue,
  normalizeToColorMapRange,
  autoDetectValueRange,
  isFloatType,
  getTypeRange,
} from './normalization-utils';

describe('Normalization Utilities', () => {
  describe('normalizeValue', () => {
    it('should pass through Uint8Array values', () => {
      expect(normalizeValue(0, 'Uint8Array')).toBe(0);
      expect(normalizeValue(128, 'Uint8Array')).toBe(128);
      expect(normalizeValue(255, 'Uint8Array')).toBe(255);
    });

    it('should normalize Uint16Array values', () => {
      expect(normalizeValue(0, 'Uint16Array')).toBe(0);
      expect(normalizeValue(32768, 'Uint16Array')).toBeCloseTo(128, 0);
      expect(normalizeValue(65535, 'Uint16Array')).toBe(255);
    });

    it('should normalize Int16Array values', () => {
      expect(normalizeValue(-32768, 'Int16Array')).toBe(0);
      expect(normalizeValue(0, 'Int16Array')).toBeCloseTo(128, 0);
      expect(normalizeValue(32767, 'Int16Array')).toBe(255);
    });

    it('should normalize Uint32Array values', () => {
      expect(normalizeValue(0, 'Uint32Array')).toBe(0);
      expect(normalizeValue(2147483648, 'Uint32Array')).toBeCloseTo(128, 0);
      expect(normalizeValue(4294967295, 'Uint32Array')).toBe(255);
    });

    it('should normalize Int32Array values', () => {
      expect(normalizeValue(-2147483648, 'Int32Array')).toBe(0);
      expect(normalizeValue(0, 'Int32Array')).toBeCloseTo(128, 0);
      expect(normalizeValue(2147483647, 'Int32Array')).toBe(255);
    });

    it('should normalize Float32Array values', () => {
      expect(normalizeValue(0.0, 'Float32Array')).toBe(0);
      expect(normalizeValue(0.5, 'Float32Array')).toBe(128);
      expect(normalizeValue(1.0, 'Float32Array')).toBe(255);
    });

    it('should clamp Float values outside [0, 1]', () => {
      expect(normalizeValue(-0.5, 'Float32Array')).toBe(0);
      expect(normalizeValue(1.5, 'Float32Array')).toBe(255);
      expect(normalizeValue(999, 'Float64Array')).toBe(255);
    });

    it('should handle Float64Array like Float32Array', () => {
      expect(normalizeValue(0.0, 'Float64Array')).toBe(0);
      expect(normalizeValue(0.5, 'Float64Array')).toBe(128);
      expect(normalizeValue(1.0, 'Float64Array')).toBe(255);
    });

    it('should fallback to Uint8 for unknown types', () => {
      expect(normalizeValue(100, 'UnknownArray' as any)).toBe(100);
    });
  });

  describe('normalizeToColorMapRange', () => {
    it('should normalize values with provided range', () => {
      expect(normalizeToColorMapRange(0, [0, 100])).toBe(0);
      expect(normalizeToColorMapRange(50, [0, 100])).toBe(0.5);
      expect(normalizeToColorMapRange(100, [0, 100])).toBe(1);
    });

    it('should handle negative ranges', () => {
      expect(normalizeToColorMapRange(-100, [-100, 100])).toBe(0);
      expect(normalizeToColorMapRange(0, [-100, 100])).toBe(0.5);
      expect(normalizeToColorMapRange(100, [-100, 100])).toBe(1);
    });

    it('should clamp values outside range', () => {
      expect(normalizeToColorMapRange(-50, [0, 100])).toBe(0);
      expect(normalizeToColorMapRange(150, [0, 100])).toBe(1);
    });

    it('should handle single-value range', () => {
      expect(normalizeToColorMapRange(100, [100, 100])).toBe(0.5);
    });

    it('should assume normalized data without valueRange', () => {
      expect(normalizeToColorMapRange(0)).toBe(0);
      expect(normalizeToColorMapRange(0.5)).toBe(0.5);
      expect(normalizeToColorMapRange(1)).toBe(1);
    });

    it('should clamp values without valueRange', () => {
      expect(normalizeToColorMapRange(-0.5)).toBe(0);
      expect(normalizeToColorMapRange(1.5)).toBe(1);
    });

    it('should handle scientific data ranges', () => {
      // Temperature in Kelvin: 0-500K
      expect(normalizeToColorMapRange(0, [0, 500])).toBe(0);
      expect(normalizeToColorMapRange(250, [0, 500])).toBe(0.5);
      expect(normalizeToColorMapRange(500, [0, 500])).toBe(1);

      // Elevation in meters: -100 to 8848 (Mount Everest)
      expect(normalizeToColorMapRange(-100, [-100, 8848])).toBe(0);
      expect(normalizeToColorMapRange(4374, [-100, 8848])).toBeCloseTo(0.5, 2);
      expect(normalizeToColorMapRange(8848, [-100, 8848])).toBe(1);
    });
  });

  describe('autoDetectValueRange', () => {
    it('should detect range from Float32Array', () => {
      const data = new Float32Array([0, 10, 20, 30, 40, 50]);
      const range = autoDetectValueRange(data);
      expect(range).toEqual([0, 50]);
    });

    it('should detect range from Float64Array', () => {
      const data = new Float64Array([-100, -50, 0, 50, 100]);
      const range = autoDetectValueRange(data);
      expect(range).toEqual([-100, 100]);
    });

    it('should handle large arrays with sampling', () => {
      // Create large array
      const data = new Float32Array(100000);
      for (let i = 0; i < data.length; i++) {
        data[i] = i / 1000;
      }

      const range = autoDetectValueRange(data, 1000);
      expect(range[0]).toBeCloseTo(0, 1);
      // Max value should be close to 99.999, but sampling might not hit exact max
      expect(range[1]).toBeGreaterThan(99);
      expect(range[1]).toBeLessThanOrEqual(100);
    });

    it('should ignore non-finite values', () => {
      const data = new Float32Array([
        NaN,
        -Infinity,
        0,
        10,
        20,
        Infinity,
        NaN,
      ]);
      const range = autoDetectValueRange(data);
      expect(range).toEqual([0, 20]);
    });

    it('should handle empty array', () => {
      const data = new Float32Array([]);
      const range = autoDetectValueRange(data);
      expect(range).toEqual([0, 1]); // Fallback
    });

    it('should handle all-invalid array', () => {
      const data = new Float32Array([NaN, NaN, Infinity, -Infinity]);
      const range = autoDetectValueRange(data);
      expect(range).toEqual([0, 1]); // Fallback
    });

    it('should handle single-value array', () => {
      const data = new Float32Array([42, 42, 42, 42]);
      const range = autoDetectValueRange(data);
      expect(range).toEqual([42, 43]); // Avoid division by zero
    });

    it('should work with custom sample size', () => {
      const data = new Float32Array(10000);
      for (let i = 0; i < data.length; i++) {
        data[i] = i;
      }

      const range1 = autoDetectValueRange(data, 10);
      const range2 = autoDetectValueRange(data, 1000);

      // Both should find min at 0
      expect(range1[0]).toBe(0);
      expect(range2[0]).toBe(0);

      // Both should find max close to 9999, but sampling might vary
      expect(range1[1]).toBeGreaterThanOrEqual(9000);
      expect(range2[1]).toBeGreaterThanOrEqual(9000);
      expect(range1[1]).toBeLessThanOrEqual(10000);
      expect(range2[1]).toBeLessThanOrEqual(10000);
    });
  });

  describe('isFloatType', () => {
    it('should return true for Float32Array', () => {
      expect(isFloatType('Float32Array')).toBe(true);
    });

    it('should return true for Float64Array', () => {
      expect(isFloatType('Float64Array')).toBe(true);
    });

    it('should return false for integer types', () => {
      expect(isFloatType('Uint8Array')).toBe(false);
      expect(isFloatType('Uint16Array')).toBe(false);
      expect(isFloatType('Int16Array')).toBe(false);
      expect(isFloatType('Uint32Array')).toBe(false);
      expect(isFloatType('Int32Array')).toBe(false);
    });
  });

  describe('getTypeRange', () => {
    it('should return correct range for Uint8Array', () => {
      expect(getTypeRange('Uint8Array')).toEqual([0, 255]);
    });

    it('should return correct range for Uint16Array', () => {
      expect(getTypeRange('Uint16Array')).toEqual([0, 65535]);
    });

    it('should return correct range for Int16Array', () => {
      expect(getTypeRange('Int16Array')).toEqual([-32768, 32767]);
    });

    it('should return correct range for Uint32Array', () => {
      expect(getTypeRange('Uint32Array')).toEqual([0, 4294967295]);
    });

    it('should return correct range for Int32Array', () => {
      expect(getTypeRange('Int32Array')).toEqual([-2147483648, 2147483647]);
    });

    it('should return normalized range for Float32Array', () => {
      expect(getTypeRange('Float32Array')).toEqual([0, 1]);
    });

    it('should return normalized range for Float64Array', () => {
      expect(getTypeRange('Float64Array')).toEqual([0, 1]);
    });

    it('should fallback to Uint8 range for unknown type', () => {
      expect(getTypeRange('UnknownArray' as any)).toEqual([0, 255]);
    });
  });

  describe('Integration scenarios', () => {
    it('should normalize scientific elevation data', () => {
      // Elevation data in meters: -100 to 8848
      const elevationValue = 4374; // Mid-range
      const valueRange: [number, number] = [-100, 8848];

      const normalized = normalizeToColorMapRange(elevationValue, valueRange);
      expect(normalized).toBeCloseTo(0.5, 2);
    });

    it('should normalize temperature data', () => {
      // Temperature in Celsius: -50 to 50
      const temperatures = new Float32Array([-50, -25, 0, 25, 50]);
      const valueRange: [number, number] = [-50, 50];

      const normalized = temperatures.map(t =>
        normalizeToColorMapRange(t, valueRange),
      );

      expect(normalized[0]).toBe(0); // -50°C
      expect(normalized[2]).toBe(0.5); // 0°C
      expect(normalized[4]).toBe(1); // 50°C
    });

    it('should handle DEM (Digital Elevation Model) workflow', () => {
      // Simulated DEM data with Float32 values
      const demData = new Float32Array([
        100, 200, 300, 400, 500, 600, 700, 800,
      ]);

      // Auto-detect range
      const range = autoDetectValueRange(demData);
      expect(range).toEqual([100, 800]);

      // Normalize a value using detected range
      const elevationValue = 450;
      const normalized = normalizeToColorMapRange(elevationValue, range);
      expect(normalized).toBe(0.5);
    });

    it('should handle satellite imagery workflow', () => {
      // Satellite data often comes as Uint16
      const satelliteValue = 32768; // Mid-range of Uint16

      const normalized = normalizeValue(satelliteValue, 'Uint16Array');
      expect(normalized).toBeCloseTo(128, 0); // Mid-range of 0-255
    });
  });
});
