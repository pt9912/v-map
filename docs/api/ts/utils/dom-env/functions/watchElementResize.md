[**@npm9912/v-map**](../../../index.md)

***

[@npm9912/v-map](../../../index.md) / [utils/dom-env](../index.md) / watchElementResize

# Function: watchElementResize()

> **watchElementResize**(`target`, `cb`, `mutationObserverInit?`): [`Unsubscribe`](../type-aliases/Unsubscribe.md)

Defined in: [src/utils/dom-env.ts:17](https://github.com/pt9912/v-map/blob/b03f85cbf0919db6d229233abae132d837a588fd/src/utils/dom-env.ts#L17)

Beobachtet Größenänderungen des Targets. Nutzt ResizeObserver wenn vorhanden, sonst Fallback.

## Parameters

### target

`HTMLElement`

### cb

() => `void`

### mutationObserverInit?

`MutationObserverInit`

## Returns

[`Unsubscribe`](../type-aliases/Unsubscribe.md)
