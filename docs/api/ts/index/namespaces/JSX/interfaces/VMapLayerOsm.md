[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / VMapLayerOsm

# Interface: VMapLayerOsm

Defined in: [src/components.d.ts:1629](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L1629)

## Properties

### loadState?

> `optional` **loadState**: `"ready"` \| `"error"` \| `"idle"` \| `"loading"`

Defined in: [src/components.d.ts:1634](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L1634)

Current load state of the layer.

#### Default

```ts
'idle'
```

***

### opacity?

> `optional` **opacity**: `number`

Defined in: [src/components.d.ts:1644](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L1644)

Opazität der OSM-Kacheln (0–1).

#### Default

```ts
1
```

***

### url?

> `optional` **url**: `string`

Defined in: [src/components.d.ts:1649](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L1649)

Base URL for OpenStreetMap tile server. Defaults to the standard OSM tile server.

#### Default

```ts
'https://tile.openstreetmap.org'
```

***

### visible?

> `optional` **visible**: `boolean`

Defined in: [src/components.d.ts:1654](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L1654)

Sichtbarkeit des Layers

#### Default

```ts
true
```

***

### zIndex?

> `optional` **zIndex**: `number`

Defined in: [src/components.d.ts:1659](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L1659)

Z-index for layer stacking order. Higher values render on top.

#### Default

```ts
10
```

## Events

### onReady()?

> `optional` **onReady**: (`event`) => `void`

Defined in: [src/components.d.ts:1639](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/components.d.ts#L1639)

Wird ausgelöst, wenn der OSM-Layer bereit ist.
 ready

#### Parameters

##### event

[`VMapLayerOsmCustomEvent`](../../../interfaces/VMapLayerOsmCustomEvent.md)\<`void`\>

#### Returns

`void`
