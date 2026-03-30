# v-map-layergroup

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)



### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `basemapid` | `string` | `basemapid` | `null` | Base map identifier for this layer group. When set, layers in this group will be treated as base map layers. |
| `opacity` | `number` | `opacity` | `1.0` | Globale Opazität (0–1) für alle Kinder. |
| `visible` | `boolean` | `visible` | `true` | Sichtbarkeit der gesamten Gruppe. |

### Methods

- `getGroupId() => Promise<string>` — Returns the internal group identifier used by the map provider.

