# Styling mit v-map-style

`<v-map-style>` parst kartographische Styles in verschiedenen Formaten und wendet sie auf Layer-Komponenten an. Die Kommunikation zwischen Style und Layer erfolgt ueber Events.

## Unterstuetzte Formate

| Format | Attribut | Beschreibung |
|--------|----------|--------------|
| GeoStyler | `format="geostyler"` | GeoStyler-Style direkt als JSON (kein Parser noetig) |
| SLD | `format="sld"` | OGC Styled Layer Descriptor (XML) |
| Mapbox GL | `format="mapbox-gl"` | Mapbox GL Style Specification (JSON) |
| QGIS | `format="qgis"` | QGIS .qml Style-Export (XML/JSON) |
| LYRX | `format="lyrx"` | ArcGIS Pro Layer-Definition (JSON) |
| Cesium 3D Tiles | `format="cesium-3d-tiles"` | Cesium 3D Tileset Styling (JSON) |

## Grundlagen

Ein `<v-map-style>` wird innerhalb von `<v-map>` platziert. Ueber `layer-targets` wird festgelegt, welche Layer den Style erhalten.

```html
<v-map flavour="ol" style="height: 400px;">
  <v-map-style
    format="sld"
    layer-targets="poi-layer"
    content='<?xml version="1.0" encoding="UTF-8"?>
      <StyledLayerDescriptor version="1.0.0"
        xmlns="http://www.opengis.net/sld">
        <NamedLayer>
          <Name>poi</Name>
          <UserStyle>
            <FeatureTypeStyle>
              <Rule>
                <PointSymbolizer>
                  <Graphic>
                    <Mark>
                      <WellKnownName>circle</WellKnownName>
                      <Fill>
                        <CssParameter name="fill">#ff0000</CssParameter>
                      </Fill>
                    </Mark>
                    <Size>12</Size>
                  </Graphic>
                </PointSymbolizer>
              </Rule>
            </FeatureTypeStyle>
          </UserStyle>
        </NamedLayer>
      </StyledLayerDescriptor>'>
  </v-map-style>

  <v-map-layergroup group-title="POIs">
    <v-map-layer-wkt
      id="poi-layer"
      wkt="POINT(11.575 48.137)"
      z-index="10">
    </v-map-layer-wkt>
  </v-map-layergroup>
</v-map>
```

## Properties

| Property | Attribut | Typ | Default | Beschreibung |
|----------|----------|-----|---------|--------------|
| `format` | `format` | `'sld' \| 'mapbox-gl' \| 'qgis' \| 'lyrx' \| 'cesium-3d-tiles'` | `'sld'` | Zu verwendendes Style-Format |
| `src` | `src` | `string` | — | URL zum Laden des Styles |
| `content` | `content` | `string` | — | Inline-Style-Inhalt als String |
| `layerTargets` | `layer-targets` | `string` | — | Komma-getrennte Layer-IDs |
| `autoApply` | `auto-apply` | `boolean` | `true` | Automatisches Parsen bei Aenderungen |

`src` und `content` sind alternativ — eines von beiden muss gesetzt sein.

## Style von URL laden

```html
<v-map-style
  format="mapbox-gl"
  src="https://example.com/styles/buildings.json"
  layer-targets="buildings-layer">
</v-map-style>
```

## Mehrere Styles fuer verschiedene Layer

Jeder Layer kann einen eigenen Style erhalten:

```html
<v-map flavour="ol" style="height: 400px;">
  <v-map-style format="sld" content="..." layer-targets="punkte"></v-map-style>
  <v-map-style format="sld" content="..." layer-targets="linien"></v-map-style>
  <v-map-style format="sld" content="..." layer-targets="flaechen"></v-map-style>

  <v-map-layergroup group-title="Daten">
    <v-map-layer-wkt id="punkte" wkt="POINT(11.5 48.1)" z-index="10"></v-map-layer-wkt>
    <v-map-layer-wkt id="linien" wkt="LINESTRING(11.5 48.1, 11.6 48.2)" z-index="10"></v-map-layer-wkt>
    <v-map-layer-geojson id="flaechen" url="/data/polygons.geojson" z-index="5"></v-map-layer-geojson>
  </v-map-layergroup>
</v-map>
```

