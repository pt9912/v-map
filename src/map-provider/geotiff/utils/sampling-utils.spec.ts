import { sampleNearest, sampleBilinear, type TypedArray } from './sampling-utils';
import { type ColorStop } from './colormap-utils';

describe('Sampling Utilities', () => {
  describe('sampleNearest', () => {
    describe('Grayscale (Single Band) without ColorMap', () => {
      it('should sample grayscale Uint8Array values', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([0, 50, 100, 150, 200, 255]),
        ];
        const width = 3;
        const height = 2;

        // Sample center pixel (1, 0)
        const result = sampleNearest(
          1.2,
          0.3,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );
        expect(result).toEqual([50, 50, 50, 255]);
      });

      it('should sample grayscale Uint16Array values', () => {
        const rasterBands: TypedArray[] = [
          new Uint16Array([0, 32768, 65535]),
        ];
        const width = 3;
        const height = 1;

        const result = sampleNearest(
          1.2,
          0.3,
          rasterBands,
          'Uint16Array',
          width,
          height,
          0,
          0,
        );
        // 32768 normalized to 0-255 range
        expect(result![0]).toBeCloseTo(128, 0);
        expect(result![1]).toBeCloseTo(128, 0);
        expect(result![2]).toBeCloseTo(128, 0);
        expect(result![3]).toBe(255);
      });

      it('should handle Float32Array with normalization', () => {
        const rasterBands: TypedArray[] = [new Float32Array([0.0, 0.5, 1.0])];
        const width = 3;
        const height = 1;

        const result = sampleNearest(
          1.0,
          0.0,
          rasterBands,
          'Float32Array',
          width,
          height,
          0,
          0,
        );
        expect(result).toEqual([128, 128, 128, 255]);
      });
    });

    describe('Grayscale (Single Band) with ColorMap', () => {
      const colorStops: ColorStop[] = [
        { value: 0.0, color: [0, 0, 255] }, // Blue at 0
        { value: 0.5, color: [0, 255, 0] }, // Green at 0.5
        { value: 1.0, color: [255, 0, 0] }, // Red at 1
      ];

      it('should apply colormap to grayscale data', () => {
        const rasterBands: TypedArray[] = [new Float32Array([0.0, 0.5, 1.0])];
        const width = 3;
        const height = 1;

        // Sample 0.0 value (should be blue)
        const result0 = sampleNearest(
          0.0,
          0.0,
          rasterBands,
          'Float32Array',
          width,
          height,
          0,
          0,
          colorStops,
        );
        expect(result0).toEqual([0, 0, 255, 255]);

        // Sample 0.5 value (should be green)
        const result1 = sampleNearest(
          1.0,
          0.0,
          rasterBands,
          'Float32Array',
          width,
          height,
          0,
          0,
          colorStops,
        );
        expect(result1).toEqual([0, 255, 0, 255]);

        // Sample 1.0 value (should be red)
        const result2 = sampleNearest(
          2.0,
          0.0,
          rasterBands,
          'Float32Array',
          width,
          height,
          0,
          0,
          colorStops,
        );
        expect(result2).toEqual([255, 0, 0, 255]);
      });
    });

    describe('RGB (3 Bands)', () => {
      it('should sample RGB values', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([255, 100, 50]), // R
          new Uint8Array([0, 150, 100]), // G
          new Uint8Array([128, 200, 255]), // B
        ];
        const width = 3;
        const height = 1;

        const result = sampleNearest(
          1.0,
          0.0,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );
        expect(result).toEqual([100, 150, 200, 255]);
      });

      it('should normalize RGB Uint16Array values', () => {
        const rasterBands: TypedArray[] = [
          new Uint16Array([65535, 32768, 0]), // R
          new Uint16Array([0, 32768, 65535]), // G
          new Uint16Array([32768, 32768, 32768]), // B
        ];
        const width = 3;
        const height = 1;

        const result = sampleNearest(
          1.0,
          0.0,
          rasterBands,
          'Uint16Array',
          width,
          height,
          0,
          0,
        );
        expect(result![0]).toBeCloseTo(128, 0); // 32768 normalized
        expect(result![1]).toBeCloseTo(128, 0);
        expect(result![2]).toBeCloseTo(128, 0);
        expect(result![3]).toBe(255);
      });
    });

    describe('RGBA (4+ Bands)', () => {
      it('should sample RGBA values', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([255, 100, 50]), // R
          new Uint8Array([0, 150, 100]), // G
          new Uint8Array([128, 200, 255]), // B
          new Uint8Array([255, 128, 64]), // A
        ];
        const width = 3;
        const height = 1;

        const result = sampleNearest(
          1.0,
          0.0,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );
        expect(result).toEqual([100, 150, 200, 128]);
      });

      it('should ignore extra bands beyond 4', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([255]), // R
          new Uint8Array([128]), // G
          new Uint8Array([64]), // B
          new Uint8Array([200]), // A
          new Uint8Array([99]), // Extra band (ignored)
        ];
        const width = 1;
        const height = 1;

        const result = sampleNearest(
          0.0,
          0.0,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );
        expect(result).toEqual([255, 128, 64, 200]);
      });
    });

    describe('Bounds checking and offsets', () => {
      it('should return null for out-of-bounds coordinates', () => {
        const rasterBands: TypedArray[] = [new Uint8Array([100, 150, 200])];
        const width = 3;
        const height = 1;

        // Outside left
        expect(
          sampleNearest(-1, 0, rasterBands, 'Uint8Array', width, height, 0, 0),
        ).toBeNull();

        // Outside right
        expect(
          sampleNearest(3, 0, rasterBands, 'Uint8Array', width, height, 0, 0),
        ).toBeNull();

        // Outside top
        expect(
          sampleNearest(0, -1, rasterBands, 'Uint8Array', width, height, 0, 0),
        ).toBeNull();

        // Outside bottom
        expect(
          sampleNearest(0, 1, rasterBands, 'Uint8Array', width, height, 0, 0),
        ).toBeNull();
      });

      it('should handle window offsets correctly', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([0, 50, 100, 150, 200, 255]),
        ];
        const width = 3;
        const height = 2;
        const offsetX = 10;
        const offsetY = 5;

        // Sample at global coordinate (11, 5) -> local (1, 0)
        const result = sampleNearest(
          11,
          5,
          rasterBands,
          'Uint8Array',
          width,
          height,
          offsetX,
          offsetY,
        );
        expect(result).toEqual([50, 50, 50, 255]);
      });

      it('should handle rounding correctly', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([10, 20, 30, 40]),
        ];
        const width = 4;
        const height = 1;

        // 1.4 rounds to 1
        const result1 = sampleNearest(
          1.4,
          0.0,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );
        expect(result1).toEqual([20, 20, 20, 255]);

        // 1.6 rounds to 2
        const result2 = sampleNearest(
          1.6,
          0.0,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );
        expect(result2).toEqual([30, 30, 30, 255]);
      });
    });
  });

  describe('sampleBilinear', () => {
    describe('Grayscale (Single Band) without ColorMap', () => {
      it('should interpolate between four pixels', () => {
        // Create a 2x2 grid with known values
        const rasterBands: TypedArray[] = [
          new Uint8Array([
            0, 100, // row 0: values 0, 100
            100, 200, // row 1: values 100, 200
          ]),
        ];
        const width = 2;
        const height = 2;

        // Sample at center (0.5, 0.5) - should be average of all four
        const result = sampleBilinear(
          0.5,
          0.5,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );

        // Expected: (0 + 100 + 100 + 200) / 4 = 100
        expect(result![0]).toBe(100);
        expect(result![1]).toBe(100);
        expect(result![2]).toBe(100);
        expect(result![3]).toBe(255);
      });

      it('should interpolate at arbitrary positions', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([
            0, 100, // row 0
            0, 100, // row 1
          ]),
        ];
        const width = 2;
        const height = 2;

        // Sample at (0.5, 0.0) - horizontal center, top edge
        const result = sampleBilinear(
          0.5,
          0.0,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );
        // Expected: interpolate between 0 and 100 at x=0.5 -> 50
        expect(result![0]).toBe(50);
      });

      it('should handle Float32Array interpolation', () => {
        const rasterBands: TypedArray[] = [
          new Float32Array([
            0.0, 1.0, // row 0
            0.0, 1.0, // row 1
          ]),
        ];
        const width = 2;
        const height = 2;

        const result = sampleBilinear(
          0.5,
          0.5,
          rasterBands,
          'Float32Array',
          width,
          height,
          0,
          0,
        );
        // Average of 0, 1, 0, 1 = 0.5 -> normalized to 128
        expect(result![0]).toBe(128);
      });
    });

    describe('Grayscale (Single Band) with ColorMap', () => {
      const colorStops: ColorStop[] = [
        { value: 0.0, color: [0, 0, 0] },
        { value: 0.5, color: [128, 128, 128] },
        { value: 1.0, color: [255, 255, 255] },
      ];

      it('should apply colormap after interpolation', () => {
        const rasterBands: TypedArray[] = [
          new Float32Array([
            0.0, 1.0, // row 0
            0.0, 1.0, // row 1
          ]),
        ];
        const width = 2;
        const height = 2;

        // Interpolate at center: (0 + 1 + 0 + 1) / 4 = 0.5
        const result = sampleBilinear(
          0.5,
          0.5,
          rasterBands,
          'Float32Array',
          width,
          height,
          0,
          0,
          colorStops,
        );

        // 0.5 should map to middle gray (128, 128, 128)
        expect(result![0]).toBe(128);
        expect(result![1]).toBe(128);
        expect(result![2]).toBe(128);
        expect(result![3]).toBe(255);
      });
    });

    describe('RGB (3 Bands)', () => {
      it('should interpolate each band independently', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([0, 100, 0, 100]), // R: 0,100 / 0,100
          new Uint8Array([0, 0, 200, 200]), // G: 0,0 / 200,200
          new Uint8Array([50, 50, 150, 150]), // B: 50,50 / 150,150
        ];
        const width = 2;
        const height = 2;

        const result = sampleBilinear(
          0.5,
          0.5,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );

        // R: (0 + 100 + 0 + 100) / 4 = 50
        expect(result![0]).toBe(50);
        // G: (0 + 0 + 200 + 200) / 4 = 100
        expect(result![1]).toBe(100);
        // B: (50 + 50 + 150 + 150) / 4 = 100
        expect(result![2]).toBe(100);
        expect(result![3]).toBe(255);
      });
    });

    describe('RGBA (4 Bands)', () => {
      it('should interpolate all four bands including alpha', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([0, 100, 0, 100]), // R
          new Uint8Array([0, 0, 100, 100]), // G
          new Uint8Array([0, 0, 0, 0]), // B
          new Uint8Array([0, 255, 255, 0]), // A
        ];
        const width = 2;
        const height = 2;

        const result = sampleBilinear(
          0.5,
          0.5,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );

        expect(result![0]).toBe(50); // R
        expect(result![1]).toBe(50); // G
        expect(result![2]).toBe(0); // B
        // A: (0 + 255 + 255 + 0) / 4 = 127.5
        expect(result![3]).toBeCloseTo(127.5, 1);
      });
    });

    describe('Bounds checking and offsets', () => {
      it('should return null for out-of-bounds coordinates', () => {
        const rasterBands: TypedArray[] = [new Uint8Array([0, 100, 100, 200])];
        const width = 2;
        const height = 2;

        // Outside left
        expect(
          sampleBilinear(-0.1, 0.5, rasterBands, 'Uint8Array', width, height, 0, 0),
        ).toBeNull();

        // Outside right (need width-1 clearance for interpolation)
        expect(
          sampleBilinear(1.0, 0.5, rasterBands, 'Uint8Array', width, height, 0, 0),
        ).toBeNull();

        // Outside top
        expect(
          sampleBilinear(0.5, -0.1, rasterBands, 'Uint8Array', width, height, 0, 0),
        ).toBeNull();

        // Outside bottom (need height-1 clearance for interpolation)
        expect(
          sampleBilinear(0.5, 1.0, rasterBands, 'Uint8Array', width, height, 0, 0),
        ).toBeNull();
      });

      it('should handle window offsets correctly', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([0, 100, 100, 200]),
        ];
        const width = 2;
        const height = 2;
        const offsetX = 10;
        const offsetY = 5;

        // Sample at global coordinate (10.5, 5.5) -> local (0.5, 0.5)
        const result = sampleBilinear(
          10.5,
          5.5,
          rasterBands,
          'Uint8Array',
          width,
          height,
          offsetX,
          offsetY,
        );
        expect(result![0]).toBe(100);
      });

      it('should work at exact pixel positions', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([10, 20, 30, 40]),
        ];
        const width = 2;
        const height = 2;

        // Sample at exact pixel (0, 0) - should return that value
        const result = sampleBilinear(
          0.0,
          0.0,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );
        expect(result![0]).toBe(10);
      });
    });

    describe('Interpolation accuracy', () => {
      it('should correctly interpolate horizontal gradients', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([
            0, 100, // row 0: gradient 0 to 100
            0, 100, // row 1: gradient 0 to 100
          ]),
        ];
        const width = 2;
        const height = 2;

        // Test at quarter points
        const result25 = sampleBilinear(
          0.25,
          0.0,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );
        expect(result25![0]).toBe(25); // 0 + 0.25 * (100 - 0)

        const result75 = sampleBilinear(
          0.75,
          0.0,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );
        expect(result75![0]).toBe(75); // 0 + 0.75 * (100 - 0)
      });

      it('should correctly interpolate vertical gradients', () => {
        const rasterBands: TypedArray[] = [
          new Uint8Array([
            0, 0, // row 0: all 0
            100, 100, // row 1: all 100
          ]),
        ];
        const width = 2;
        const height = 2;

        const result25 = sampleBilinear(
          0.0,
          0.25,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );
        expect(result25![0]).toBe(25); // 0 + 0.25 * (100 - 0)

        const result75 = sampleBilinear(
          0.0,
          0.75,
          rasterBands,
          'Uint8Array',
          width,
          height,
          0,
          0,
        );
        expect(result75![0]).toBe(75); // 0 + 0.75 * (100 - 0)
      });
    });
  });

  describe('Comparison: sampleNearest vs sampleBilinear', () => {
    it('should produce different results for sub-pixel positions', () => {
      const rasterBands: TypedArray[] = [
        new Uint8Array([
          0, 100,
          100, 200,
        ]),
      ];
      const width = 2;
      const height = 2;

      const nearest = sampleNearest(
        0.5,
        0.5,
        rasterBands,
        'Uint8Array',
        width,
        height,
        0,
        0,
      );
      const bilinear = sampleBilinear(
        0.5,
        0.5,
        rasterBands,
        'Uint8Array',
        width,
        height,
        0,
        0,
      );

      // Nearest will round to one of the corners
      // Bilinear will average all four corners (100)
      expect(nearest).not.toEqual(bilinear);
      expect(bilinear![0]).toBe(100);
    });

    it('should produce same results at exact pixel centers', () => {
      const rasterBands: TypedArray[] = [
        new Uint8Array([50, 100, 150, 200]),
      ];
      const width = 2;
      const height = 2;

      const nearest = sampleNearest(
        0.0,
        0.0,
        rasterBands,
        'Uint8Array',
        width,
        height,
        0,
        0,
      );
      const bilinear = sampleBilinear(
        0.0,
        0.0,
        rasterBands,
        'Uint8Array',
        width,
        height,
        0,
        0,
      );

      expect(nearest).toEqual(bilinear);
    });
  });
});
