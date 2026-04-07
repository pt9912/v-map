import type { Triangle, ITriangle } from './Triangle';

describe('Triangle types', () => {
  describe('Triangle type', () => {
    it('should represent a triangle as three coordinate pairs', () => {
      const triangle: Triangle = [
        [0, 0],
        [10, 0],
        [5, 10],
      ];

      expect(triangle).toHaveLength(3);
      expect(triangle[0]).toEqual([0, 0]);
      expect(triangle[1]).toEqual([10, 0]);
      expect(triangle[2]).toEqual([5, 10]);
    });

    it('should accept negative coordinates', () => {
      const triangle: Triangle = [
        [-5, -5],
        [5, -5],
        [0, 5],
      ];

      expect(triangle[0][0]).toBe(-5);
      expect(triangle[0][1]).toBe(-5);
    });

    it('should accept floating point coordinates', () => {
      const triangle: Triangle = [
        [1.5, 2.3],
        [8.7, 1.2],
        [5.5, 9.8],
      ];

      expect(triangle[0][0]).toBeCloseTo(1.5);
      expect(triangle[2][1]).toBeCloseTo(9.8);
    });
  });

  describe('ITriangle interface', () => {
    it('should contain source and target triangles', () => {
      const iTriangle: ITriangle = {
        source: [
          [0, 0],
          [10, 0],
          [5, 10],
        ],
        target: [
          [100, 100],
          [200, 100],
          [150, 200],
        ],
      };

      expect(iTriangle.source).toHaveLength(3);
      expect(iTriangle.target).toHaveLength(3);
    });

    it('should allow source and target to have different coordinates', () => {
      const iTriangle: ITriangle = {
        source: [
          [0, 0],
          [1, 0],
          [0, 1],
        ],
        target: [
          [100, 200],
          [300, 200],
          [100, 400],
        ],
      };

      expect(iTriangle.source[0]).not.toEqual(iTriangle.target[0]);
      expect(iTriangle.source[1]).not.toEqual(iTriangle.target[1]);
      expect(iTriangle.source[2]).not.toEqual(iTriangle.target[2]);
    });

    it('should allow source and target to be identical (identity mapping)', () => {
      const coords: Triangle = [
        [5, 5],
        [15, 5],
        [10, 15],
      ];

      const iTriangle: ITriangle = {
        source: coords,
        target: coords,
      };

      expect(iTriangle.source).toEqual(iTriangle.target);
    });
  });
});
