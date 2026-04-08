# Error Handling

Diese Seite beschreibt die öffentliche Error-API für Anwender von `v-map`.

Für Layer-Komponenten stehen vier Mechanismen zur Verfügung:

- `<v-map-error>` für **deklaratives** Error-Handling ohne JavaScript
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

## Toasts ohne JavaScript: `<v-map-error>`

Der einfachste Weg, Fehler sichtbar zu machen — ein einziges Element als
Kind von `<v-map>`, kein Listener-Code, kein Boilerplate:

```html
<v-map flavour="ol" style="height: 400px;">
  <v-map-error position="top-right" auto-dismiss="5000"></v-map-error>

  <v-map-layer-wms
    url="https://broken.example.com/wms"
    layers="roads">
  </v-map-layer-wms>
</v-map>
```

Sobald ein Layer ein `vmap-error` Event feuert, rendert `<v-map-error>`
einen kleinen Toast im Karten-Container. Default-Styling ist opinionated
(dunkler, abgerundeter Toast mit roter Akzentleiste) und braucht kein
zusätzliches CSS.

**Props:**

| Prop | Werte | Default | Bedeutung |
|---|---|---|---|
| `for` | string (Element-ID) | — | Optional. Welche `<v-map>`-Karte beobachtet werden soll. Ohne Angabe bindet sich die Komponente an die nächste `<v-map>` im DOM-Baum. |
| `position` | `top-right` · `top-left` · `top` · `bottom-right` · `bottom-left` · `bottom` | `top-right` | Ecke/Kante des Karten-Containers. |
| `auto-dismiss` | Zahl (ms), `0` | `5000` | Auto-Dismiss-Zeit pro Toast. `0` lässt Toasts stehen, bis sie manuell geschlossen oder vom Stapel gedrängt werden. |
| `max` | Zahl | `3` | Maximale Anzahl gleichzeitig sichtbarer Toasts. Ältere werden bei Überschreitung am oberen Ende des Stapels entfernt. |
| `log` | `none` · `console` | `none` | Bei `console` wird jeder Fehler zusätzlich mit `console.error` geloggt. |

**Eigenes Styling über CSS-Parts:**

```css
v-map-error::part(toast) {
  background: #1a3a52;
  border-left-color: #ffc107;
}
v-map-error::part(badge) {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}
v-map-error::part(message) {
  font-weight: 500;
}
```

Verfügbare Parts: `container`, `toast`, `badge`, `message`, `close`.

**Mehrere Karten gezielt adressieren:**

```html
<v-map id="left-map" flavour="ol">…</v-map>
<v-map id="right-map" flavour="leaflet">…</v-map>

<!-- Globaler Toast für die linke Karte -->
<v-map-error for="left-map" position="bottom"></v-map-error>
```

---

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
