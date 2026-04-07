export function mercatorFromLonLat([lon, lat]: [number, number]): [
  number,
  number,
] {
  const R = 6378137;
  const x = ((lon * Math.PI) / 180) * R;
  const y = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * R;
  return [x, y];
}

export function formatBbox(
  west: number,
  south: number,
  east: number,
  north: number,
  version: '1.1.1' | '1.3.0',
  crs: string,
): string {
  if (crs === 'EPSG:3857') {
    // deck.gl liefert bbox in lon/lat → in Meter projizieren
    const [minx, miny] = mercatorFromLonLat([west, south]);
    const [maxx, maxy] = mercatorFromLonLat([east, north]);
    return `${minx},${miny},${maxx},${maxy}`;
  }
  // EPSG:4326: Achtung Axis-Order bei 1.3.0 = (lat,lon)
  if (version === '1.3.0') {
    return `${south},${west},${north},${east}`; // lat,lon,lat,lon
  }
  // 1.1.1 → lon,lat-Reihenfolge
  return `${west},${south},${east},${north}`;
}

export function buildQuery(
  params: Record<string, string | number | boolean | undefined>,
) {
  const q = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
    )
    .join('&');
  return q ? `?${q}` : '';
}
