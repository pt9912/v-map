# Getting Started

[**@pt9912/v-map**](./README.md)

## Installation

```bash
pnpm add @pt9912/v-map
```

## Erste Karte

```tsx
<v-map flavour="ol" style={{ height: '400px' }}>
  <v-map-layer-osm></v-map-layer-osm>
</v-map>
```

## Storybook

Dieses Storybook wird separat bereitgestellt.

## Konfiguration mit `v-map-builder`

Der `v-map-builder` erzeugt Karten und Layer aus JSON- oder YAML-Skripten. Über das Feld `map.styles` lassen sich Styles deklarieren, die automatisch als `<v-map-style>`-Elemente gerendert werden.

```html
<v-map-builder>
  <script type="application/json" slot="mapconfig">
    {
      "map": {
        "flavour": "ol",
        "zoom": 5,
        "styles": [
          {
            "key": "poi-style",
            "format": "sld",
            "src": "/styles/poi.sld",
            "layerTargets": ["poi-layer"],
            "autoApply": true
          },
          {
            "key": "buildings-style",
            "format": "mapbox-gl",
            "content": "{ \"version\": 8, \"layers\": [] }",
            "layerTargets": "buildings"
          }
        ],
        "layerGroups": [
          {
            "groupTitle": "Basemap",
            "layers": [{ "id": "basemap", "type": "osm" }]
          },
          {
            "groupTitle": "POI",
            "layers": [
              { "id": "poi-layer", "type": "geojson", "url": "/data/poi.geojson" }
            ]
          }
        ]
      }
    }
  </script>
</v-map-builder>
```

**Felder von `map.styles`**
- `key` – eindeutiger Bezeichner, wird für Updates wiederverwendet.
- `format` – Style-Format (`sld`, `mapbox-gl`, `qgis`, `lyrx`, `cesium-3d-tiles`).
- `src` oder `content` – externe URL oder Inline-Content des Styles.
- `layerTargets` – kommagetrennte Liste bzw. Array mit Layer-IDs, die den Style konsumieren.
- `autoApply` – optionales Flag; `true` lädt/pars`t den Style automatisch.
