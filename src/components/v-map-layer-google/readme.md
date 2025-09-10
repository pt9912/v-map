# v-map-layer-google



<!-- Auto Generated Below -->


## Overview

Google Maps Basemap Layer

## Properties

| Property   | Attribute  | Description                                                                           | Type                                                | Default     |
| ---------- | ---------- | ------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------- |
| `apiKey`   | `api-key`  | Google Maps API-Schlüssel.                                                            | `string`                                            | `undefined` |
| `language` | `language` | Sprach-Lokalisierung (BCP-47, z. B. "de", "en-US").                                   | `string`                                            | `undefined` |
| `mapType`  | `map-type` | Karten-Typ: "roadmap" \| "satellite" \| "hybrid" \| "terrain".                        | `"hybrid" \| "roadmap" \| "satellite" \| "terrain"` | `'roadmap'` |
| `opacity`  | `opacity`  | Opazität des Layers (0–1).                                                            | `number`                                            | `1.0`       |
| `region`   | `region`   | Region-Bias (ccTLD/Region-Code, z. B. "DE", "US"). Beeinflusst Labels/Suchergebnisse. | `string`                                            | `undefined` |
| `visible`  | `visible`  | Sichtbarkeit des Layers.                                                              | `boolean`                                           | `true`      |


## Events

| Event   | Description                                                                 | Type                |
| ------- | --------------------------------------------------------------------------- | ------------------- |
| `ready` | Signalisiert, dass der Google-Layer bereit ist. `detail` enthält Metadaten. | `CustomEvent<void>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
