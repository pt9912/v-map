/**
 * Triangulation for raster reprojection
 *
 * Based on OpenLayers' triangulation approach for efficient raster reprojection.
 * Instead of transforming every pixel, we:
 * 1. Divide the target extent into triangles
 * 2. Transform only triangle vertices with proj4
 * 3. Use affine transformation to map pixels within each triangle
 *
 * This reduces proj4 calls from ~65,536 per tile to ~50-200 per tile.
 */

import { ITriangle } from './Triangle';
import { BVHNode2D } from './BVHNode2D';
import { Point2D } from './AABB2D';

interface TransformFunction {
  (coord: [number, number]): [number, number];
}

export type TriResult = { tri: ITriangle; transform: any };

export type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

export function calculateBounds(
  sourceRef: [number, number],
  resolution: number,
  targetExtent: [number, number, number, number],
  transformFn: TransformFunction,
  step: number = 10, // Anzahl der Schritte pro Kante (je höher, desto genauer)
): {
  source: Bounds;
  target: Bounds;
} {
  const [west, south, east, north] = targetExtent;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let minXTarget: [number, number] = [0, 0];
  let minYTarget: [number, number] = [0, 0];
  let maxXTarget: [number, number] = [0, 0];
  let maxYTarget: [number, number] = [0, 0];

  // Funktion zum Abtasten einer Kante
  const sampleEdge = (
    start: [number, number],
    end: [number, number],
    steps: number,
  ) => {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = start[0] + (end[0] - start[0]) * t;
      const y = start[1] + (end[1] - start[1]) * t;
      const target: [number, number] = [x, y];
      const [xSrc, ySrc] = transformFn(target);
      if (xSrc < minX) {
        minX = xSrc;
        minXTarget = target;
      }
      if (ySrc < minY) {
        minY = ySrc;
        minYTarget = target;
      }
      if (xSrc > maxX) {
        maxX = xSrc;
        maxXTarget = target;
      }
      if (ySrc > maxY) {
        maxY = ySrc;
        maxYTarget = target;
      }
    }
  };

  // Abtasten aller vier Kanten
  sampleEdge([west, north], [east, north], step); // Top edge
  sampleEdge([east, north], [east, south], step); // Right edge
  sampleEdge([east, south], [west, south], step); // Bottom edge
  sampleEdge([west, south], [west, north], step); // Left edge

  if (sourceRef != null && resolution != null) {
    const minXPix = Math.floor((minX - sourceRef[0]) / resolution);
    minX = sourceRef[0] + minXPix * resolution;
    const minYPix = Math.floor((minY - sourceRef[1]) / resolution);
    minY = sourceRef[1] + minYPix * resolution;
    const maxXPix = Math.ceil((maxX - sourceRef[0]) / resolution);
    maxX = sourceRef[0] + maxXPix * resolution;
    const maxYPix = Math.ceil((maxY - sourceRef[1]) / resolution);
    maxY = sourceRef[1] + maxYPix * resolution;
  }

  return {
    source: {
      minX,
      minY,
      maxX,
      maxY,
    },
    target: {
      minX: minXTarget[0],
      minY: minYTarget[1],
      maxX: maxXTarget[0],
      maxY: maxYTarget[1],
    },
  };
}

const MAX_SUBDIVISION = 10;

/**
 * Class for triangulation of the given target extent
 * Used for determining source data and the reprojection itself
 */
export class Triangulation {
  private triangles_: ITriangle[] = [];
  private transformFn_: TransformFunction;
  private errorThresholdSquared_: number;
  private bvh_: BVHNode2D | null = null;
  private bounds: Bounds;

  /**
   * @param transformFn - Function that transforms [x, y] from target to source projection
   * @param targetExtent - [west, south, east, north] in target projection
   * @param errorThreshold - Maximum allowed error in pixels (default: 0.5)
   */
  constructor(
    transformFn: TransformFunction,
    targetExtent: [number, number, number, number],
    errorThreshold: number = 0.5,
    sourceRef: [number, number] = null,
    resolution: number = null,
    step: number = 10, // Anzahl der Schritte pro Kante (je höher, desto genauer)
  ) {
    this.transformFn_ = transformFn;
    this.errorThresholdSquared_ = errorThreshold * errorThreshold;

    const [west, south, east, north] = targetExtent;
    // Transform the four corners
    const a: [number, number] = [west, north]; // top-left
    const b: [number, number] = [east, north]; // top-right
    const c: [number, number] = [east, south]; // bottom-right
    const d: [number, number] = [west, south]; // bottom-left
    const extBounds = calculateBounds(
      sourceRef,
      resolution,
      targetExtent,
      this.transformFn_,
      step,
    );

    // const aSrc = this.transformFn_(a);
    // const bSrc = this.transformFn_(b);
    // const cSrc = this.transformFn_(c);
    // const dSrc = this.transformFn_(d);
    const aSrc: [number, number] = [
      extBounds.source.minX,
      extBounds.source.maxY,
    ]; // top-left
    const bSrc: [number, number] = [
      extBounds.source.maxX,
      extBounds.source.maxY,
    ]; // top-right
    const cSrc: [number, number] = [
      extBounds.source.maxX,
      extBounds.source.minY,
    ]; // bottom-right
    const dSrc: [number, number] = [
      extBounds.source.minX,
      extBounds.source.minY,
    ]; // bottom-left

    this.bounds = extBounds.source;

    this.addQuad_(a, b, c, d, aSrc, bSrc, cSrc, dSrc, MAX_SUBDIVISION);
  }