Ein Style kann auch mehrere Layer ansprechen:

```html
<v-map-style
  format="sld"
  content="..."
  layer-targets="layer-a,layer-b,layer-c">
</v-map-style>
```

## Kompatible Layer-Typen

`v-map-style` funktioniert mit allen Vektor-Layern:

- `v-map-layer-wkt` — WKT-Geometrien
- `v-map-layer-geojson` — GeoJSON-Daten
- `v-map-layer-wfs` — Web Feature Service

Fuer 3D-Kacheln:

- `v-map-layer-tile3d` — mit `format="cesium-3d-tiles"`

Fuer Raster-Daten (ColorMap):

- `v-map-layer-geotiff` — GeoTIFF mit GeoStyler ColorMap aus SLD

## Events

### `styleReady`

Wird ausgeloest, wenn der Style erfolgreich geparst wurde.

```html
<v-map-style id="style" format="sld" content="..."></v-map-style>

<script type="module">
  const style = document.getElementById('style');

  style.addEventListener('styleReady', (event) => {
    console.log('Style geparst:', event.detail.style);
    console.log('Ziel-Layer:', event.detail.layerIds);
  });
</script>
```

### `styleError`

Wird bei Parse- oder Fetch-Fehlern ausgeloest.

```html
<script type="module">
  const style = document.getElementById('style');

  style.addEventListener('styleError', (event) => {
    console.error('Style-Fehler:', event.detail.message);
  });
</script>
```

### `vmap-error`

Zusaetzlich wird das einheitliche `vmap-error`-Event dispatcht (`bubbles: true`, `composed: true`). Damit koennen Style-Fehler zentral am `<v-map>` abgefangen werden:

```html
<script type="module">
  const map = document.querySelector('v-map');

  map.addEventListener('vmap-error', (event) => {
    if (event.target.tagName === 'V-MAP-STYLE') {
      console.error('Style-Fehler:', event.detail.type, event.detail.message);
    }
  });
</script>
```

## Methoden

### `getStyle()`

Gibt den aktuell geparseten Style zurueck.

```javascript
const style = await document.getElementById('style').getStyle();
```

### `getLayerTargetIds()`

Gibt die Ziel-Layer-IDs als Array zurueck.

```javascript
const ids = await document.getElementById('style').getLayerTargetIds();
// ['layer-a', 'layer-b']
```

### `getError()`

Gibt den letzten Fehler zurueck, oder `undefined`.

```javascript
const error = await document.getElementById('style').getError();
if (error) {
  console.log(error.type, error.message);
}
```

## Manuelles Laden (autoApply=false)

Wenn `auto-apply="false"` gesetzt ist, muss das Parsen explizit ausgeloest werden:

```html
<v-map-style
  id="manual-style"
  format="sld"
  content="..."
  layer-targets="my-layer"
  auto-apply="false">
</v-map-style>

<button id="load-btn">Style laden</button>

<script type="module">
  const styleEl = document.getElementById('manual-style');
  const btn = document.getElementById('load-btn');

  btn.addEventListener('click', async () => {
    await styleEl.loadAndParseStyle();
    console.log('Style geladen:', await styleEl.getStyle());
  });
</script>
```

## Style dynamisch aendern

Wenn `auto-apply="true"` (Standard), wird bei jeder Aenderung von `src`, `content` oder `format` automatisch neu geparst und das `styleReady`-Event erneut ausgeloest.

```javascript
const styleEl = document.querySelector('v-map-style');

// Format wechseln
styleEl.format = 'mapbox-gl';
styleEl.content = JSON.stringify(mapboxStyle);

// Oder neue URL setzen
styleEl.src = '/styles/neue-version.sld';
```

