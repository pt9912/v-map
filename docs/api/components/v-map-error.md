# v-map-error

[← Zur Übersicht](./) · [**@npm9912/v-map**](/)

`<v-map-error>` lauscht auf das `vmap-error` Event seiner Eltern-`<v-map>` (oder einer per `for`-Attribut adressierten Karte) und rendert die Fehler als kleine, opinionated gestylte Toast-Stapel innerhalb des Karten-Containers.  Damit können einfache HTML-Beispiele Fehler sichtbar machen, ohne eine Zeile JavaScript zu schreiben.

### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `autoDismiss` | `number` | `auto-dismiss` | `5000` | Auto-Dismiss-Zeit in Millisekunden. `0` deaktiviert das automatische Ausblenden — Toasts bleiben dann sichtbar, bis sie manuell geschlossen oder durch einen neueren Fehler aus dem Stapel gedrängt werden. |
| `for` | `string` | `for` |  | ID der `<v-map>`-Karte, deren Fehler angezeigt werden sollen. Wenn nicht angegeben, hängt sich die Komponente an das nächste `<v-map>`-Vorfahrenelement im DOM-Baum. |
| `log` | `console \| none` | `log` | `'none'` | Zusätzliches Logging in die Browser-Console. - `'none'` (Default): nur Toast-Anzeige, kein Console-Output - `'console'`: jeder Fehler wird zusätzlich mit `console.error` geloggt |
| `max` | `number` | `max` | `3` | Maximale Anzahl gleichzeitig sichtbarer Toasts. Ältere werden bei Überschreitung am oberen Ende des Stapels entfernt. |
| `position` | `bottom \| bottom-left \| bottom-right \| top \| top-left \| top-right` | `position` | `'top-right'` | Position des Toast-Stapels innerhalb des `<v-map>`-Containers. |

### CSS Parts

| Part | Beschreibung |
| --- | --- |
| `badge` | Typ-Badge innerhalb des Toasts (z. B. "network", "validation") |
| `close` | Schliessen-Button innerhalb des Toasts |
| `container` | Wrapper um den gesamten Toast-Stapel |
| `message` | Fehler-Nachricht innerhalb des Toasts |
| `toast` | Einzelner Fehler-Toast (anpassbar via `::part(toast)`) |

