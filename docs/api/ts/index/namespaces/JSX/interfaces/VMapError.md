[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapError

# Interface: VMapError

Defined in: [src/components.d.ts:1402](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1402)

`<v-map-error>` lauscht auf das `vmap-error` Event seiner Eltern-`<v-map>`
(oder einer per `for`-Attribut adressierten Karte) und rendert die Fehler
als kleine, opinionated gestylte Toast-Stapel innerhalb des Karten-Containers.
Damit können einfache HTML-Beispiele Fehler sichtbar machen, ohne eine
Zeile JavaScript zu schreiben.

## Example

## Properties

### autoDismiss?

> `optional` **autoDismiss**: `number`

Defined in: [src/components.d.ts:1407](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1407)

Auto-Dismiss-Zeit in Millisekunden. `0` deaktiviert das automatische Ausblenden — Toasts bleiben dann sichtbar, bis sie manuell geschlossen oder durch einen neueren Fehler aus dem Stapel gedrängt werden.

#### Default

```ts
5000
```

***

### for?

> `optional` **for**: `string`

Defined in: [src/components.d.ts:1411](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1411)

ID der `<v-map>`-Karte, deren Fehler angezeigt werden sollen. Wenn nicht angegeben, hängt sich die Komponente an das nächste `<v-map>`-Vorfahrenelement im DOM-Baum.

***

### log?

> `optional` **log**: `LogMode`

Defined in: [src/components.d.ts:1416](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1416)

Zusätzliches Logging in die Browser-Console. - `'none'` (Default): nur Toast-Anzeige, kein Console-Output - `'console'`: jeder Fehler wird zusätzlich mit `console.error` geloggt

#### Default

```ts
'none'
```

***

### max?

> `optional` **max**: `number`

Defined in: [src/components.d.ts:1421](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1421)

Maximale Anzahl gleichzeitig sichtbarer Toasts. Ältere werden bei Überschreitung am oberen Ende des Stapels entfernt.

#### Default

```ts
3
```

***

### position?

> `optional` **position**: `ToastPosition`

Defined in: [src/components.d.ts:1426](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L1426)

Position des Toast-Stapels innerhalb des `<v-map>`-Containers.

#### Default

```ts
'top-right'
```