## Verwendung mit v-map-builder

In YAML/JSON-Konfigurationen fuer `v-map-builder`:

```yaml
map:
  flavour: ol
  styles:
    - key: poi-style
      format: sld
      src: /styles/poi.sld
      layerTargets: poi-layer
    - key: buildings-style
      format: mapbox-gl
      content: '{"version": 8, "layers": [...]}'
      layerTargets: buildings
  layerGroups:
    - title: Daten
      layers:
        - type: wkt
          id: poi-layer
          wkt: "POINT(11.575 48.137)"
```

## Fehlerbehandlung

Typische Fehlerfaelle:

| Fehlertyp | Ursache | Beispiel |
|-----------|---------|---------|
| `network` | URL nicht erreichbar | `src="https://invalid/style.sld"` |
| `parse` | Ungueltiges Format | SLD mit fehlerhaftem XML |

```html
<v-map id="map" flavour="ol" style="height: 400px;">
  <v-map-style
    format="sld"
    src="https://invalid.example.com/style.sld"
    layer-targets="my-layer">
  </v-map-style>
</v-map>

<script type="module">
  const map = document.getElementById('map');

  map.addEventListener('vmap-error', (event) => {
    if (event.detail.type === 'network') {
      console.error('Style konnte nicht geladen werden:', event.detail.message);
    }
    if (event.detail.type === 'parse') {
      console.error('Style konnte nicht geparst werden:', event.detail.message);
    }
  });
</script>
```

## Das GeoStyler-Zwischenformat

