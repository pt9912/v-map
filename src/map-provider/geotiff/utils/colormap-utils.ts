/**
 * ColorMap utilities for GeoTIFF visualization
 * Extracted for testability
 */

import type { ColorMap as GeoStylerColorMap } from 'geostyler-style';
import { warn } from '../../../utils/logger';

export interface ColorStop {
  value: number; // 0.0 - 1.0 (normalized)
  color: [number, number, number]; // RGB 0-255
}

export type ColorMapName =
  | 'grayscale'
  | 'viridis'
  | 'terrain'
  | 'turbo'
  | 'rainbow';

/**
 * Predefined color maps
 */
export const PREDEFINED_COLORMAPS: Record<ColorMapName, ColorStop[]> = {
  grayscale: [
    { value: 0.0, color: [0, 0, 0] },
    { value: 1.0, color: [255, 255, 255] },
  ],
  viridis: [
    { value: 0.0, color: [68, 1, 84] },
    { value: 0.25, color: [59, 82, 139] },
    { value: 0.5, color: [33, 145, 140] },
    { value: 0.75, color: [94, 201, 98] },
    { value: 1.0, color: [253, 231, 37] },
  ],
  terrain: [
    { value: 0.0, color: [0, 128, 0] }, // dark green (low)
    { value: 0.25, color: [139, 195, 74] }, // light green
    { value: 0.5, color: [255, 235, 59] }, // yellow
    { value: 0.75, color: [255, 152, 0] }, // orange
    { value: 1.0, color: [255, 255, 255] }, // white (high)
  ],
  turbo: [
    { value: 0.0, color: [48, 18, 59] },
    { value: 0.2, color: [33, 102, 172] },
    { value: 0.4, color: [68, 190, 112] },
    { value: 0.6, color: [253, 231, 37] },
    { value: 0.8, color: [234, 51, 35] },
    { value: 1.0, color: [122, 4, 3] },
  ],
  rainbow: [
    { value: 0.0, color: [148, 0, 211] }, // violet
    { value: 0.2, color: [0, 0, 255] }, // blue
    { value: 0.4, color: [0, 255, 0] }, // green
    { value: 0.6, color: [255, 255, 0] }, // yellow
    { value: 0.8, color: [255, 127, 0] }, // orange
    { value: 1.0, color: [255, 0, 0] }, // red
  ],
};

/**
 * Parse a hex color string to RGB array
 * @param hexColor - Hex color string (e.g., "#FF0000" or "#F00")
 * @returns RGB array [r, g, b] with values 0-255
 */
export function parseHexColor(hexColor: string): [number, number, number] {
  let hex = hexColor.trim();
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
  }

  // Handle shorthand hex (#RGB -> #RRGGBB)
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }

  if (hex.length !== 6) {
    warn(`Invalid hex color: ${hexColor}, using black`);
    return [0, 0, 0];
  }

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    warn(`Invalid hex color: ${hexColor}, using black`);
    return [0, 0, 0];
  }

  return [r, g, b];
}

/**
 * Convert GeoStyler ColorMap to internal ColorStop array
 * @param geoStylerColorMap - GeoStyler ColorMap object
 * @param valueRange - Optional value range [min, max] for normalization
 * @returns Object with ColorStop array and computed range
 */
export function convertGeoStylerColorMap(
  geoStylerColorMap: GeoStylerColorMap,
  valueRange?: [number, number],
): { stops: ColorStop[]; computedRange?: [number, number] } {
  const entries = geoStylerColorMap.colorMapEntries || [];

  if (entries.length === 0) {
    warn('GeoStyler ColorMap has no entries, using grayscale');
    return { stops: PREDEFINED_COLORMAPS.grayscale };
  }

  // Extract quantity values for normalization
  const quantities = entries
    .map(e => e.quantity)
    .filter((q): q is number => typeof q === 'number');

  let minVal: number;
  let maxVal: number;

  if (valueRange) {
    [minVal, maxVal] = valueRange;
  } else if (quantities.length > 0) {
    minVal = Math.min(...quantities);
    maxVal = Math.max(...quantities);
  } else {
    // No quantities and no valueRange - assume normalized 0-1
    minVal = 0;
    maxVal = 1;
  }

  // Avoid division by zero
  if (maxVal === minVal) {
    maxVal = minVal + 1;
  }

  const stops: ColorStop[] = entries.map(entry => {
    const quantity = typeof entry.quantity === 'number' ? entry.quantity : 0;
    const normalizedValue = (quantity - minVal) / (maxVal - minVal);

    // Parse color (handle both string and Expression<string>)
    const colorStr =
      typeof entry.color === 'string' ? entry.color : String(entry.color);
    const color = parseHexColor(colorStr);

    return {
      value: Math.max(0, Math.min(1, normalizedValue)), // Clamp to [0, 1]
      color,
    };
  });

  // Sort by value for binary search
  stops.sort((a, b) => a.value - b.value);

  return {
    stops,
    computedRange: valueRange ? undefined : [minVal, maxVal],
  };
}

/**
 * Apply colormap to a normalized value using interpolation
 * @param normalizedValue - Value between 0 and 1
 * @param colorStops - Array of color stops (must be sorted by value)
 * @returns RGB color [r, g, b]
 */
export function applyColorMap(
  normalizedValue: number,
  colorStops: ColorStop[],
): [number, number, number] {
  const v = Math.max(0, Math.min(1, normalizedValue));

  if (colorStops.length === 0) {
    return [0, 0, 0]; // Black fallback
  }

  if (colorStops.length === 1) {
    return colorStops[0].color;
  }

  // Binary search for surrounding color stops
  let left = 0;
  let right = colorStops.length - 1;

  // Handle edge cases
  if (v <= colorStops[left].value) {
    return colorStops[left].color;
  }
  if (v >= colorStops[right].value) {
    return colorStops[right].color;
  }

  // Binary search
  while (right - left > 1) {
    const mid = Math.floor((left + right) / 2);
    if (colorStops[mid].value <= v) {
      left = mid;
    } else {
      right = mid;
    }
  }

  // Interpolate between left and right
  const lower = colorStops[left];
  const upper = colorStops[right];
  const ratio = (v - lower.value) / (upper.value - lower.value);

  const r = Math.round(
    lower.color[0] + ratio * (upper.color[0] - lower.color[0]),
  );
  const g = Math.round(
    lower.color[1] + ratio * (upper.color[1] - lower.color[1]),
  );
  const b = Math.round(
    lower.color[2] + ratio * (upper.color[2] - lower.color[2]),
  );

  return [r, g, b];
}

/**
 * Get ColorStop array from ColorMapName or GeoStyler ColorMap
 * @param colorMap - Predefined name or GeoStyler ColorMap
 * @param valueRange - Optional value range for GeoStyler ColorMap
 * @returns ColorStop array and computed range (if applicable)
 */
export function getColorStops(
  colorMap: ColorMapName | GeoStylerColorMap,
  valueRange?: [number, number],
): { stops: ColorStop[]; computedRange?: [number, number] } {
  if (typeof colorMap === 'string') {
    // Predefined colormap name
    const stops = PREDEFINED_COLORMAPS[colorMap];
    if (!stops) {
      warn(`Unknown colormap: ${colorMap}, using grayscale`);
      return { stops: PREDEFINED_COLORMAPS.grayscale };
    }
    return { stops };
  } else {
    // GeoStyler ColorMap
    return convertGeoStylerColorMap(colorMap, valueRange);
  }
}
