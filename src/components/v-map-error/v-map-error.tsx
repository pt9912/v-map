import {
  Component,
  Prop,
  Element,
  State,
  Host,
  h,
} from '@stencil/core';

import { VMapEvents, type VMapErrorDetail } from '../../utils/events';

const MSG_COMPONENT = 'v-map-error';

type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom';

type LogMode = 'console' | 'none';

interface ToastEntry {
  id: number;
  detail: VMapErrorDetail;
  timeoutId?: number;
}

/**
 * `<v-map-error>` lauscht auf das `vmap-error` Event seiner Eltern-`<v-map>`
 * (oder einer per `for`-Attribut adressierten Karte) und rendert die Fehler
 * als kleine, opinionated gestylte Toast-Stapel innerhalb des Karten-Containers.
 *
 * Damit können einfache HTML-Beispiele Fehler sichtbar machen, ohne eine
 * Zeile JavaScript zu schreiben.
 *
 * @example
 * ```html
 * <v-map flavour="ol">
 *   <v-map-error position="top-right" auto-dismiss="5000"></v-map-error>
 *   <v-map-layergroup group-title="Basiskarten" basemapid="OSM-BASE">
 *     <v-map-layer-osm id="OSM-BASE" label="OSM"></v-map-layer-osm>
 *   </v-map-layergroup>
 * </v-map>
 * ```
 *
 * @part container - Wrapper um den gesamten Toast-Stapel
 * @part toast - Einzelner Fehler-Toast (anpassbar via `::part(toast)`)
 * @part badge - Typ-Badge innerhalb des Toasts (z. B. "network", "validation")
 * @part message - Fehler-Nachricht innerhalb des Toasts
 * @part close - Schliessen-Button innerhalb des Toasts
 */
@Component({
  tag: 'v-map-error',
  styleUrl: 'v-map-error.css',
  shadow: true,
})
export class VMapError {
  @Element() host!: HTMLElement;

  /**
   * ID der `<v-map>`-Karte, deren Fehler angezeigt werden sollen.
   * Wenn nicht angegeben, hängt sich die Komponente an das nächste
   * `<v-map>`-Vorfahrenelement im DOM-Baum.
   */
  @Prop() for?: string;

  /**
   * Position des Toast-Stapels innerhalb des `<v-map>`-Containers.
   * @default 'top-right'
   */
  @Prop({ reflect: true }) position: ToastPosition = 'top-right';

  /**
   * Auto-Dismiss-Zeit in Millisekunden. `0` deaktiviert das automatische
   * Ausblenden — Toasts bleiben dann sichtbar, bis sie manuell geschlossen
   * oder durch einen neueren Fehler aus dem Stapel gedrängt werden.
   * @default 5000
   */
  @Prop() autoDismiss: number = 5000;

  /**
   * Maximale Anzahl gleichzeitig sichtbarer Toasts. Ältere werden bei
   * Überschreitung am oberen Ende des Stapels entfernt.
   * @default 3
   */
  @Prop() max: number = 3;

  /**
   * Zusätzliches Logging in die Browser-Console.
   * - `'none'` (Default): nur Toast-Anzeige, kein Console-Output
   * - `'console'`: jeder Fehler wird zusätzlich mit `console.error` geloggt
   * @default 'none'
   */
  @Prop() log: LogMode = 'none';

  @State() toasts: ToastEntry[] = [];

  private mapElement: HTMLElement | null = null;
  private boundHandler = (e: Event) =>
    this.onError(e as CustomEvent<VMapErrorDetail>);
  private retryTimer?: number;
  private nextId = 0;

  // ---- Lifecycle ----------------------------------------------------------

  connectedCallback() {
    this.attach();
  }

  disconnectedCallback() {
    this.detach();
    for (const t of this.toasts) {
      if (t.timeoutId !== undefined) clearTimeout(t.timeoutId);
    }
    this.toasts = [];
    if (this.retryTimer !== undefined) {
      clearTimeout(this.retryTimer);
      this.retryTimer = undefined;
    }
  }

  // ---- DOM-Discovery ------------------------------------------------------

  private attach(retry = 0) {
    const target = this.for
      ? document.getElementById(this.for)
      : this.host.closest('v-map');

    if (target instanceof HTMLElement) {
      this.mapElement = target;
      this.mapElement.addEventListener(VMapEvents.Error, this.boundHandler);
      return;
    }

    // Karte noch nicht im DOM - kurz warten und erneut versuchen
    if (retry < 50) {
      this.retryTimer = window.setTimeout(
        () => this.attach(retry + 1),
        100,
      );
    }
  }

  private detach() {
    if (this.mapElement) {
      this.mapElement.removeEventListener(VMapEvents.Error, this.boundHandler);
      this.mapElement = null;
    }
  }

  // ---- Error Handling -----------------------------------------------------

  private onError(e: CustomEvent<VMapErrorDetail>) {
    const detail = e.detail;
    if (!detail) return;

    if (this.log === 'console') {
      console.error(`[${MSG_COMPONENT}]`, detail.type, detail.message, detail);
    }

    const id = this.nextId++;
    const toast: ToastEntry = { id, detail };

    if (this.autoDismiss > 0) {
      toast.timeoutId = window.setTimeout(
        () => this.dismiss(id),
        this.autoDismiss,
      );
    }

    const next = [...this.toasts, toast];
    while (next.length > this.max) {
      const removed = next.shift();
      if (removed?.timeoutId !== undefined) clearTimeout(removed.timeoutId);
    }
    this.toasts = next;
  }

  private dismiss(id: number) {
    const target = this.toasts.find(t => t.id === id);
    if (target?.timeoutId !== undefined) clearTimeout(target.timeoutId);
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  // ---- Render -------------------------------------------------------------

  render() {
    return (
      <Host>
        <div class="stack" part="container">
          {this.toasts.map(t => (
            <div
              key={t.id}
              class="toast"
              part="toast"
              role="alert"
              aria-live="assertive"
            >
              <span class="badge" part="badge">
                {t.detail.type}
              </span>
              <span class="message" part="message">
                {t.detail.message}
              </span>
              <button
                type="button"
                class="close"
                part="close"
                aria-label="Schliessen"
                onClick={() => this.dismiss(t.id)}
              >
                {'\u00d7'}
              </button>
            </div>
          ))}
        </div>
      </Host>
    );
  }
}