Die Formate SLD, Mapbox GL, QGIS und LYRX werden intern in das [GeoStyler](https://geostyler.org/)-Format ueberfuehrt. Dieses Zwischenformat ist ein JSON-Objekt mit `name` und `rules`:

> **Ausnahme:** `format="cesium-3d-tiles"` umgeht GeoStyler vollstaendig. Der JSON-Inhalt wird direkt als `Cesium3DTileStyle`-Objekt an `v-map-layer-tile3d` weitergereicht (siehe [Cesium 3D Tiles Styling](#cesium-3d-tiles-styling) weiter unten).

```json
{
  "name": "Mein Style",
  "rules": [
    {
      "name": "Rote Punkte",
      "symbolizers": [
        {
          "kind": "Mark",
          "wellKnownName": "circle",
          "color": "#ff0000",
          "radius": 8,
          "strokeColor": "#000000",
          "strokeWidth": 1
        }
      ]
    }
  ]
}
```

### Unterstuetzte Symbolizer

| Kind | Beschreibung | Anwendung |
|------|-------------|-----------|
| `Mark` | Punkt-Symbole (circle, square, triangle, star, cross, x) | Punkt-Geometrien |
| `Icon` | Bild-basierte Symbole (PNG/SVG URL) | Punkt-Geometrien |
| `Line` | Linienstile (Farbe, Breite, Strichelung) | Linien-Geometrien |
| `Fill` | Flaechenfuellung (Farbe, Opacity, Umrisslinie) | Polygon-Geometrien |
| `Text` | Beschriftungen (Font, Groesse, Halo) | Alle Geometrien |
| `Raster` | ColorMap fuer Rasterdaten | GeoTIFF-Layer |

### Rules mit Filtern

Rules koennen Filter enthalten, um Styles auf bestimmte Features einzuschraenken:

```json
{
  "name": "Grosse Staedte",
  "filter": [">=", "population", 1000000],
  "symbolizers": [
    {
      "kind": "Mark",
      "wellKnownName": "circle",
      "color": "#ff0000",
      "radius": 12
    }
  ]
}
```

### GeoStyler-Style direkt uebergeben

Mit `format="geostyler"` kann ein GeoStyler-Style-Objekt direkt als JSON uebergeben werden — ohne den Umweg ueber SLD, Mapbox GL oder andere Formate:

```html
<v-map-style
  format="geostyler"
  layer-targets="my-layer"
  content='{
    "name": "Rote Kreise",
    "rules": [{
      "name": "default",
      "symbolizers": [{
        "kind": "Mark",
        "wellKnownName": "circle",
        "color": "#ff0000",
        "radius": 8
      }]
    }]
  }'>
</v-map-style>
```

### Direkter Zugriff auf den GeoStyler-Style

Der geparste Style kann programmatisch abgerufen und manipuliert werden:

```javascript
const styleEl = document.querySelector('v-map-style');
const style = await styleEl.getStyle();

// Style inspizieren
console.log('Name:', style.name);
console.log('Anzahl Rules:', style.rules.length);

// Erste Regel pruefen
const rule = style.rules[0];
console.log('Symbolizer:', rule.symbolizers[0].kind);
```

### Raster-ColorMap fuer GeoTIFF

Fuer `v-map-layer-geotiff` koennen ueber SLD Raster-Symbolizer mit ColorMap definiert werden:

```xml
<RasterSymbolizer>
  <ColorMap type="ramp">
    <ColorMapEntry color="#0000ff" quantity="0" label="Niedrig" />
    <ColorMapEntry color="#00ff00" quantity="500" label="Mittel" />
    <ColorMapEntry color="#ff0000" quantity="1000" label="Hoch" />
  </ColorMap>
</RasterSymbolizer>
```

Der GeoTIFF-Layer uebernimmt die ColorMap automatisch aus dem `styleReady`-Event.

## Wie Styles angewendet werden

1. `<v-map-style>` parst den Style und feuert `styleReady`
2. Das Event bubblet durch den DOM (`composed: true`)
3. Layer-Komponenten hoeren auf `styleReady` auf Document-Ebene
4. Jeder Layer prueft, ob seine ID in `layerIds` enthalten ist
5. Bei Treffer: Der GeoStyler-Style wird gespeichert und an den Map-Provider weitergegeben
6. Der Provider konvertiert den GeoStyler-Style ins native Format:
   - **OpenLayers**: OL Style Functions (`ol/style/Style`)
   - **Leaflet**: Leaflet Path Options
   - **Deck.gl**: Farb- und Property-Mappings
   - **Cesium**: `Cesium3DTileStyle` (bei `format="cesium-3d-tiles"` wird direkt durchgereicht)

GeoStyler-Styles haben Vorrang vor einfachen Style-Properties (`fill-color`, `stroke-color` etc.) auf dem Layer-Element.

## Cesium 3D Tiles Styling

Fuer `v-map-layer-tile3d` wird `format="cesium-3d-tiles"` verwendet. Dieser Pfad umgeht GeoStyler — der JSON-Inhalt wird direkt als Cesium `3DTileStyle` an den Layer weitergereicht.

```html
<v-map flavour="cesium" style="height: 400px;">
  <v-map-style
    format="cesium-3d-tiles"
    layer-targets="buildings-3d"
    content='{
      "color": {
        "conditions": [
          ["${height} > 100", "color(\"red\")"],
          ["${height} > 50",  "color(\"orange\")"],
          ["true",            "color(\"white\")"]
        ]
      },
      "show": true
    }'>
  </v-map-style>

  <v-map-layergroup group-title="3D">
    <v-map-layer-tile3d
      id="buildings-3d"
      url="https://example.com/tileset.json"
      z-index="10">
    </v-map-layer-tile3d>
  </v-map-layergroup>
</v-map>
```

Das Style-Objekt folgt der [Cesium 3D Tiles Styling Specification](https://github.com/CesiumGS/3d-tiles/tree/main/specification/Styling) und unterstuetzt:

- `color` — Farbe basierend auf Feature-Properties (Conditions oder Expressions)
- `show` — Sichtbarkeit basierend auf Feature-Properties
- `pointSize` — Punktgroesse fuer Point-Cloud-Daten
