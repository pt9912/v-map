# v-map-builder

[← Zur Übersicht](./README.md) · [**@pt9912/v-map**](../../README.md)

A component that builds map configurations dynamically from JSON/YAML configuration scripts.

### Props

| Name | Type | Attr | Default | Beschreibung |
| --- | --- | --- | --- | --- |
| `mapconfig` | `unknown` |  |  | Configuration object for the map builder. Can be any structure that will be normalized to BuilderConfig. |

### Events

| Event | Detail-Type | Beschreibung |
| --- | --- | --- |
| `configError` | `{ message: string; errors?: string[]; }` | Event emitted when there is an error parsing the map configuration. |
| `configReady` | `BuilderConfig` | Event emitted when the map configuration has been successfully parsed and is ready to use. |

### CSS Parts

| Part | Beschreibung |
| --- | --- |
| `mount` | The container element where the generated map and layers are mounted. |

