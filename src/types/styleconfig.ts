export interface StyleConfig {
  // Fill styling (for polygons and circles)
  fillColor?: string;
  fillOpacity?: number;

  // Stroke styling (for lines and polygon outlines)
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeDashArray?: number[]; // For dashed lines [dash, gap, dash, gap, ...]

  // Point/Marker styling
  pointRadius?: number;
  pointColor?: string;
  pointOpacity?: number;

  // Icon support for point features
  iconUrl?: string;
  iconSize?: [number, number]; // [width, height] in pixels
  iconAnchor?: [number, number]; // [x, y] anchor point relative to icon size

  // Text label styling
  textProperty?: string; // Property name from feature to use as label text
  textColor?: string;
  textSize?: number;
  textHaloColor?: string; // Outline color for better text visibility
  textHaloWidth?: number;
  textOffset?: [number, number]; // [x, y] offset from feature position

  // Advanced 3D styling (primarily for Cesium)
  zOffset?: number; // Height offset from ground
  extrudeHeight?: number; // Extrusion height for 3D polygons

  // Conditional styling
  styleFunction?: (feature: any) => Partial<StyleConfig>; // Dynamic styling based on feature properties
}

/**
 * Default style configuration values
 */
export const DEFAULT_STYLE: Readonly<Required<Omit<StyleConfig, 'iconUrl' | 'iconSize' | 'iconAnchor' | 'textProperty' | 'textHaloColor' | 'textHaloWidth' | 'textOffset' | 'zOffset' | 'extrudeHeight' | 'styleFunction' | 'strokeDashArray'>>> = {
  // Fill styling
  fillColor: 'rgba(0, 100, 255, 0.3)',
  fillOpacity: 0.3,

  // Stroke styling
  strokeColor: 'rgba(0, 100, 255, 1)',
  strokeWidth: 2,
  strokeOpacity: 1,

  // Point styling
  pointRadius: 6,
  pointColor: 'rgba(0, 100, 255, 1)',
  pointOpacity: 1,

  // Text styling
  textColor: '#000000',
  textSize: 12,
} as const;
