[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [Components](../index.md) / VMapLayerWfs

# Interface: VMapLayerWfs

Defined in: [src/components.d.ts:665](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L665)

## Properties

### getError()

> **getError**: () => `Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

Defined in: [src/components.d.ts:669](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L669)

Returns the last error detail, if any.

#### Returns

`Promise`\<[`VMapErrorDetail`](../../../../utils/events/interfaces/VMapErrorDetail.md)\>

***

### isReady()

> **isReady**: () => `Promise`\<`boolean`\>

Defined in: [src/components.d.ts:673](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L673)

Gibt `true` zurück, sobald der Layer initialisiert wurde.

#### Returns

`Promise`\<`boolean`\>

***

### loadState

> **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:678](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L678)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity

> **opacity**: `number`

Defined in: [src/components.d.ts:683](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L683)

Opazität (0–1).

#### Default

```ts
1
```

***

### outputFormat

> **outputFormat**: `string`

Defined in: [src/components.d.ts:688](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L688)

Ausgabeformat, z. B. application/json.

#### Default

```ts
'application/json'
```

***

### params?

> `optional` **params**: `string`

Defined in: [src/components.d.ts:692](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L692)

Zusätzliche Parameter als JSON-String.

***

### srsName

> **srsName**: `string`

Defined in: [src/components.d.ts:697](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L697)

Ziel-Referenzsystem, Standard EPSG:3857.

#### Default

```ts
'EPSG:3857'
```

***

### typeName

> **typeName**: `string`

Defined in: [src/components.d.ts:701](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L701)

Feature-Typ (typeName) des WFS.

***

### url

> **url**: `string`

Defined in: [src/components.d.ts:705](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L705)

WFS Endpunkt (z. B. https://server/wfs).

***

### version

> **version**: `string`

Defined in: [src/components.d.ts:710](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L710)

WFS Version, Standard 1.1.0.

#### Default

```ts
'1.1.0'
```

***

### visible

> **visible**: `boolean`

Defined in: [src/components.d.ts:715](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L715)

Sichtbarkeit des Layers.

#### Default

```ts
true
```

***

### zIndex

> **zIndex**: `number`

Defined in: [src/components.d.ts:720](https://github.com/pt9912/v-map/blob/108573a318331113571d4e8a895cc80082774fc3/src/components.d.ts#L720)

Z-Index für Rendering.

#### Default

```ts
1000
```
