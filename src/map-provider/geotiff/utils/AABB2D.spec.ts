import { AABB2D, Point2D, Triangle2D } from './AABB2D';
import type { ITriangle } from './Triangle';

describe('AABB2D', () => {
  // Helper function to create a Triangle2D
  const createTriangle = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
  ): Triangle2D => {
    const iTriangle: ITriangle = {
      source: [
        [x1, y1],
        [x2, y2],
        [x3, y3],
      ],
      target: [
        [x1, y1],
        [x2, y2],
        [x3, y3],
      ],
    };
    return {
      a: { x: x1, y: y1 },
      b: { x: x2, y: y2 },
      c: { x: x3, y: y3 },
      triangle: iTriangle,
      transform: null,
    };
  };

  describe('constructor', () => {
    it('should create AABB with min and max points', () => {
      const min: Point2D = { x: 0, y: 0 };
      const max: Point2D = { x: 10, y: 10 };
      const aabb = new AABB2D(min, max);

      expect(aabb.min).toEqual(min);
      expect(aabb.max).toEqual(max);
    });

    it('should accept negative coordinates', () => {
      const min: Point2D = { x: -10, y: -10 };
      const max: Point2D = { x: 10, y: 10 };
      const aabb = new AABB2D(min, max);

      expect(aabb.min.x).toBe(-10);
      expect(aabb.min.y).toBe(-10);
      expect(aabb.max.x).toBe(10);
      expect(aabb.max.y).toBe(10);
    });

    it('should accept floating point coordinates', () => {
      const min: Point2D = { x: 1.5, y: 2.7 };
      const max: Point2D = { x: 8.3, y: 9.1 };
      const aabb = new AABB2D(min, max);

      expect(aabb.min.x).toBe(1.5);
      expect(aabb.min.y).toBe(2.7);
      expect(aabb.max.x).toBe(8.3);
      expect(aabb.max.y).toBe(9.1);
    });

    it('should handle zero-area AABB (point)', () => {
      const point: Point2D = { x: 5, y: 5 };
      const aabb = new AABB2D(point, point);

      expect(aabb.min).toEqual(aabb.max);
    });
  });

  describe('contains', () => {
    it('should return true for point inside AABB', () => {
      const aabb = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const point: Point2D = { x: 5, y: 5 };

      expect(aabb.contains(point)).toBe(true);
    });

    it('should return true for point on min corner', () => {
      const aabb = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const point: Point2D = { x: 0, y: 0 };

      expect(aabb.contains(point)).toBe(true);
    });

    it('should return true for point on max corner', () => {
      const aabb = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const point: Point2D = { x: 10, y: 10 };

      expect(aabb.contains(point)).toBe(true);
    });

    it('should return true for point on edge', () => {
      const aabb = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });

      expect(aabb.contains({ x: 5, y: 0 })).toBe(true); // Bottom edge
      expect(aabb.contains({ x: 5, y: 10 })).toBe(true); // Top edge
      expect(aabb.contains({ x: 0, y: 5 })).toBe(true); // Left edge
      expect(aabb.contains({ x: 10, y: 5 })).toBe(true); // Right edge
    });

    it('should return false for point outside AABB (left)', () => {
      const aabb = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const point: Point2D = { x: -1, y: 5 };

      expect(aabb.contains(point)).toBe(false);
    });

    it('should return false for point outside AABB (right)', () => {
      const aabb = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const point: Point2D = { x: 11, y: 5 };

      expect(aabb.contains(point)).toBe(false);
    });

    it('should return false for point outside AABB (below)', () => {
      const aabb = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const point: Point2D = { x: 5, y: -1 };

      expect(aabb.contains(point)).toBe(false);
    });

    it('should return false for point outside AABB (above)', () => {
      const aabb = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const point: Point2D = { x: 5, y: 11 };

      expect(aabb.contains(point)).toBe(false);
    });

    it('should return false for point outside AABB (diagonal)', () => {
      const aabb = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const point: Point2D = { x: 15, y: 15 };

      expect(aabb.contains(point)).toBe(false);
    });

    it('should work with negative coordinates', () => {
      const aabb = new AABB2D({ x: -10, y: -10 }, { x: 0, y: 0 });

      expect(aabb.contains({ x: -5, y: -5 })).toBe(true);
      expect(aabb.contains({ x: -10, y: -10 })).toBe(true);
      expect(aabb.contains({ x: 0, y: 0 })).toBe(true);
      expect(aabb.contains({ x: 5, y: 5 })).toBe(false);
    });

    it('should work with floating point coordinates', () => {
      const aabb = new AABB2D({ x: 1.5, y: 2.5 }, { x: 8.5, y: 9.5 });

      expect(aabb.contains({ x: 5.0, y: 6.0 })).toBe(true);
      expect(aabb.contains({ x: 1.5, y: 2.5 })).toBe(true);
      expect(aabb.contains({ x: 8.5, y: 9.5 })).toBe(true);
      expect(aabb.contains({ x: 1.4, y: 6.0 })).toBe(false);
    });

    it('should handle zero-area AABB', () => {
      const aabb = new AABB2D({ x: 5, y: 5 }, { x: 5, y: 5 });

      expect(aabb.contains({ x: 5, y: 5 })).toBe(true);
      expect(aabb.contains({ x: 5.1, y: 5 })).toBe(false);
      expect(aabb.contains({ x: 5, y: 5.1 })).toBe(false);
    });
  });

  describe('fromTriangle', () => {
    it('should create AABB from triangle', () => {
      const triangle = createTriangle(0, 0, 10, 0, 5, 10);
      const aabb = AABB2D.fromTriangle(triangle);

      expect(aabb.min.x).toBe(0);
      expect(aabb.min.y).toBe(0);
      expect(aabb.max.x).toBe(10);
      expect(aabb.max.y).toBe(10);
    });

    it('should handle triangle with negative coordinates', () => {
      const triangle = createTriangle(-5, -5, 5, -5, 0, 5);
      const aabb = AABB2D.fromTriangle(triangle);

      expect(aabb.min.x).toBe(-5);
      expect(aabb.min.y).toBe(-5);
      expect(aabb.max.x).toBe(5);
      expect(aabb.max.y).toBe(5);
    });

    it('should handle triangle with floating point coordinates', () => {
      const triangle = createTriangle(1.5, 2.3, 8.7, 1.2, 5.5, 9.8);
      const aabb = AABB2D.fromTriangle(triangle);

      expect(aabb.min.x).toBe(1.5);
      expect(aabb.min.y).toBe(1.2);
      expect(aabb.max.x).toBe(8.7);
      expect(aabb.max.y).toBe(9.8);
    });

    it('should handle degenerate triangle (line)', () => {
      const triangle = createTriangle(0, 0, 10, 10, 5, 5);
      const aabb = AABB2D.fromTriangle(triangle);

      expect(aabb.min.x).toBe(0);
      expect(aabb.min.y).toBe(0);
      expect(aabb.max.x).toBe(10);
      expect(aabb.max.y).toBe(10);
    });

    it('should handle degenerate triangle (point)', () => {
      const triangle = createTriangle(5, 5, 5, 5, 5, 5);
      const aabb = AABB2D.fromTriangle(triangle);

      expect(aabb.min.x).toBe(5);
      expect(aabb.min.y).toBe(5);
      expect(aabb.max.x).toBe(5);
      expect(aabb.max.y).toBe(5);
    });

    it('should create tight bounding box', () => {
      const triangle = createTriangle(3, 7, 9, 2, 1, 8);
      const aabb = AABB2D.fromTriangle(triangle);

      // Bounding box should be tight (not larger than necessary)
      expect(aabb.min.x).toBe(Math.min(3, 9, 1));
      expect(aabb.min.y).toBe(Math.min(7, 2, 8));
      expect(aabb.max.x).toBe(Math.max(3, 9, 1));
      expect(aabb.max.y).toBe(Math.max(7, 2, 8));
    });

    it('should contain all triangle vertices', () => {
      const triangle = createTriangle(2, 3, 8, 1, 5, 9);
      const aabb = AABB2D.fromTriangle(triangle);

      expect(aabb.contains(triangle.a)).toBe(true);
      expect(aabb.contains(triangle.b)).toBe(true);
      expect(aabb.contains(triangle.c)).toBe(true);
    });
  });

  describe('union', () => {
    it('should create union of two AABBs', () => {
      const aabb1 = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const aabb2 = new AABB2D({ x: 5, y: 5 }, { x: 15, y: 15 });

      const union = AABB2D.union(aabb1, aabb2);

      expect(union.min.x).toBe(0);
      expect(union.min.y).toBe(0);
      expect(union.max.x).toBe(15);
      expect(union.max.y).toBe(15);
    });

    it('should handle non-overlapping AABBs', () => {
      const aabb1 = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const aabb2 = new AABB2D({ x: 20, y: 20 }, { x: 30, y: 30 });

      const union = AABB2D.union(aabb1, aabb2);

      expect(union.min.x).toBe(0);
      expect(union.min.y).toBe(0);
      expect(union.max.x).toBe(30);
      expect(union.max.y).toBe(30);
    });

    it('should handle one AABB containing another', () => {
      const aabb1 = new AABB2D({ x: 0, y: 0 }, { x: 20, y: 20 });
      const aabb2 = new AABB2D({ x: 5, y: 5 }, { x: 15, y: 15 });

      const union = AABB2D.union(aabb1, aabb2);

      expect(union.min).toEqual(aabb1.min);
      expect(union.max).toEqual(aabb1.max);
    });

    it('should handle identical AABBs', () => {
      const aabb1 = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const aabb2 = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });

      const union = AABB2D.union(aabb1, aabb2);

      expect(union.min).toEqual(aabb1.min);
      expect(union.max).toEqual(aabb1.max);
    });

    it('should handle negative coordinates', () => {
      const aabb1 = new AABB2D({ x: -10, y: -10 }, { x: 0, y: 0 });
      const aabb2 = new AABB2D({ x: -5, y: -5 }, { x: 5, y: 5 });

      const union = AABB2D.union(aabb1, aabb2);

      expect(union.min.x).toBe(-10);
      expect(union.min.y).toBe(-10);
      expect(union.max.x).toBe(5);
      expect(union.max.y).toBe(5);
    });

    it('should handle floating point coordinates', () => {
      const aabb1 = new AABB2D({ x: 1.5, y: 2.3 }, { x: 8.7, y: 9.2 });
      const aabb2 = new AABB2D({ x: 3.2, y: 5.1 }, { x: 12.4, y: 15.8 });

      const union = AABB2D.union(aabb1, aabb2);

      expect(union.min.x).toBe(1.5);
      expect(union.min.y).toBe(2.3);
      expect(union.max.x).toBe(12.4);
      expect(union.max.y).toBe(15.8);
    });

    it('should be commutative', () => {
      const aabb1 = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const aabb2 = new AABB2D({ x: 5, y: 5 }, { x: 15, y: 15 });

      const union1 = AABB2D.union(aabb1, aabb2);
      const union2 = AABB2D.union(aabb2, aabb1);

      expect(union1.min).toEqual(union2.min);
      expect(union1.max).toEqual(union2.max);
    });

    it('should contain both input AABBs', () => {
      const aabb1 = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const aabb2 = new AABB2D({ x: 5, y: 5 }, { x: 15, y: 15 });

      const union = AABB2D.union(aabb1, aabb2);

      // Check if all corners of both AABBs are contained in union
      expect(union.contains(aabb1.min)).toBe(true);
      expect(union.contains(aabb1.max)).toBe(true);
      expect(union.contains(aabb2.min)).toBe(true);
      expect(union.contains(aabb2.max)).toBe(true);
    });

    it('should handle zero-area AABBs', () => {
      const aabb1 = new AABB2D({ x: 5, y: 5 }, { x: 5, y: 5 });
      const aabb2 = new AABB2D({ x: 10, y: 10 }, { x: 10, y: 10 });

      const union = AABB2D.union(aabb1, aabb2);

      expect(union.min.x).toBe(5);
      expect(union.min.y).toBe(5);
      expect(union.max.x).toBe(10);
      expect(union.max.y).toBe(10);
    });
  });

  describe('Integration scenarios', () => {
    it('should work with multiple triangle unions', () => {
      const triangle1 = createTriangle(0, 0, 10, 0, 5, 10);
      const triangle2 = createTriangle(10, 0, 20, 0, 15, 10);
      const triangle3 = createTriangle(20, 0, 30, 0, 25, 10);

      const aabb1 = AABB2D.fromTriangle(triangle1);
      const aabb2 = AABB2D.fromTriangle(triangle2);
      const aabb3 = AABB2D.fromTriangle(triangle3);

      const union12 = AABB2D.union(aabb1, aabb2);
      const unionAll = AABB2D.union(union12, aabb3);

      expect(unionAll.min.x).toBe(0);
      expect(unionAll.min.y).toBe(0);
      expect(unionAll.max.x).toBe(30);
      expect(unionAll.max.y).toBe(10);
    });

    it('should efficiently test point containment after union', () => {
      const aabb1 = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const aabb2 = new AABB2D({ x: 20, y: 20 }, { x: 30, y: 30 });
      const union = AABB2D.union(aabb1, aabb2);

      // Points in original AABBs should be in union
      expect(union.contains({ x: 5, y: 5 })).toBe(true);
      expect(union.contains({ x: 25, y: 25 })).toBe(true);

      // Points in gap should also be in union
      expect(union.contains({ x: 15, y: 15 })).toBe(true);

      // Points outside should not be in union
      expect(union.contains({ x: -5, y: 5 })).toBe(false);
      expect(union.contains({ x: 35, y: 25 })).toBe(false);
    });

    it('should handle grid of triangles', () => {
      const triangles: Triangle2D[] = [];
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          const x = i * 10;
          const y = j * 10;
          triangles.push(createTriangle(x, y, x + 10, y, x + 5, y + 10));
        }
      }

      // Create AABB for each triangle
      const aabbs = triangles.map(t => AABB2D.fromTriangle(t));

      // Union all AABBs
      let totalAABB = aabbs[0];
      for (let i = 1; i < aabbs.length; i++) {
        totalAABB = AABB2D.union(totalAABB, aabbs[i]);
      }

      // Should cover entire grid
      expect(totalAABB.min.x).toBe(0);
      expect(totalAABB.min.y).toBe(0);
      expect(totalAABB.max.x).toBe(50);
      expect(totalAABB.max.y).toBe(50);
    });

    it('should work with real-world geographic coordinates', () => {
      // Simulate geographic coordinates (longitude, latitude)
      const aabb1 = new AABB2D(
        { x: -122.5, y: 37.7 }, // San Francisco area (W, S)
        { x: -122.3, y: 37.9 }, // (E, N)
      );
      const aabb2 = new AABB2D(
        { x: -122.4, y: 37.8 }, // Overlapping area
        { x: -122.2, y: 38.0 },
      );

      const union = AABB2D.union(aabb1, aabb2);

      expect(union.min.x).toBeCloseTo(-122.5, 1);
      expect(union.min.y).toBeCloseTo(37.7, 1);
      expect(union.max.x).toBeCloseTo(-122.2, 1);
      expect(union.max.y).toBeCloseTo(38.0, 1);

      // Test point in San Francisco
      const sfPoint: Point2D = { x: -122.4, y: 37.8 };
      expect(union.contains(sfPoint)).toBe(true);
    });
  });

  describe('Edge cases and robustness', () => {
    it('should handle very large coordinates', () => {
      const aabb = new AABB2D(
        { x: 1e10, y: 1e10 },
        { x: 1e10 + 100, y: 1e10 + 100 },
      );

      expect(aabb.contains({ x: 1e10 + 50, y: 1e10 + 50 })).toBe(true);
      expect(aabb.contains({ x: 1e10 - 1, y: 1e10 + 50 })).toBe(false);
    });

    it('should handle very small coordinates', () => {
      const aabb = new AABB2D({ x: 1e-10, y: 1e-10 }, { x: 1e-9, y: 1e-9 });

      expect(aabb.contains({ x: 5e-10, y: 5e-10 })).toBe(true);
    });

    it('should handle mixed positive and negative', () => {
      const aabb = new AABB2D({ x: -100, y: -50 }, { x: 100, y: 50 });

      expect(aabb.contains({ x: 0, y: 0 })).toBe(true);
      expect(aabb.contains({ x: -50, y: 25 })).toBe(true);
      expect(aabb.contains({ x: 50, y: -25 })).toBe(true);
    });

    it('should be consistent with multiple operations', () => {
      const aabb1 = new AABB2D({ x: 0, y: 0 }, { x: 10, y: 10 });
      const aabb2 = new AABB2D({ x: 5, y: 5 }, { x: 15, y: 15 });
      const aabb3 = new AABB2D({ x: 10, y: 10 }, { x: 20, y: 20 });

      // Associativity of union
      const union1 = AABB2D.union(AABB2D.union(aabb1, aabb2), aabb3);
      const union2 = AABB2D.union(aabb1, AABB2D.union(aabb2, aabb3));

      expect(union1.min.x).toBeCloseTo(union2.min.x);
      expect(union1.min.y).toBeCloseTo(union2.min.y);
      expect(union1.max.x).toBeCloseTo(union2.max.x);
      expect(union1.max.y).toBeCloseTo(union2.max.y);
    });
  });
});
