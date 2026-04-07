import { AABB2D, Point2D, Triangle2D } from './AABB2D';
import { ITriangle } from './Triangle';

export class BVHNode2D {
  constructor(
    public bbox: AABB2D,
    public triangles: Triangle2D[] = [],
    public left: BVHNode2D | null = null,
    public right: BVHNode2D | null = null,
  ) {}

  static build(triangles: Triangle2D[], depth = 0, maxDepth = 10): BVHNode2D {
    if (triangles.length <= 2 || depth >= maxDepth) {
      let bbox = AABB2D.fromTriangle(triangles[0]);
      for (let i = 1; i < triangles.length; i++) {
        bbox = AABB2D.union(bbox, AABB2D.fromTriangle(triangles[i]));
      }
      return new BVHNode2D(bbox, triangles);
    }

    const centroids: Point2D[] = triangles.map(t => ({
      x: (t.a.x + t.b.x + t.c.x) / 3,
      y: (t.a.y + t.b.y + t.c.y) / 3,
    }));

    const { min, max } = centroids.reduce(
      (acc, c) => ({
        min: { x: Math.min(acc.min.x, c.x), y: Math.min(acc.min.y, c.y) },
        max: { x: Math.max(acc.max.x, c.x), y: Math.max(acc.max.y, c.y) },
      }),
      { min: centroids[0], max: centroids[0] },
    );

    const axis = max.x - min.x > max.y - min.y ? 'x' : 'y';
    centroids.sort((a, b) => a[axis] - b[axis]);
    const mid = Math.floor(centroids.length / 2);
    const leftTriangles: Triangle2D[] = [];
    const rightTriangles: Triangle2D[] = [];

    for (let i = 0; i < triangles.length; i++) {
      (i < mid ? leftTriangles : rightTriangles).push(triangles[i]);
    }

    const left = BVHNode2D.build(leftTriangles, depth + 1, maxDepth);
    const right = BVHNode2D.build(rightTriangles, depth + 1, maxDepth);
    const bbox = AABB2D.union(left.bbox, right.bbox);

    return new BVHNode2D(bbox, [], left, right);
  }

  /**
   * Finds the triangle containing the given point.
   * @param point The point to test.
   * @returns The containing triangle or `null`.
   */
  findContainingTriangle(point: Point2D): Triangle2D | null {
    if (!this.bbox.contains(point)) {
      return null;
    }
    if (this.triangles.length > 0) {
      for (const triangle of this.triangles) {
        if (BVHNode2D.punktInDreieck2D(point, triangle)) {
          return triangle;
        }
      }
      return null;
    }
    return (
      this.left?.findContainingTriangle(point) ||
      this.right?.findContainingTriangle(point) ||
      null
    );
  }

  static punktInDreieck2D(p: Point2D, triangle: Triangle2D): boolean {
    const { a, b, c } = triangle;
    const v0 = { x: c.x - a.x, y: c.y - a.y };
    const v1 = { x: b.x - a.x, y: b.y - a.y };
    const v2 = { x: p.x - a.x, y: p.y - a.y };

    const dot00 = v0.x * v0.x + v0.y * v0.y;
    const dot01 = v0.x * v1.x + v0.y * v1.y;
    const dot02 = v0.x * v2.x + v0.y * v2.y;
    const dot11 = v1.x * v1.x + v1.y * v1.y;
    const dot12 = v1.x * v2.x + v1.y * v2.y;

    const invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    const u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    const v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    return u >= 0 && v >= 0 && u + v <= 1;
    //return u >= 0 && v >= 0 && u + v < 1;
  }

  static toTriangle2D(triangle: ITriangle): Triangle2D {
    return {
      a: { x: triangle.target[0][0], y: triangle.target[0][1] },
      b: { x: triangle.target[1][0], y: triangle.target[1][1] },
      c: { x: triangle.target[2][0], y: triangle.target[2][1] },
      triangle: triangle,
      transform: null,
    };
  }

  /**
   * Returns a string representation of the BVH tree structure
   * @param indent - Internal parameter for recursive formatting
   * @returns Formatted string showing tree structure
   */
  toString(indent = ''): string {
    const isLeaf = this.triangles.length > 0;
    const nodeType = isLeaf ? 'LEAF' : 'NODE';
    const bboxStr = `[${this.bbox.min.x.toFixed(2)}, ${this.bbox.min.y.toFixed(
      2,
    )}, ${this.bbox.max.x.toFixed(2)}, ${this.bbox.max.y.toFixed(2)}]`;

    let result = `${indent}${nodeType} bbox=${bboxStr}`;

    if (isLeaf) {
      const triArray = this.triangles.map(
        t2D =>
          t2D.a.x.toFixed(2) +
          ',' +
          t2D.a.y.toFixed(2) +
          ' ' +
          t2D.b.x.toFixed(2) +
          ',' +
          t2D.b.y.toFixed(2) +
          ' ' +
          t2D.c.x.toFixed(2) +
          ',' +
          t2D.c.y.toFixed(2),
      );
      const triArrayStr = triArray.toString();
      result += ` triangles=${this.triangles.length} - ${triArrayStr}`;
    } else {
      result += '\n';
      if (this.left) {
        result += `${indent}├─ left:\n${this.left.toString(indent + '│  ')}`;
      }
      if (this.right) {
        result += `${indent}└─ right:\n${this.right.toString(indent + '   ')}`;
      }
    }

    return result;
  }

  /**
   * Get statistics about the BVH tree
   * @returns Object with tree statistics
   */
  getStats(): {
    depth: number;
    nodeCount: number;
    leafCount: number;
    triangleCount: number;
    minTrianglesPerLeaf: number;
    maxTrianglesPerLeaf: number;
  } {
    const stats = {
      depth: 1,
      nodeCount: 1,
      leafCount: 0,
      triangleCount: this.triangles.length,
      minTrianglesPerLeaf: Infinity,
      maxTrianglesPerLeaf: 0,
    };

    if (this.triangles.length > 0) {
      // This is a leaf
      stats.leafCount = 1;
      stats.minTrianglesPerLeaf = this.triangles.length;
      stats.maxTrianglesPerLeaf = this.triangles.length;
    } else {
      // This is an internal node
      if (this.left) {
        const leftStats = this.left.getStats();
        stats.depth = Math.max(stats.depth, leftStats.depth + 1);
        stats.nodeCount += leftStats.nodeCount;
        stats.leafCount += leftStats.leafCount;
        stats.triangleCount += leftStats.triangleCount;
        stats.minTrianglesPerLeaf = Math.min(
          stats.minTrianglesPerLeaf,
          leftStats.minTrianglesPerLeaf,
        );
        stats.maxTrianglesPerLeaf = Math.max(
          stats.maxTrianglesPerLeaf,
          leftStats.maxTrianglesPerLeaf,
        );
      }
      if (this.right) {
        const rightStats = this.right.getStats();
        stats.depth = Math.max(stats.depth, rightStats.depth + 1);
        stats.nodeCount += rightStats.nodeCount;
        stats.leafCount += rightStats.leafCount;
        stats.triangleCount += rightStats.triangleCount;
        stats.minTrianglesPerLeaf = Math.min(
          stats.minTrianglesPerLeaf,
          rightStats.minTrianglesPerLeaf,
        );
        stats.maxTrianglesPerLeaf = Math.max(
          stats.maxTrianglesPerLeaf,
          rightStats.maxTrianglesPerLeaf,
        );
      }
    }

    return stats;
  }
}
