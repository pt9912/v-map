# Error Handling

Diese Seite beschreibt die öffentliche Error-API für Anwender von `v-map`.

Für Layer-Komponenten stehen drei Mechanismen zur Verfügung:

- `vmap-error` für reaktives Error-Handling
- `load-state` für deklarative Zustandsprüfung im DOM
- `getError()` für das letzte Fehlerdetail

Wichtig:

- Das bestehende `ready`-Event bleibt erhalten, ist aber kein verlässliches Erfolgssignal.
- Für die tatsächliche Erfolgskontrolle soll `load-state="ready"` verwendet werden.

## Überblick

Layer-Komponenten unterstützen diese Zustände:

- `load-state="idle"`: noch nicht initialisiert oder nach Dispose/Shutdown
- `load-state="loading"`: Initialisierung oder Retry läuft
- `load-state="ready"`: Layer wurde erfolgreich hinzugefügt oder aktualisiert
- `load-state="error"`: letzter Versuch ist fehlgeschlagen

Das Fehlerdetail von `vmap-error` und `getError()` hat diese Form:

```ts
type VMapErrorDetail = {
  type: 'network' | 'validation' | 'parse' | 'provider';
  message: string;
  attribute?: string;
  cause?: unknown;
};
```

## Einzelnes Layer beobachten

```html
<v-map flavour="ol" style="height: 400px;">
  <v-map-layer-wms
    id="roads-layer"
    url="https://example.com/wms"
    layers="roads">
  </v-map-layer-wms>
</v-map>

<script type="module">
  const layer = document.getElementById('roads-layer');

  layer.addEventListener('vmap-error', event => {
    const error = event.detail;
    console.error('Layer-Fehler:', error.type, error.message);
  });
</script>
```

## Alle Fehler zentral am `<v-map>` abfangen

`vmap-error` wird mit `bubbles: true` und `composed: true` dispatcht. Dadurch kann ein Listener am `<v-map>` Fehler aller verschachtelten Layer zentral behandeln.

```html
<v-map id="map" flavour="ol" style="height: 400px;">
  <v-map-layer-osm></v-map-layer-osm>
  <v-map-layer-wms
    id="wms-layer"
    url="https://example.com/wms"
    layers="roads">
  </v-map-layer-wms>
</v-map>

<script type="module">
  const map = document.getElementById('map');

  map.addEventListener('vmap-error', event => {
    const source = event.target;
    const error = event.detail;

    console.error(
      'Fehler in',
      source.tagName,
      '(' + error.type + '):',
      error.message,
    );
  });
</script>
```

## `load-state` für CSS und DOM-Abfragen verwenden

```html
<style>
  [load-state="loading"] {
    opacity: 0.5;
  }

  [load-state="error"] {
    outline: 2px dashed red;
  }
</style>

<script type="module">
  const faultyLayers = document.querySelectorAll('[load-state="error"]');
  console.log('Fehlerhafte Layer:', faultyLayers.length);
</script>
```

## Fehler aktiv abfragen

`getError()` liefert den letzten bekannten Fehler oder `undefined`.

```html
<v-map flavour="ol" style="height: 400px;">
  <v-map-layer-xyz
    id="xyz-layer"
    url="https://tiles.example.com/{z}/{x}/{y}.png">
  </v-map-layer-xyz>
</v-map>

<script type="module">
  const layer = document.getElementById('xyz-layer');

  layer.addEventListener('vmap-error', async () => {
    const error = await layer.getError();

    if (error) {
      console.log('Typ:', error.type);
      console.log('Message:', error.message);
      console.log('Attribut:', error.attribute);
      console.log('Cause:', error.cause);
    }
  });
</script>
```

## `ready` vs. `load-state`

`ready` bedeutet weiterhin, dass der Initialisierungspfad der Komponente durchlaufen wurde. Das Event ist aus Kompatibilitätsgründen weiterhin vorhanden.

Für neue Anwendungen gilt:

- Erfolg nicht nur über `ready` ableiten
- Erfolg über `load-state="ready"` prüfen
- Fehler über `vmap-error` oder `getError()` behandeln

## Typische Muster

### Fehlerbanner bei beliebigem Layer-Fehler

```html
<div id="map-error" hidden></div>

<script type="module">
  const map = document.querySelector('v-map');
  const banner = document.getElementById('map-error');

  map.addEventListener('vmap-error', event => {
    banner.hidden = false;
    banner.textContent = event.detail.message;
  });
</script>
```

### Nur Parse-Fehler gezielt behandeln

```html
<script type="module">
  const map = document.querySelector('v-map');

  map.addEventListener('vmap-error', event => {
    if (event.detail.type === 'parse') {
      console.warn('Ungültige Eingabe an', event.target.tagName);
    }
  });
</script>
```

## Hinweise zu `v-map-style` und `v-map-builder`

`v-map-style` und `v-map-builder` dispatchen ebenfalls das einheitliche `vmap-error`-Event.

Zusätzlich behalten sie ihre bestehenden APIs:

- `v-map-style`: `styleError`, `getError()`
- `v-map-builder`: `configError`

Wenn du Fehler zentral am `<v-map>` oder am jeweiligen Host-Element behandeln willst, ist `vmap-error` die einheitliche Schnittstelle.
