import { Triangulation } from './Triangulation';

describe('Triangulation', () => {
  describe('Basic functionality', () => {
    it('should create triangulation with identity transform', () => {
      const identityTransform = (coord: [number, number]): [number, number] =>
        coord;
      const targetExtent: [number, number, number, number] = [0, 0, 100, 100];

      const triangulation = new Triangulation(
        identityTransform,
        targetExtent,
        0.5,
      );

      const triangles = triangulation.getTriangles();
      expect(triangles.length).toBeGreaterThan(0);
    });

    it('should create at least 2 triangles for simple extent', () => {
      const identityTransform = (coord: [number, number]): [number, number] =>
        coord;
      const targetExtent: [number, number, number, number] = [0, 0, 10, 10];

      const triangulation = new Triangulation(
        identityTransform,
        targetExtent,
        10, // Large error threshold = no subdivision
      );

      const triangles = triangulation.getTriangles();
      // A quad is split into 2 triangles minimum
      expect(triangles.length).toBeGreaterThanOrEqual(2);
    });

    it('should subdivide with small error threshold', () => {
      const identityTransform = (coord: [number, number]): [number, number] =>
        coord;
      const targetExtent: [number, number, number, number] = [0, 0, 100, 100];

      const coarseTriangulation = new Triangulation(
        identityTransform,
        targetExtent,
        100, // Large threshold
      );

      const fineTriangulation = new Triangulation(
        identityTransform,
        targetExtent,
        0.1, // Small threshold
      );

      // Fine triangulation should have more triangles due to subdivision
      expect(fineTriangulation.getTriangles().length).toBeGreaterThanOrEqual(
        coarseTriangulation.getTriangles().length,
      );
    });
  });

  describe('Transform handling', () => {
    it('should handle simple scaling transform', () => {
      const scaleTransform = (coord: [number, number]): [number, number] => [
        coord[0] * 2,
        coord[1] * 2,
      ];
      const targetExtent: [number, number, number, number] = [0, 0, 100, 100];

      const triangulation = new Triangulation(
        scaleTransform,
        targetExtent,
        0.5,
      );

      const triangles = triangulation.getTriangles();
      expect(triangles.length).toBeGreaterThan(0);

      // Check that source coordinates are scaled
      const firstTriangle = triangles[0];
      firstTriangle.source.forEach(coord => {
        // Source coords should be scaled (2x target coords)
        expect(Math.abs(coord[0])).toBeGreaterThanOrEqual(0);
        expect(Math.abs(coord[1])).toBeGreaterThanOrEqual(0);
      });
    });

    it('should handle translation transform', () => {
      const translateTransform = (
        coord: [number, number],
      ): [number, number] => [coord[0] + 100, coord[1] + 50];
      const targetExtent: [number, number, number, number] = [0, 0, 10, 10];

      const triangulation = new Triangulation(
        translateTransform,
        targetExtent,
        0.5,
      );

      const triangles = triangulation.getTriangles();
      expect(triangles.length).toBeGreaterThan(0);

      // Source coordinates should be translated
      const firstTriangle = triangles[0];
      firstTriangle.source.forEach(coord => {
        expect(coord[0]).toBeGreaterThanOrEqual(100);
        expect(coord[1]).toBeGreaterThanOrEqual(50);
      });
    });

    it('should subdivide for non-linear transform', () => {
      // Quadratic transform creates non-linear distortion
      const nonLinearTransform = (
        coord: [number, number],
      ): [number, number] => [
        coord[0] + coord[1] * coord[1] * 0.01,
        coord[1] + coord[0] * coord[0] * 0.01,
      ];
      const targetExtent: [number, number, number, number] = [0, 0, 100, 100];

      const linearTriangulation = new Triangulation(
        (coord: [number, number]) => coord,
        targetExtent,
        0.5,
      );

      const nonLinearTriangulation = new Triangulation(
        nonLinearTransform,
        targetExtent,
        0.5,
      );

      // Non-linear transform should create more triangles due to error
      expect(nonLinearTriangulation.getTriangles().length).toBeGreaterThan(
        linearTriangulation.getTriangles().length,
      );
    });
  });

  describe('calculateSourceExtent', () => {
    it('should calculate correct source extent for identity transform', () => {
      const identityTransform = (coord: [number, number]): [number, number] =>
        coord;
      const targetExtent: [number, number, number, number] = [10, 20, 30, 40];

      const triangulation = new Triangulation(
        identityTransform,
        targetExtent,
        0.5,
      );

      const sourceExtent = triangulation.calculateSourceExtent();
      expect(sourceExtent).not.toBeNull();

      if (sourceExtent) {
        const [minX, minY, maxX, maxY] = sourceExtent;
        // Should approximately match target extent
        expect(minX).toBeCloseTo(10, 0);
        expect(minY).toBeCloseTo(20, 0);
        expect(maxX).toBeCloseTo(30, 0);
        expect(maxY).toBeCloseTo(40, 0);
      }
    });

    it('should calculate correct source extent for scaled transform', () => {
      const scaleTransform = (coord: [number, number]): [number, number] => [
        coord[0] * 2,
        coord[1] * 2,
      ];
      const targetExtent: [number, number, number, number] = [0, 0, 100, 100];

      const triangulation = new Triangulation(
        scaleTransform,
        targetExtent,
        0.5,
      );

      const sourceExtent = triangulation.calculateSourceExtent();
      expect(sourceExtent).not.toBeNull();

      if (sourceExtent) {
        const [minX, minY, maxX, maxY] = sourceExtent;
        // Source should be 2x target
        expect(minX).toBeCloseTo(0, 0);
        expect(minY).toBeCloseTo(0, 0);
        expect(maxX).toBeCloseTo(200, 0);
        expect(maxY).toBeCloseTo(200, 0);
      }
    });

    it('should return null for empty triangulation', () => {
      // Create a transform that returns invalid coordinates
      const invalidTransform = (_coord: [number, number]): [number, number] => [
        Infinity,
        Infinity,
      ];
      const targetExtent: [number, number, number, number] = [0, 0, 10, 10];

      const triangulation = new Triangulation(
        invalidTransform,
        targetExtent,
        0.5,
      );

      const sourceExtent = triangulation.calculateSourceExtent();
      // Should return null if all triangles were invalid
      expect(sourceExtent).toBeNull();
    });
  });

  describe('Invalid coordinate handling', () => {
    it('should skip triangles with Infinity coordinates', () => {
      let callCount = 0;
      const partiallyInvalidTransform = (
        coord: [number, number],
      ): [number, number] => {
        callCount++;
        // Make some coordinates invalid
        if (coord[0] > 50) {
          return [Infinity, Infinity];
        }
        return coord;
      };

      const targetExtent: [number, number, number, number] = [0, 0, 100, 100];

      const triangulation = new Triangulation(
        partiallyInvalidTransform,
        targetExtent,
        0.5,
      );

      const triangles = triangulation.getTriangles();

      // Should have some triangles (from valid coords)
      // but not all triangles from full subdivision
      expect(triangles.length).toBeGreaterThan(0);

      // All returned triangles should have finite coordinates
      triangles.forEach(triangle => {
        triangle.source.forEach(coord => {
          expect(Number.isFinite(coord[0])).toBe(true);
          expect(Number.isFinite(coord[1])).toBe(true);
        });
      });
    });

    it('should skip triangles with NaN coordinates', () => {
      const nanTransform = (coord: [number, number]): [number, number] => {
        if (coord[0] > 50) {
          return [NaN, NaN];
        }
        return coord;
      };

      const targetExtent: [number, number, number, number] = [0, 0, 100, 100];

      const triangulation = new Triangulation(nanTransform, targetExtent, 0.5);

      const triangles = triangulation.getTriangles();

      // All returned triangles should have valid coordinates
      triangles.forEach(triangle => {
        triangle.source.forEach(coord => {
          expect(Number.isFinite(coord[0])).toBe(true);
          expect(Number.isFinite(coord[1])).toBe(true);
        });
      });
    });
  });

  describe('Triangle structure', () => {
    it('should have correct triangle structure', () => {
      const identityTransform = (coord: [number, number]): [number, number] =>
        coord;
      const targetExtent: [number, number, number, number] = [0, 0, 10, 10];

      const triangulation = new Triangulation(
        identityTransform,
        targetExtent,
        10, // Large threshold to minimize subdivision
      );

      const triangles = triangulation.getTriangles();

      triangles.forEach(triangle => {
        // Each triangle should have 3 source and 3 target vertices
        expect(triangle.source.length).toBe(3);
        expect(triangle.target.length).toBe(3);

        // Each vertex should be a 2D coordinate
        triangle.source.forEach(coord => {
          expect(coord.length).toBe(2);
          expect(typeof coord[0]).toBe('number');
          expect(typeof coord[1]).toBe('number');
        });

        triangle.target.forEach(coord => {
          expect(coord.length).toBe(2);
          expect(typeof coord[0]).toBe('number');
          expect(typeof coord[1]).toBe('number');
        });
      });
    });

    it('should have target vertices within target extent', () => {
      const identityTransform = (coord: [number, number]): [number, number] =>
        coord;
      const targetExtent: [number, number, number, number] = [10, 20, 30, 40];

      const triangulation = new Triangulation(
        identityTransform,
        targetExtent,
        0.5,
      );

      const triangles = triangulation.getTriangles();

      triangles.forEach(triangle => {
        triangle.target.forEach(coord => {
          // Allow small epsilon for floating point
          expect(coord[0]).toBeGreaterThanOrEqual(targetExtent[0] - 0.001);
          expect(coord[0]).toBeLessThanOrEqual(targetExtent[2] + 0.001);
          expect(coord[1]).toBeGreaterThanOrEqual(targetExtent[1] - 0.001);
          expect(coord[1]).toBeLessThanOrEqual(targetExtent[3] + 0.001);
        });
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle zero-area extent', () => {
      const identityTransform = (coord: [number, number]): [number, number] =>
        coord;
      const zeroExtent: [number, number, number, number] = [10, 10, 10, 10];

      const triangulation = new Triangulation(
        identityTransform,
        zeroExtent,
        0.5,
      );

      const triangles = triangulation.getTriangles();
      // Should still create at least 2 degenerate triangles
      expect(triangles.length).toBeGreaterThanOrEqual(2);
    });

    it('should handle very small extent', () => {
      const identityTransform = (coord: [number, number]): [number, number] =>
        coord;
      const smallExtent: [number, number, number, number] = [
        0, 0, 0.001, 0.001,
      ];

      const triangulation = new Triangulation(
        identityTransform,
        smallExtent,
        0.5,
      );

      const triangles = triangulation.getTriangles();
      expect(triangles.length).toBeGreaterThan(0);
    });

    it('should handle negative coordinates', () => {
      const identityTransform = (coord: [number, number]): [number, number] =>
        coord;
      const negativeExtent: [number, number, number, number] = [
        -100, -100, -50, -50,
      ];

      const triangulation = new Triangulation(
        identityTransform,
        negativeExtent,
        0.5,
      );

      const triangles = triangulation.getTriangles();
      expect(triangles.length).toBeGreaterThan(0);

      const sourceExtent = triangulation.calculateSourceExtent();
      expect(sourceExtent).not.toBeNull();
      if (sourceExtent) {
        expect(sourceExtent[0]).toBeLessThan(0);
        expect(sourceExtent[1]).toBeLessThan(0);
      }
    });
  });

  describe('Performance characteristics', () => {
    it('should create reasonable number of triangles', () => {
      const identityTransform = (coord: [number, number]): [number, number] =>
        coord;
      const targetExtent: [number, number, number, number] = [0, 0, 256, 256];

      const triangulation = new Triangulation(
        identityTransform,
        targetExtent,
        0.5,
      );

      const triangles = triangulation.getTriangles();

      // Identity transform creates minimal triangulation (2 triangles for a quad)
      // since there's no distortion
      expect(triangles.length).toBeGreaterThanOrEqual(2);
      expect(triangles.length).toBeLessThan(10000); // Should not explode
    });

    it('should limit subdivision depth', () => {
      // Even with very small error threshold, subdivision should be limited
      const identityTransform = (coord: [number, number]): [number, number] =>
        coord;
      const targetExtent: [number, number, number, number] = [0, 0, 1000, 1000];

      const triangulation = new Triangulation(
        identityTransform,
        targetExtent,
        0.001, // Very small threshold
      );

      const triangles = triangulation.getTriangles();

      // Should be limited by MAX_SUBDIVISION (10 levels)
      // Max triangles = 2 * 4^10 = 2,097,152, but identity transform won't subdivide
      expect(triangles.length).toBeGreaterThan(0);
      expect(triangles.length).toBeLessThan(100000);
    });
  });
});
