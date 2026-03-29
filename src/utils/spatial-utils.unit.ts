import { describe, expect, it } from 'vitest';
import { buildQuery, formatBbox, mercatorFromLonLat } from './spatial-utils';

describe('spatial-utils unit', () => {
  it('maps the geographic origin to the mercator origin', () => {
    const [x, y] = mercatorFromLonLat([0, 0]);

    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
  });

  it('formats EPSG:4326 bbox with latitude-first order for WMS 1.3.0', () => {
    expect(formatBbox(7, 50, 8, 51, '1.3.0', 'EPSG:4326')).toBe('50,7,51,8');
  });

  it('formats EPSG:4326 bbox with longitude-first order for WMS 1.1.1', () => {
    expect(formatBbox(7, 50, 8, 51, '1.1.1', 'EPSG:4326')).toBe('7,50,8,51');
  });

  it('filters empty values and URL-encodes query parameters', () => {
    expect(
      buildQuery({
        SERVICE: 'WMS',
        empty: '',
        nil: undefined,
        path: 'foo/bar',
        filter: 'name = "A B"',
      }),
    ).toBe('?SERVICE=WMS&path=foo%2Fbar&filter=name%20%3D%20%22A%20B%22');
  });
});
