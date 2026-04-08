[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapError

# Interface: VMapError

Defined in: [src/components.d.ts:89](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L89)

`<v-map-error>` lauscht auf das `vmap-error` Event seiner Eltern-`<v-map>`
(oder einer per `for`-Attribut adressierten Karte) und rendert die Fehler
als kleine, opinionated gestylte Toast-Stapel innerhalb des Karten-Containers.
Damit können einfache HTML-Beispiele Fehler sichtbar machen, ohne eine
Zeile JavaScript zu schreiben.

## Example

## Properties

### autoDismiss

> **autoDismiss**: `number`

Defined in: [src/components.d.ts:94](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L94)

Auto-Dismiss-Zeit in Millisekunden. `0` deaktiviert das automatische Ausblenden — Toasts bleiben dann sichtbar, bis sie manuell geschlossen oder durch einen neueren Fehler aus dem Stapel gedrängt werden.

#### Default

```ts
5000
```

***

### for?

> `optional` **for**: `string`

Defined in: [src/components.d.ts:98](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L98)

ID der `<v-map>`-Karte, deren Fehler angezeigt werden sollen. Wenn nicht angegeben, hängt sich die Komponente an das nächste `<v-map>`-Vorfahrenelement im DOM-Baum.

***

### log

> **log**: `LogMode`

Defined in: [src/components.d.ts:103](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L103)

Zusätzliches Logging in die Browser-Console. - `'none'` (Default): nur Toast-Anzeige, kein Console-Output - `'console'`: jeder Fehler wird zusätzlich mit `console.error` geloggt

#### Default

```ts
'none'
```

***

### max

> **max**: `number`

Defined in: [src/components.d.ts:108](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L108)

Maximale Anzahl gleichzeitig sichtbarer Toasts. Ältere werden bei Überschreitung am oberen Ende des Stapels entfernt.

#### Default

```ts
3
```

***

### position

> **position**: `ToastPosition`

Defined in: [src/components.d.ts:113](https://github.com/pt9912/v-map/blob/79e577486d868612ec23e0a84b4ac7abb3ad39fd/src/components.d.ts#L113)

Position des Toast-Stapels innerhalb des `<v-map>`-Containers.

#### Default

```ts
'top-right'
```
