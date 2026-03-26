import { ITriangle } from './Triangle';

export type AffineTransform = {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
};

export type Point2D = { x: number; y: number };

export type Triangle2D = {
  a: Point2D;
  b: Point2D;
  c: Point2D;
  triangle: ITriangle;
  transform: AffineTransform | null;
};

export class AABB2D {
  constructor(public min: Point2D, public max: Point2D) {}

  contains(point: Point2D): boolean {
    return (
      point.x >= this.min.x &&
      point.x <= this.max.x &&
      point.y >= this.min.y &&
      point.y <= this.max.y
    );
  }

  static fromTriangle(triangle: Triangle2D): AABB2D {
    const minX = Math.min(triangle.a.x, triangle.b.x, triangle.c.x);
    const minY = Math.min(triangle.a.y, triangle.b.y, triangle.c.y);
    const maxX = Math.max(triangle.a.x, triangle.b.x, triangle.c.x);
    const maxY = Math.max(triangle.a.y, triangle.b.y, triangle.c.y);
    return new AABB2D({ x: minX, y: minY }, { x: maxX, y: maxY });
  }

  static union(a: AABB2D, b: AABB2D): AABB2D {
    return new AABB2D(
      { x: Math.min(a.min.x, b.min.x), y: Math.min(a.min.y, b.min.y) },
      { x: Math.max(a.max.x, b.max.x), y: Math.max(a.max.y, b.max.y) },
    );
  }
}
