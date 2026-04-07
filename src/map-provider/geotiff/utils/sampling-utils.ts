import {
  type TypedArrayType,
  normalizeValue,
  normalizeToColorMapRange,
} from './normalization-utils';
import { type ColorStop, applyColorMap } from './colormap-utils';

// TypedArray union type for raster data
export type TypedArray =
  | Uint8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array;

/**
 * Nearest-Neighbor Sampling with window-based reading and multi-band support
 * Returns [R, G, B, A] values (0-255)
 */
export function sampleNearest(
  x: number,
  y: number,
  rasterBands: TypedArray[],
  arrayType: TypedArrayType,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
  colorStops?: ColorStop[],
): [number, number, number, number] | null {
  const px = Math.round(x) - offsetX;
  const py = Math.round(y) - offsetY;

  if (px < 0 || px >= width || py < 0 || py >= height) {
    return null;
  }

  const idx = py * width + px;
  const bandCount = rasterBands.length;

  if (bandCount === 1) {
    // Grayscale - apply colormap if specified
    const rawValue = rasterBands[0][idx];

    if (colorStops) {
      // Apply colormap (only for Float types or when colorStops provided)
      const normalizedValue = normalizeToColorMapRange(rawValue);
      const [r, g, b] = applyColorMap(normalizedValue, colorStops);
      return [r, g, b, 255];
    } else {
      // Regular grayscale normalization
      const gray = normalizeValue(rawValue, arrayType);
      return [gray, gray, gray, 255];
    }
  } else if (bandCount === 3) {
    // RGB
    const r = normalizeValue(rasterBands[0][idx], arrayType);
    const g = normalizeValue(rasterBands[1][idx], arrayType);
    const b = normalizeValue(rasterBands[2][idx], arrayType);
    return [r, g, b, 255];
  } else if (bandCount >= 4) {
    // RGBA
    const r = normalizeValue(rasterBands[0][idx], arrayType);
    const g = normalizeValue(rasterBands[1][idx], arrayType);
    const b = normalizeValue(rasterBands[2][idx], arrayType);
    const a = normalizeValue(rasterBands[3][idx], arrayType);
    return [r, g, b, a];
  }

  return null;
}

/**
 * Bilinear Interpolation with window-based reading and multi-band support
 * Returns [R, G, B, A] values (0-255)
 */
export function sampleBilinear(
  x: number,
  y: number,
  rasterBands: TypedArray[],
  arrayType: TypedArrayType,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
  colorStops?: ColorStop[],
): [number, number, number, number] | null {
  const localX = x - offsetX;
  const localY = y - offsetY;

  // Bounds-Check
  if (
    localX < 0 ||
    localX >= width - 1 ||
    localY < 0 ||
    localY >= height - 1
  ) {
    return null;
  }

  // Bilineare Interpolation
  const x0 = Math.floor(localX);
  const x1 = Math.ceil(localX);
  const y0 = Math.floor(localY);
  const y1 = Math.ceil(localY);

  const fx = localX - x0;
  const fy = localY - y0;

  const bandCount = rasterBands.length;
  const result: [number, number, number, number] = [0, 0, 0, 255];

  if (bandCount === 1) {
    // Grayscale - interpolate first, then apply colormap
    const band = rasterBands[0];

    const v00 = band[y0 * width + x0];
    const v10 = band[y0 * width + x1];
    const v01 = band[y1 * width + x0];
    const v11 = band[y1 * width + x1];

    const v0 = v00 * (1 - fx) + v10 * fx;
    const v1 = v01 * (1 - fx) + v11 * fx;
    const interpolated = v0 * (1 - fy) + v1 * fy;

    if (colorStops) {
      // Apply colormap (only for Float types or when colorStops provided)
      const normalizedValue = normalizeToColorMapRange(interpolated);
      const [r, g, b] = applyColorMap(normalizedValue, colorStops);
      return [r, g, b, 255];
    } else {
      // Regular grayscale normalization
      const gray = normalizeValue(interpolated, arrayType);
      return [gray, gray, gray, 255];
    }
  } else {
    // RGB/RGBA - interpolate each band
    const bandsToProcess = Math.min(bandCount, 4);
    for (let b = 0; b < bandsToProcess; b++) {
      const band = rasterBands[b];

      const v00 = band[y0 * width + x0];
      const v10 = band[y0 * width + x1];
      const v01 = band[y1 * width + x0];
      const v11 = band[y1 * width + x1];

      const v0 = v00 * (1 - fx) + v10 * fx;
      const v1 = v01 * (1 - fx) + v11 * fx;
      const interpolated = v0 * (1 - fy) + v1 * fy;

      result[b] = normalizeValue(interpolated, arrayType);
    }
  }

  return result;
}
