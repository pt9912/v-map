/**
 * Normalization utilities for raster data
 * Handles conversion of different TypedArray types to normalized 0-255 range
 */

import { warn } from '../../../utils/logger';

export type TypedArrayType =
  | 'Uint8Array'
  | 'Uint16Array'
  | 'Int16Array'
  | 'Uint32Array'
  | 'Int32Array'
  | 'Float32Array'
  | 'Float64Array';

/**
 * Normalize a raw value to 0-255 range based on array type
 * @param rawValue - The raw value from the raster
 * @param arrayType - The TypedArray type name
 * @returns Normalized value 0-255
 */
export function normalizeValue(
  rawValue: number,
  arrayType: TypedArrayType,
): number {
  switch (arrayType) {
    case 'Uint8Array':
      return rawValue; // Already 0-255

    case 'Uint16Array':
      // 0-65535 → 0-255
      return Math.round((rawValue / 65535) * 255);

    case 'Int16Array':
      // -32768-32767 → 0-255
      return Math.round(((rawValue + 32768) / 65535) * 255);

    case 'Uint32Array':
      // 0-4294967295 → 0-255
      return Math.round((rawValue / 4294967295) * 255);

    case 'Int32Array':
      // -2147483648-2147483647 → 0-255
      return Math.round(((rawValue + 2147483648) / 4294967295) * 255);

    case 'Float32Array':
    case 'Float64Array':
      // Assume 0.0-1.0 range for Float arrays (common for normalized data)
      // Clamp to [0, 1] first
      const clamped = Math.max(0, Math.min(1, rawValue));
      return Math.round(clamped * 255);

    default:
      warn(`Unknown array type: ${arrayType}, treating as Uint8`);
      return rawValue;
  }
}

/**
 * Normalize a raw value to 0-1 range for colormap application
 * @param rawValue - The raw value from the raster
 * @param valueRange - Optional [min, max] range. If not provided, assumes normalized data.
 * @returns Normalized value 0-1
 */
export function normalizeToColorMapRange(
  rawValue: number,
  valueRange?: [number, number],
): number {
  if (!valueRange) {
    // Assume already normalized or single-value range
    return Math.max(0, Math.min(1, rawValue));
  }

  const [minVal, maxVal] = valueRange;

  // Avoid division by zero
  if (maxVal === minVal) {
    return 0.5; // Middle of range
  }

  const normalized = (rawValue - minVal) / (maxVal - minVal);
  return Math.max(0, Math.min(1, normalized)); // Clamp to [0, 1]
}

/**
 * Auto-detect value range from a Float32/Float64 array sample
 * Useful when valueRange is not provided
 * @param data - The raster data array
 * @param sampleSize - Number of samples to analyze (default: 1000)
 * @returns Detected [min, max] range
 */
export function autoDetectValueRange(
  data: Float32Array | Float64Array,
  sampleSize: number = 1000,
): [number, number] {
  if (data.length === 0) {
    return [0, 1];
  }

  const step = Math.max(1, Math.floor(data.length / sampleSize));
  let min = Infinity;
  let max = -Infinity;

  for (let i = 0; i < data.length; i += step) {
    const value = data[i];
    if (Number.isFinite(value)) {
      if (value < min) min = value;
      if (value > max) max = value;
    }
  }

  // Fallback if all values were invalid
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return [0, 1];
  }

  // Handle single-value case
  if (min === max) {
    return [min, min + 1];
  }

  return [min, max];
}

/**
 * Check if a TypedArray type represents floating point data
 * @param arrayType - The TypedArray type name
 * @returns True if Float32Array or Float64Array
 */
export function isFloatType(arrayType: TypedArrayType): boolean {
  return arrayType === 'Float32Array' || arrayType === 'Float64Array';
}

/**
 * Get the typical value range for a TypedArray type
 * @param arrayType - The TypedArray type name
 * @returns [min, max] range for the type
 */
export function getTypeRange(arrayType: TypedArrayType): [number, number] {
  switch (arrayType) {
    case 'Uint8Array':
      return [0, 255];
    case 'Uint16Array':
      return [0, 65535];
    case 'Int16Array':
      return [-32768, 32767];
    case 'Uint32Array':
      return [0, 4294967295];
    case 'Int32Array':
      return [-2147483648, 2147483647];
    case 'Float32Array':
    case 'Float64Array':
      return [0, 1]; // Assume normalized
    default:
      return [0, 255];
  }
}
