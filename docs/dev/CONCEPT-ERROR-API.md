# Error-API für v-map Web Components

Diese Datei ist keine historische Migrationsnotiz mehr, sondern die verbindliche Entwicklungsrichtlinie für die Error-API in `v-map`.

Status: Das Error-Konzept ist im aktuellen Codebestand umgesetzt. Neue `v-map`-Web-Components muessen dieses Konzept von Anfang an beruecksichtigen.

## Geltungsbereich

Diese Richtlinie gilt fuer:

- alle neuen `v-map-layer-*`-Komponenten
- bestehende Layer, wenn sie erweitert oder refaktoriert werden
- andere Komponenten mit eigener Parse-, Lade- oder Provider-Logik

Nicht jedes neue Component braucht exakt dieselbe Public API. Fuer Layer ist sie verpflichtend, fuer Nicht-Layer mindestens das einheitliche Error-Event.

## Ziele

- Fehler muessen fuer Konsumenten programmatisch sichtbar sein.
- Fehler muessen zentral am `<v-map>`-Element beobachtbar sein.
- Fehlerzustaende muessen deklarativ im DOM erkennbar sein.
- Retry-, Reattach- und Provider-Recovery-Pfade duerfen keine Sonderlogik pro Komponente erzwingen.

## Verbindliche API fuer neue Layer-Komponenten

Jede neue Layer-Komponente muss dieselbe Error-API wie die bestehenden Layer bereitstellen:

1. Einheitliches Event: `vmap-error`
2. Reflektierte Prop: `loadState` als `load-state`
3. Oeffentliche Methode: `getError(): Promise<VMapErrorDetail | undefined>`

### Einheitliches Error-Event

Alle Komponenten dispatchen `vmap-error` mit `bubbles: true` und `composed: true`.

Kanonische Definition:

- `src/utils/events.ts`

```ts
export const VMapEvents = {
  Ready: 'ready',
  Error: 'vmap-error',
  // ...
} as const;

export interface VMapErrorDetail {
  type: 'network' | 'validation' | 'parse' | 'provider';
  message: string;
  attribute?: string;
  cause?: unknown;
}
```

### Reflektierter Ladezustand

Jede neue Layer-Komponente muss ihren Zustand als reflektierte Stencil-Prop exponieren:

```ts
@Prop({ attribute: 'load-state', reflect: true, mutable: true })
loadState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';
```

Bedeutung:

- `idle`: noch nicht initialisiert oder nach sauberem Dispose/Shutdown
- `loading`: Initialisierung, Retry oder Rebuild laeuft
- `ready`: Layer wurde erfolgreich beim Provider angelegt oder aktualisiert
- `error`: letzter Versuch ist fehlgeschlagen

Wichtig:

- `loadState` ist die einzige Wahrheitsquelle fuer diesen Zustand.
- Die Komponente setzt den Zustand ueber `setLoadState(...)`, nicht per `setAttribute(...)`.
- Das bestehende `ready`-Event bleibt aus Rueckwaertskompatibilitaet bestehen, ist aber kein Erfolgssignal.

### Oeffentliche Fehlerabfrage

Neue Layer muessen eine oeffentliche Stencil-Methode anbieten:

```ts
@Method()
async getError(): Promise<VMapErrorDetail | undefined> {
  return this.helper?.getError();
}
```

## Fehlerkategorien

Nur diese vier Kategorien sollen fuer die einheitliche Error-API verwendet werden:

| Typ | Verwendung | Beispiele |
| --- | --- | --- |
| `network` | Netzwerk- oder HTTP-Fehler | Request fehlgeschlagen, 404, CORS |
| `validation` | ungueltige fachliche Eingaben | Pflichtattribut fehlt, Prop-Kombination unzulaessig |
| `parse` | Eingabe formal nicht parsebar | invalides JSON, defekte GeoJSON-/WKT-/Style-Eingaben |
| `provider` | Provider- oder Layer-Lifecycle-Fehler | `addLayer()` fehlgeschlagen, Provider nicht verfuegbar |

## Bevorzugtes Implementierungsmuster

Neue Layer sollen standardmaessig `VMapLayerHelper` per Komposition nutzen.

Kanonische Stellen:

- `src/layer/v-map-layer-helper.ts`
- `src/utils/events.ts`

### Warum `VMapLayerHelper`

- einheitlicher Event-Dispatch
- einheitliches Error-Detail-Format
- einheitliche Recovery bei `updateLayer()`
- korrekter Reset bei Provider-Shutdown und `disconnectedCallback()`
- weniger divergierende Lifecycle-Logik in einzelnen Layern

Ein neuer Layer ohne `VMapLayerHelper` ist nur in begruendeten Ausnahmefaellen zulaessig. Die Abweichung muss im PR explizit begruendet werden.

### Minimales Skelett fuer neue Layer

