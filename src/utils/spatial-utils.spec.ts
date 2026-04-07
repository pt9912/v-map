import { buildQuery, formatBbox, mercatorFromLonLat } from './spatial-utils';

describe('spatial-utils', () => {
  it('converts lon/lat at the origin to Web Mercator', () => {
    const [x, y] = mercatorFromLonLat([0, 0]);

    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(0);
  });

  it('formats EPSG:3857 bounding boxes in projected meters', () => {
    const bbox = formatBbox(7, 50, 8, 51, '1.1.1', 'EPSG:3857');
    const [minX, minY] = mercatorFromLonLat([7, 50]);
    const [maxX, maxY] = mercatorFromLonLat([8, 51]);

    expect(bbox).toBe(`${minX},${minY},${maxX},${maxY}`);
  });

  it('formats EPSG:4326 axis order correctly for WMS 1.3.0', () => {
    expect(formatBbox(7, 50, 8, 51, '1.3.0', 'EPSG:4326')).toBe('50,7,51,8');
  });

  it('formats EPSG:4326 axis order correctly for WMS 1.1.1', () => {
    expect(formatBbox(7, 50, 8, 51, '1.1.1', 'EPSG:4326')).toBe('7,50,8,51');
  });

  it('builds query strings and filters empty values', () => {
    expect(
      buildQuery({
        SERVICE: 'WMS',
        VERSION: '1.3.0',
        empty: '',
        nil: undefined,
        alsoNil: null as unknown as undefined,
        count: 5,
        transparent: true,
      }),
    ).toBe('?SERVICE=WMS&VERSION=1.3.0&count=5&transparent=true');
  });

  it('encodes parameter names and values', () => {
    expect(
      buildQuery({
        'layer name': 'foo/bar',
        CQL_FILTER: 'name = "A B"',
      }),
    ).toBe('?layer%20name=foo%2Fbar&CQL_FILTER=name%20%3D%20%22A%20B%22');
  });

  it('returns an empty string for an empty query', () => {
    expect(buildQuery({})).toBe('');
  });
});
