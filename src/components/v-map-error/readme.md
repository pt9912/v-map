# v-map-error



<!-- Auto Generated Below -->


## Overview

`<v-map-error>` lauscht auf das `vmap-error` Event seiner Eltern-`<v-map>`
(oder einer per `for`-Attribut adressierten Karte) und rendert die Fehler
als kleine, opinionated gestylte Toast-Stapel innerhalb des Karten-Containers.

Damit können einfache HTML-Beispiele Fehler sichtbar machen, ohne eine
Zeile JavaScript zu schreiben.

## Properties

| Property      | Attribute      | Description                                                                                                                                                                                                 | Type                                                                                | Default       |
| ------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------- |
| `autoDismiss` | `auto-dismiss` | Auto-Dismiss-Zeit in Millisekunden. `0` deaktiviert das automatische Ausblenden — Toasts bleiben dann sichtbar, bis sie manuell geschlossen oder durch einen neueren Fehler aus dem Stapel gedrängt werden. | `number`                                                                            | `5000`        |
| `for`         | `for`          | ID der `<v-map>`-Karte, deren Fehler angezeigt werden sollen. Wenn nicht angegeben, hängt sich die Komponente an das nächste `<v-map>`-Vorfahrenelement im DOM-Baum.                                        | `string`                                                                            | `undefined`   |
| `log`         | `log`          | Zusätzliches Logging in die Browser-Console. - `'none'` (Default): nur Toast-Anzeige, kein Console-Output - `'console'`: jeder Fehler wird zusätzlich mit `console.error` geloggt                           | `"console" \| "none"`                                                               | `'none'`      |
| `max`         | `max`          | Maximale Anzahl gleichzeitig sichtbarer Toasts. Ältere werden bei Überschreitung am oberen Ende des Stapels entfernt.                                                                                       | `number`                                                                            | `3`           |
| `position`    | `position`     | Position des Toast-Stapels innerhalb des `<v-map>`-Containers.                                                                                                                                              | `"bottom" \| "bottom-left" \| "bottom-right" \| "top" \| "top-left" \| "top-right"` | `'top-right'` |


## Shadow Parts

| Part          | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| `"badge"`     | Typ-Badge innerhalb des Toasts (z. B. "network", "validation") |
| `"close"`     | Schliessen-Button innerhalb des Toasts                         |
| `"container"` | Wrapper um den gesamten Toast-Stapel                           |
| `"message"`   | Fehler-Nachricht innerhalb des Toasts                          |
| `"toast"`     | Einzelner Fehler-Toast (anpassbar via `::part(toast)`)         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
