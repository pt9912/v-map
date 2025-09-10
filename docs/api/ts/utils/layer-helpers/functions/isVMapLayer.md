[**@pt9912/v-map**](../../../README.md)

***

[@pt9912/v-map](../../../README.md) / [utils/layer-helpers](../README.md) / isVMapLayer

# Function: isVMapLayer()

> **isVMapLayer**(`el`): `el is VMapLayer`

Defined in: [src/utils/layer-helpers.ts:40](https://github.com/pt9912/v-map/blob/9a5ebadcc954f2978c9c8c106dd32d9b39822791/src/utils/layer-helpers.ts#L40)

Prüft, ob ein HTMLElement das VMapLayer‑Interface implementiert.

Wir testen nur die minimalen, unveränderlichen Eigenschaften:
  - visible (boolean)
  - refresh (Funktion, die ein Promise zurückgibt)

Wenn du weitere optionale Felder prüfen willst, ergänze sie hier.

## Parameters

### el

`unknown`

## Returns

`el is VMapLayer`
