# v-map-layer-group



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `basemap` | `boolean` | `basemap` | `false` | Kennzeichnet diese Gruppe als Basis-Kartenebene (exklusiv sichtbar). |
| `groupId` | `string` | `group-id` | `Math.random().toString(36).slice(2, 11)` | Eindeutige Gruppen-ID (z. B. für programmatisches Umschalten). |
| `opacity` | `number` | `opacity` | `1.0` | Globale Opazität (0–1) für alle Kinder. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit der gesamten Gruppe. |

### Methods

- `addLayer(layerConfig: { type: "geojson"; url: string; style?: StyleConfig; groupId?: string; } | { type: "osm"; groupId?: string; url?: string; } | { type: "xyz"; url: string; attributions?: string | string[]; maxZoom?: number; options?: Record<string, unknown>; groupId?: string; } | { type: "arcgis"; url: string; groupId?: string; } | { type: "google"; apiKey: string; mapType?: "roadmap" | "satellite" | "terrain" | "hybrid"; scale?: "scaleFactor1x" | "scaleFactor2x"; highDpi?: boolean; groupId?: string; maxZoom?: number; styles?: string; language?: string; libraries?: string[]; region?: string; } | { type: "wms"; url: string; layers: string; params?: Record<string, string>; groupId?: string; } | { type: "scatterplot"; id?: string; data?: any; getFillColor?: Color; getRadius?: number; opacity?: number; visible?: boolean; getTooltip?: (info: any) => any; onClick?: (info: any) => void; onHover?: (info: any) => void; groupId?: string; } | { type: "terrain"; elevationData: string; texture?: string; elevationDecoder?: { r: number; g: number; b: number; offset: number; }; wireframe?: boolean; color?: [number, number, number]; minZoom?: number; maxZoom?: number; meshMaxError?: number; groupId?: string; }) => [object Object]` — Fügt ein Kind-Layer zur Gruppe hinzu.