  getBounds(): Bounds {
    return this.bounds;
  }

  /**
   * Recursively subdivide a quadrilateral if needed
   */
  private addQuad_(
    a: [number, number],
    b: [number, number],
    c: [number, number],
    d: [number, number],
    aSrc: [number, number],
    bSrc: [number, number],
    cSrc: [number, number],
    dSrc: [number, number],
    maxSubdivision: number,
  ): void {
    let needsSubdivision = false;

    // Check if we need to subdivide based on error threshold
    if (maxSubdivision > 0) {
      // Calculate midpoints of all edges (linear interpolation in target space)
      const abTarget: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const bcTarget: [number, number] = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
      const cdTarget: [number, number] = [(c[0] + d[0]) / 2, (c[1] + d[1]) / 2];
      const daTarget: [number, number] = [(d[0] + a[0]) / 2, (d[1] + a[1]) / 2];

      // Transform midpoints to source space
      const abSrc = this.transformFn_(abTarget);
      const bcSrc = this.transformFn_(bcTarget);
      const cdSrc = this.transformFn_(cdTarget);
      const daSrc = this.transformFn_(daTarget);

      // Calculate expected midpoints (linear interpolation in source space)
      const abExpected: [number, number] = [
        (aSrc[0] + bSrc[0]) / 2,
        (aSrc[1] + bSrc[1]) / 2,
      ];
      const bcExpected: [number, number] = [
        (bSrc[0] + cSrc[0]) / 2,
        (bSrc[1] + cSrc[1]) / 2,
      ];
      const cdExpected: [number, number] = [
        (cSrc[0] + dSrc[0]) / 2,
        (cSrc[1] + dSrc[1]) / 2,
      ];
      const daExpected: [number, number] = [
        (dSrc[0] + aSrc[0]) / 2,
        (dSrc[1] + aSrc[1]) / 2,
      ];

      // Calculate squared errors
      const abError = this.getSquaredError_(abSrc, abExpected);
      const bcError = this.getSquaredError_(bcSrc, bcExpected);
      const cdError = this.getSquaredError_(cdSrc, cdExpected);
      const daError = this.getSquaredError_(daSrc, daExpected);

      // Check if any edge exceeds error threshold
      if (
        abError > this.errorThresholdSquared_ ||
        bcError > this.errorThresholdSquared_ ||
        cdError > this.errorThresholdSquared_ ||
        daError > this.errorThresholdSquared_
      ) {
        needsSubdivision = true;
      }
    }

    if (needsSubdivision) {
      // Subdivide into 4 smaller quads
      // Calculate center point
      const eTarget: [number, number] = [
        (a[0] + b[0] + c[0] + d[0]) / 4,
        (a[1] + b[1] + c[1] + d[1]) / 4,
      ];
      const eSrc = this.transformFn_(eTarget);

      // Calculate edge midpoints
      const abTarget: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const bcTarget: [number, number] = [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2];
      const cdTarget: [number, number] = [(c[0] + d[0]) / 2, (c[1] + d[1]) / 2];
      const daTarget: [number, number] = [(d[0] + a[0]) / 2, (d[1] + a[1]) / 2];

      const abSrc = this.transformFn_(abTarget);
      const bcSrc = this.transformFn_(bcTarget);
      const cdSrc = this.transformFn_(cdTarget);
      const daSrc = this.transformFn_(daTarget);

      const newMaxSubdivision = maxSubdivision - 1;

      // Recursively add 4 sub-quads
      this.addQuad_(
        a,
        abTarget,
        eTarget,
        daTarget,
        aSrc,
        abSrc,
        eSrc,
        daSrc,
        newMaxSubdivision,
      );
      this.addQuad_(
        abTarget,
        b,
        bcTarget,
        eTarget,
        abSrc,
        bSrc,
        bcSrc,
        eSrc,
        newMaxSubdivision,
      );
      this.addQuad_(
        eTarget,
        bcTarget,
        c,
        cdTarget,
        eSrc,
        bcSrc,
        cSrc,
        cdSrc,
        newMaxSubdivision,
      );
      this.addQuad_(
        daTarget,
        eTarget,
        cdTarget,
        d,
        daSrc,
        eSrc,
        cdSrc,
        dSrc,
        newMaxSubdivision,
      );
    } else {
      // No subdivision needed - add two triangles for this quad
      // Triangle 1: a-b-d
      this.addTriangle_(a, b, d, aSrc, bSrc, dSrc);
      // Triangle 2: b-c-d
      this.addTriangle_(b, c, d, bSrc, cSrc, dSrc);
    }
  }

