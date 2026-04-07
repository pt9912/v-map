import { Triangulation } from './Triangulation';
import { BVHNode2D } from './BVHNode2D';
import { Point2D, Triangle2D } from './AABB2D';

describe('Triangulation and BVHNode2D', () => {
  // Mock-Transformationsfunktion für Tests
  const mockTransformFn = (coord: [number, number]): [number, number] => [
    coord[0] * 2, // Beispiel: Skalierung
    coord[1] * 2,
  ];

  // Test-Daten
  const targetExtent: [number, number, number, number] = [0, 0, 4, 4];
  const errorThreshold = 0.5;

  // Hilfsfunktion zum Erstellen einer Triangulation
  const createTriangulation = () => {
    return new Triangulation(mockTransformFn, targetExtent, errorThreshold);
  };

  describe('BVHNode2D', () => {
    it('should build a BVH from triangles', () => {
      const triangles: Triangle2D[] = [
        {
          a: { x: 0, y: 0 },
          b: { x: 2, y: 0 },
          c: { x: 0, y: 2 },
          triangle: {
            source: [
              [0, 0],
              [2, 0],
              [0, 2],
            ],
            target: [
              [0, 0],
              [0, 0],
              [0, 0],
            ],
          },
          transform: null,
        },
        {
          a: { x: 2, y: 0 },
          b: { x: 4, y: 0 },
          c: { x: 2, y: 2 },
          triangle: {
            source: [
              [4, 0],
              [8, 0],
              [4, 4],
            ],
            target: [
              [0, 0],
              [0, 0],
              [0, 0],
            ],
          },
          transform: null,
        },
      ];
      const bvh = BVHNode2D.build(triangles);
      expect(bvh).toBeInstanceOf(BVHNode2D);
      expect(bvh.bbox.min.x).toBe(0);
      expect(bvh.bbox.max.x).toBe(4);
    });

    it('should find a containing triangle', () => {
      const triangles: Triangle2D[] = [
        {
          a: { x: 0, y: 0 },
          b: { x: 2, y: 0 },
          c: { x: 0, y: 2 },
          triangle: {
            source: [
              [0, 0],
              [2, 0],
              [0, 2],
            ],
            target: [
              [0, 0],
              [0, 0],
              [0, 0],
            ],
          },
          transform: null,
        },
      ];
      const bvh = BVHNode2D.build(triangles);
      const point: Point2D = { x: 1.0, y: 1 };

      expect(
        'LEAF bbox=[0.00, 0.00, 2.00, 2.00] triangles=1 - 0.00,0.00 2.00,0.00 0.00,2.00',
      ).toEqual(bvh.toString());
      const result = bvh.findContainingTriangle(point);
      expect(result).toEqual(triangles[0]);
    });

    it('should return null for points outside all triangles', () => {
      const triangles: Triangle2D[] = [
        {
          a: { x: 0, y: 0 },
          b: { x: 2, y: 0 },
          c: { x: 0, y: 2 },
          triangle: {
            source: [
              [0, 0],
              [2, 0],
              [0, 2],
            ],
            target: [
              [0, 0],
              [0, 0],
              [0, 0],
            ],
          },
          transform: null,
        },
      ];
      const bvh = BVHNode2D.build(triangles);
      const point: Point2D = { x: 3, y: 3 };
      const result = bvh.findContainingTriangle(point);
      expect(result).toBeNull();
    });

    it('should correctly identify point-in-triangle', () => {
      const triangle: Triangle2D = {
        a: { x: 0, y: 0 },
        b: { x: 2, y: 0 },
        c: { x: 0, y: 2 },
        triangle: {
          source: [
            [0, 0],
            [2, 0],
            [0, 2],
          ],
          target: [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        },
        transform: null,
      };
      const pointInside: Point2D = { x: 0.5, y: 0.5 };
      const pointOutside: Point2D = { x: 3, y: 3 };
      expect(BVHNode2D.punktInDreieck2D(pointInside, triangle)).toBe(true);
      expect(BVHNode2D.punktInDreieck2D(pointOutside, triangle)).toBe(false);
    });
  });

  describe('Triangulation', () => {
    it('should generate triangles for the target extent', () => {
      const triangulation = createTriangulation();
      const triangles = triangulation.getTriangles();
      expect(triangles.length).toBeGreaterThan(0);
    });

    it('should build a BVH and find source triangles', () => {
      const triangulation = createTriangulation();
      triangulation.buildBVH();
      // Testpunkt in der Mitte des Zielbereichs
      const point: [number, number] = [2, 2];
      const sourceTriangle =
        triangulation.findSourceTriangleForTargetPoint(point);
      expect(sourceTriangle).toBeDefined();
      expect(sourceTriangle.transform).toBeDefined();
      expect(sourceTriangle!.tri.source.length).toBe(3);
    });

    it('should return null for points outside the target extent', () => {
      const triangulation = createTriangulation();
      triangulation.buildBVH();
      const point: [number, number] = [-1, -1];
      const sourceTriangle =
        triangulation.findSourceTriangleForTargetPoint(point);
      expect(sourceTriangle).toBeNull();
    });
  });

  it('sollte sicherstellen, dass alle Dreiecke innerhalb des targetExtent liegen (detailliert)', () => {
    const targetExtent: [number, number, number, number] = [0, 0, 4, 4];
    const [west, south, east, north] = targetExtent;
    const triangulation = new Triangulation(
      mockTransformFn,
      targetExtent,
      errorThreshold,
    );
    const triangles = triangulation.getTriangles();

    for (let i = 0; i < triangles.length; i++) {
      const triangle = triangles[i];
      for (let j = 0; j < 3; j++) {
        const [x, y] = triangle.target[j];

        // Prüfe x-Koordinate
        if (x < west || x > east) {
          expect.fail(
            `Dreieck ${i}, Ecke ${j}: x=${x} liegt außerhalb von [${west}, ${east}]`,
          );
        }

        // Prüfe y-Koordinate
        if (y < south || y > north) {
          expect.fail(
            `Dreieck ${i}, Ecke ${j}: y=${y} liegt außerhalb von [${south}, ${north}]`,
          );
        }

        // Optional: Klassische expect-Assertions für bessere Testausgabe
        expect(x).toBeGreaterThanOrEqual(west);
        expect(x).toBeLessThanOrEqual(east);
        expect(y).toBeGreaterThanOrEqual(south);
        expect(y).toBeLessThanOrEqual(north);
      }
    }
  });
});