```ts
export class VMapLayerFoo implements VMapErrorHost {
  @Element() el!: HTMLElement;

  @Prop({ attribute: 'load-state', reflect: true, mutable: true })
  loadState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';

  @Event() ready!: EventEmitter<void>;

  private helper!: VMapLayerHelper;
  private hasLoadedOnce = false;

  setLoadState(state: 'idle' | 'loading' | 'ready' | 'error') {
    this.loadState = state;
  }

  @Method()
  async getError(): Promise<VMapErrorDetail | undefined> {
    return this.helper?.getError();
  }

  componentWillLoad() {
    this.helper = new VMapLayerHelper(this.el, this);
  }

  async componentDidLoad() {
    this.helper.startLoading();
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);
    this.hasLoadedOnce = true;
    this.ready.emit();
  }

  async connectedCallback() {
    if (!this.hasLoadedOnce) return;
    this.helper.startLoading();
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);
  }

  async disconnectedCallback() {
    await this.helper?.dispose();
  }
}
```

## Regeln fuer Watcher und Fehlerpfade

### Parse- und Validierungsfehler

Wenn die Komponente Props oder Slot-Inhalte selbst parst oder validiert, muessen Fehler direkt ueber den Helper gemeldet werden:

```ts
this.helper?.setError({
  type: 'parse',
  message: 'Invalid params JSON',
  attribute: 'params',
  cause: error,
});
```

Regel:

- kein `console.warn()` als Error-API-Ersatz
- kein stilles `return undefined` bei fehlerhaften Eingaben ohne `setError(...)`
- `attribute` setzen, wenn der Fehler einer konkreten Prop oder einem konkreten Attribut zugeordnet werden kann

### Sichtbarkeit, Opacity, Z-Index

Diese Mutatoren bleiben reine Mutatoren:

- `helper.setVisible(...)`
- `helper.setOpacity(...)`
- `helper.setZIndex(...)`

Sie duerfen keinen impliziten Rebuild anstossen und keinen `ready`-Zustand vortaeuschen.

### Re-add-faehige Updates

Wenn eine Aenderung semantisch einen neuen Layer-Aufbau oder ein Provider-Update ausloest, soll die Komponente `helper.updateLayer(...)` verwenden.

Das gilt insbesondere fuer:

- Quell-URLs
- Parser-/Provider-relevante Konfiguration
- Layer-Daten, die intern ein Recreate oder Provider-Update erfordern

## Besondere Regeln fuer Nicht-Layer-Komponenten

### `v-map-style`

`v-map-style` behaelt seine bestehende Public API:

- `styleError`
- `getError(): Error | undefined`

Zusaetzlich muss `v-map-style` weiterhin das einheitliche `vmap-error` dispatchen und zwischen `network` und `parse` unterscheiden.

### `v-map-builder`

`v-map-builder` behaelt seine bestehende Public API:

- `configError`

Zusaetzlich muss `v-map-builder` weiterhin `vmap-error` mit `type: 'validation'` dispatchen.

## Checkliste fuer neue `v-map-layer-*`-Komponenten

Vor dem Merge eines neuen Layers muss geprueft werden:

- `loadState` ist als reflektierte Prop vorhanden.
- `getError()` ist als `@Method()` vorhanden.
- `VMapLayerHelper(this.el, this)` wird verwendet, sofern kein begruendeter Ausnahmefall vorliegt.
- `componentDidLoad()`, `connectedCallback()` und `disconnectedCallback()` folgen dem etablierten Pattern.
- Parse- oder Validierungsfehler rufen `helper.setError(...)` mit passendem `type` auf.
- Provider-relevante Updates laufen ueber `helper.updateLayer(...)`.
- `ready` bleibt kompatibel, wird aber nicht als Erfolgssignal missverstanden.
- `vmap-error` bubbelt bis zum umgebenden `<v-map>`.

## Testanforderungen fuer neue Komponenten

Neue oder wesentlich geaenderte Komponenten muessen die Error-API mit testen.

Mindestens erforderlich:

- Spec-Test fuer `loadState`
- Spec-Test fuer `getError()`
- Spec-Test fuer Parse-/Validierungsfehler mit korrektem `VMapErrorDetail`
- Test fuer unveraenderte `ready`-Semantik
- Test fuer Bubbling von `vmap-error`

Wenn die Komponente echte Hydration, Provider-Lifecycle oder DOM-Reflexion relevant nutzt, sind zusaetzlich Browser- oder Integrations-Tests sinnvoll.

Orientierung an bestehenden Tests:

- `src/layer/error-api-integration.spec.ts`
- `src/components/v-map-layer-osm/error-api.test.ts`

## Abweichungen

Wenn eine neue Komponente dieses Konzept bewusst nicht vollstaendig uebernimmt, muss der PR mindestens dokumentieren:

- warum `VMapLayerHelper` nicht verwendet wird
- wie stattdessen `vmap-error` dispatcht wird
- wie Fehlerzustand und Recovery fuer Konsumenten sichtbar bleiben
- warum die Abweichung keine neue inkonsistente Error-API einfuehrt

Ohne diese Begruendung gilt die Abweichung als Designfehler.
