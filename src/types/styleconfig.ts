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