  /**
   * Add a single triangle
   */
  private addTriangle_(
    a: [number, number],
    b: [number, number],
    c: [number, number],
    aSrc: [number, number],
    bSrc: [number, number],
    cSrc: [number, number],
  ): void {
    // Check for non-finite coordinates
    if (
      !isFinite(aSrc[0]) ||
      !isFinite(aSrc[1]) ||
      !isFinite(bSrc[0]) ||
      !isFinite(bSrc[1]) ||
      !isFinite(cSrc[0]) ||
      !isFinite(cSrc[1])
    ) {
      return; // Skip invalid triangles
    }

    this.triangles_.push({
      source: [aSrc, bSrc, cSrc],
      target: [a, b, c],
    });
  }

  /**
   * Calculate squared error between two points
   */
  private getSquaredError_(
    actual: [number, number],
    expected: [number, number],
  ): number {
    const dx = actual[0] - expected[0];
    const dy = actual[1] - expected[1];
    return dx * dx + dy * dy;
  }

  /**
   * Get all triangles
   */
  getTriangles(): ITriangle[] {
    return this.triangles_;
  }

  /**
   * Calculate the bounding extent of all source coordinates
   */
  calculateSourceExtent(): [number, number, number, number] | null {
    if (this.triangles_.length === 0) {
      return null;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const triangle of this.triangles_) {
      for (const [x, y] of triangle.source) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    return [minX, minY, maxX, maxY];
  }

  buildBVH(): void {
    const triangles2D = this.triangles_.map(BVHNode2D.toTriangle2D);
    this.bvh_ = BVHNode2D.build(triangles2D);
  }

  findSourceTriangleForTargetPoint(
    point: [number, number],
    extraTri: TriResult = null,
  ): TriResult | null {
    if (!this.bvh_) this.buildBVH();

    const point2D: Point2D = { x: point[0], y: point[1] };
    if (
      extraTri?.tri &&
      BVHNode2D.punktInDreieck2D(point2D, BVHNode2D.toTriangle2D(extraTri.tri))
    ) {
      return extraTri;
    }

    const result = this.bvh_.findContainingTriangle(point2D);
    if (result && !result.transform) {
      result.transform = this.calculateAffineTransform(result.triangle);
    }
    return result
      ? { tri: result.triangle, transform: result.transform }
      : null;
  }

  /**
   * Calculate affine transformation matrix for a triangle
   * Maps from target triangle to source triangle
   */
  calculateAffineTransform(triangle: ITriangle): {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
  } {
    const [[x0t, y0t], [x1t, y1t], [x2t, y2t]] = triangle.target;
    const [[x0s, y0s], [x1s, y1s], [x2s, y2s]] = triangle.source;

    // Solve for affine transformation: [xs, ys] = [a*xt + b*yt + c, d*xt + e*yt + f]
    // Using the three triangle vertices
    const det = (x1t - x0t) * (y2t - y0t) - (x2t - x0t) * (y1t - y0t);

    if (Math.abs(det) < 1e-10) {
      // Degenerate triangle - return identity-like transform
      return { a: 1, b: 0, c: x0s, d: 0, e: 1, f: y0s };
    }

    const a = ((x1s - x0s) * (y2t - y0t) - (x2s - x0s) * (y1t - y0t)) / det;
    const b = ((x2s - x0s) * (x1t - x0t) - (x1s - x0s) * (x2t - x0t)) / det;
    const c = x0s - a * x0t - b * y0t;

    const d = ((y1s - y0s) * (y2t - y0t) - (y2s - y0s) * (y1t - y0t)) / det;
    const e = ((y2s - y0s) * (x1t - x0t) - (y1s - y0s) * (x2t - x0t)) / det;
    const f = y0s - d * x0t - e * y0t;

    return { a, b, c, d, e, f };
  }

  // ============================================================================
  // REPROJECTION METHODS
  // ============================================================================

  /**
   * Apply affine transformation to a point
   */
  applyAffineTransform(
    x: number,
    y: number,
    transform: {
      a: number;
      b: number;
      c: number;
      d: number;
      e: number;
      f: number;
    },
  ): [number, number] {
    return [
      transform.a * x + transform.b * y + transform.c,
      transform.d * x + transform.e * y + transform.f,
    ];
  }
}
