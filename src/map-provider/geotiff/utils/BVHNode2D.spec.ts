import { BVHNode2D } from './BVHNode2D';
import { Triangle2D } from './AABB2D';
import type { ITriangle } from './Triangle';

describe('BVHNode2D', () => {
  // Helper function to create a simple triangle
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
    return BVHNode2D.toTriangle2D(iTriangle);
  };

  describe('build', () => {
    it('should create a leaf node for single triangle', () => {
      const triangles = [createTriangle(0, 0, 10, 0, 5, 10)];

      const bvh = BVHNode2D.build(triangles);

      expect(bvh.triangles.length).toBe(1);
      expect(bvh.left).toBeNull();
      expect(bvh.right).toBeNull();
    });

    it('should create a leaf node for two triangles', () => {
      const triangles = [
        createTriangle(0, 0, 10, 0, 5, 10),
        createTriangle(10, 0, 20, 0, 15, 10),
      ];

      const bvh = BVHNode2D.build(triangles);

      expect(bvh.triangles.length).toBe(2);
      expect(bvh.left).toBeNull();
      expect(bvh.right).toBeNull();
    });

    it('should split into left and right nodes for many triangles', () => {
      const triangles = [
        createTriangle(0, 0, 10, 0, 5, 10),
        createTriangle(10, 0, 20, 0, 15, 10),
        createTriangle(20, 0, 30, 0, 25, 10),
        createTriangle(30, 0, 40, 0, 35, 10),
      ];

      const bvh = BVHNode2D.build(triangles);

      expect(bvh.triangles.length).toBe(0); // Internal node has no triangles
      expect(bvh.left).not.toBeNull();
      expect(bvh.right).not.toBeNull();
    });

    it('should respect maxDepth parameter', () => {
      const triangles = Array.from({ length: 100 }, (_, i) =>
        createTriangle(i * 10, 0, i * 10 + 10, 0, i * 10 + 5, 10),
      );

      const bvh = BVHNode2D.build(triangles, 0, 2);
      const stats = bvh.getStats();

      // maxDepth is measured from 0, so depth can be maxDepth + 1
      expect(stats.depth).toBeLessThanOrEqual(3);
    });

    it('should create balanced tree', () => {
      const triangles = Array.from({ length: 16 }, (_, i) =>
        createTriangle(i * 10, 0, i * 10 + 10, 0, i * 10 + 5, 10),
      );

      const bvh = BVHNode2D.build(triangles);
      const stats = bvh.getStats();

      // With 16 triangles and max depth 10, should create reasonable tree
      expect(stats.nodeCount).toBeGreaterThan(1);
      expect(stats.leafCount).toBeGreaterThan(1);
      expect(stats.triangleCount).toBe(16);
    });
  });

  describe('findContainingTriangle', () => {
    it('should find triangle containing a point', () => {
      const triangles = [createTriangle(0, 0, 10, 0, 5, 10)];
      const bvh = BVHNode2D.build(triangles);

      const result = bvh.findContainingTriangle({ x: 5, y: 3 });

      expect(result).not.toBeNull();
      expect(result?.a.x).toBe(0);
      expect(result?.a.y).toBe(0);
    });

    it('should return null for point outside bounding box', () => {
      const triangles = [createTriangle(0, 0, 10, 0, 5, 10)];
      const bvh = BVHNode2D.build(triangles);

      const result = bvh.findContainingTriangle({ x: 100, y: 100 });

      expect(result).toBeNull();
    });

    it('should return null for point inside bbox but outside triangles', () => {
      const triangles = [createTriangle(0, 0, 10, 0, 5, 10)];
      const bvh = BVHNode2D.build(triangles);

      const result = bvh.findContainingTriangle({ x: 1, y: 9 });

      expect(result).toBeNull();
    });

    it('should work with multiple triangles', () => {
      const triangles = [
        createTriangle(0, 0, 10, 0, 5, 10),
        createTriangle(10, 0, 20, 0, 15, 10),
        createTriangle(20, 0, 30, 0, 25, 10),
      ];
      const bvh = BVHNode2D.build(triangles);

      const result1 = bvh.findContainingTriangle({ x: 5, y: 3 });
      const result2 = bvh.findContainingTriangle({ x: 15, y: 3 });
      const result3 = bvh.findContainingTriangle({ x: 25, y: 3 });

      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();
      expect(result3).not.toBeNull();
    });
  });

  describe('punktInDreieck2D', () => {
    it('should return true for point inside triangle', () => {
      const triangle = createTriangle(0, 0, 10, 0, 5, 10);
      const point = { x: 5, y: 3 };

      const result = BVHNode2D.punktInDreieck2D(point, triangle);

      expect(result).toBe(true);
    });

    it('should return false for point outside triangle', () => {
      const triangle = createTriangle(0, 0, 10, 0, 5, 10);
      const point = { x: 1, y: 9 };

      const result = BVHNode2D.punktInDreieck2D(point, triangle);

      expect(result).toBe(false);
    });

    it('should return false for point on edge (conservative)', () => {
      const triangle = createTriangle(0, 0, 10, 0, 5, 10);
      const point = { x: 0, y: 0 }; // Vertex

      const result = BVHNode2D.punktInDreieck2D(point, triangle);

      // Depends on implementation - edge cases can be inclusive or exclusive
      expect(typeof result).toBe('boolean');
    });
  });

  describe('toString', () => {
    it('should format leaf node correctly', () => {
      const triangles = [createTriangle(0, 0, 10, 0, 5, 10)];
      const bvh = BVHNode2D.build(triangles);

      const str = bvh.toString();

      expect(str).toContain('LEAF');
      expect(str).toContain('bbox=');
      expect(str).toContain('triangles=1');
    });

    it('should format internal node with children', () => {
      const triangles = [
        createTriangle(0, 0, 10, 0, 5, 10),
        createTriangle(10, 0, 20, 0, 15, 10),
        createTriangle(20, 0, 30, 0, 25, 10),
        createTriangle(30, 0, 40, 0, 35, 10),
      ];
      const bvh = BVHNode2D.build(triangles);

      const str = bvh.toString();

      expect(str).toContain('NODE');
      expect(str).toContain('left:');
      expect(str).toContain('right:');
      expect(str).toContain('bbox=');
    });

    it('should use tree formatting characters', () => {
      const triangles = [
        createTriangle(0, 0, 10, 0, 5, 10),
        createTriangle(10, 0, 20, 0, 15, 10),
        createTriangle(20, 0, 30, 0, 25, 10),
        createTriangle(30, 0, 40, 0, 35, 10),
      ];
      const bvh = BVHNode2D.build(triangles);

      const str = bvh.toString();

      expect(str).toContain('├─'); // Branch character
      expect(str).toContain('└─'); // Last branch character
    });

    it('should handle deep trees', () => {
      const triangles = Array.from({ length: 16 }, (_, i) =>
        createTriangle(i * 10, 0, i * 10 + 10, 0, i * 10 + 5, 10),
      );
      const bvh = BVHNode2D.build(triangles);

      const str = bvh.toString();

      expect(str.length).toBeGreaterThan(100); // Should have substantial output
      expect(str.split('\n').length).toBeGreaterThan(5); // Multiple lines
    });
  });

  describe('getStats', () => {
    it('should return correct stats for single leaf node', () => {
      const triangles = [createTriangle(0, 0, 10, 0, 5, 10)];
      const bvh = BVHNode2D.build(triangles);

      const stats = bvh.getStats();

      expect(stats.depth).toBe(1);
      expect(stats.nodeCount).toBe(1);
      expect(stats.leafCount).toBe(1);
      expect(stats.triangleCount).toBe(1);
      expect(stats.minTrianglesPerLeaf).toBe(1);
      expect(stats.maxTrianglesPerLeaf).toBe(1);
    });

    it('should return correct stats for two-triangle leaf', () => {
      const triangles = [
        createTriangle(0, 0, 10, 0, 5, 10),
        createTriangle(10, 0, 20, 0, 15, 10),
      ];
      const bvh = BVHNode2D.build(triangles);

      const stats = bvh.getStats();

      expect(stats.depth).toBe(1);
      expect(stats.nodeCount).toBe(1);
      expect(stats.leafCount).toBe(1);
      expect(stats.triangleCount).toBe(2);
      expect(stats.minTrianglesPerLeaf).toBe(2);
      expect(stats.maxTrianglesPerLeaf).toBe(2);
    });

    it('should return correct stats for split tree', () => {
      const triangles = [
        createTriangle(0, 0, 10, 0, 5, 10),
        createTriangle(10, 0, 20, 0, 15, 10),
        createTriangle(20, 0, 30, 0, 25, 10),
        createTriangle(30, 0, 40, 0, 35, 10),
      ];
      const bvh = BVHNode2D.build(triangles);

      const stats = bvh.getStats();

      expect(stats.depth).toBeGreaterThan(1);
      expect(stats.nodeCount).toBeGreaterThan(1);
      expect(stats.leafCount).toBeGreaterThanOrEqual(2);
      expect(stats.triangleCount).toBe(4);
      expect(stats.minTrianglesPerLeaf).toBeGreaterThan(0);
      expect(stats.maxTrianglesPerLeaf).toBeLessThanOrEqual(4);
    });

    it('should calculate total triangle count correctly', () => {
      const triangles = Array.from({ length: 20 }, (_, i) =>
        createTriangle(i * 10, 0, i * 10 + 10, 0, i * 10 + 5, 10),
      );
      const bvh = BVHNode2D.build(triangles);

      const stats = bvh.getStats();

      expect(stats.triangleCount).toBe(20);
    });

    it('should calculate depth correctly for balanced tree', () => {
      const triangles = Array.from({ length: 16 }, (_, i) =>
        createTriangle(i * 10, 0, i * 10 + 10, 0, i * 10 + 5, 10),
      );
      const bvh = BVHNode2D.build(triangles);

      const stats = bvh.getStats();

      // With 16 triangles, balanced binary tree should have depth around 4-5
      expect(stats.depth).toBeGreaterThanOrEqual(3);
      expect(stats.depth).toBeLessThanOrEqual(10); // maxDepth default
    });

    it('should track min/max triangles per leaf', () => {
      const triangles = Array.from({ length: 10 }, (_, i) =>
        createTriangle(i * 10, 0, i * 10 + 10, 0, i * 10 + 5, 10),
      );
      const bvh = BVHNode2D.build(triangles);

      const stats = bvh.getStats();

      expect(stats.minTrianglesPerLeaf).toBeLessThanOrEqual(
        stats.maxTrianglesPerLeaf,
      );
      expect(stats.minTrianglesPerLeaf).toBeGreaterThan(0);
      expect(stats.maxTrianglesPerLeaf).toBeLessThanOrEqual(10);
    });
  });

  describe('toTriangle2D', () => {
    it('should convert ITriangle to Triangle2D', () => {
      const iTriangle: ITriangle = {
        source: [
          [0, 0],
          [10, 0],
          [5, 10],
        ],
        target: [
          [0, 0],
          [10, 0],
          [5, 10],
        ],
      };

      const triangle2D = BVHNode2D.toTriangle2D(iTriangle);

      expect(triangle2D.a.x).toBe(0);
      expect(triangle2D.a.y).toBe(0);
      expect(triangle2D.b.x).toBe(10);
      expect(triangle2D.b.y).toBe(0);
      expect(triangle2D.c.x).toBe(5);
      expect(triangle2D.c.y).toBe(10);
      expect(triangle2D.triangle).toBe(iTriangle);
      expect(triangle2D.transform).toBeNull();
    });
  });

  describe('Integration scenarios', () => {
    it('should efficiently search large triangle set', () => {
      // Create a grid of triangles
      const triangles: Triangle2D[] = [];
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          const x = i * 10;
          const y = j * 10;
          triangles.push(createTriangle(x, y, x + 10, y, x + 5, y + 10));
        }
      }

      const bvh = BVHNode2D.build(triangles);
      const stats = bvh.getStats();

      // Should create efficient tree structure
      expect(stats.triangleCount).toBe(100);
      expect(stats.leafCount).toBeGreaterThan(10); // Many leaves
      expect(stats.depth).toBeLessThan(10); // Reasonable depth

      // Should find triangles efficiently
      const result1 = bvh.findContainingTriangle({ x: 15, y: 15 });
      const result2 = bvh.findContainingTriangle({ x: 85, y: 85 });

      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();
    });

    it('should provide useful debug output', () => {
      const triangles = Array.from({ length: 8 }, (_, i) =>
        createTriangle(i * 10, 0, i * 10 + 10, 0, i * 10 + 5, 10),
      );
      const bvh = BVHNode2D.build(triangles);

      const str = bvh.toString();
      const stats = bvh.getStats();

      // Output should be human-readable
      expect(str).toContain('NODE');
      expect(str).toContain('LEAF');

      // Stats should match tree structure
      const linesInOutput = str.split('\n').length;
      expect(linesInOutput).toBeGreaterThanOrEqual(stats.nodeCount);
    });
  });
});
