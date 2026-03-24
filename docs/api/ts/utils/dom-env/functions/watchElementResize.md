[**@npm9912/v-map**](../../../README.md)

***

[@npm9912/v-map](../../../README.md) / [utils/dom-env](../README.md) / watchElementResize

# Function: watchElementResize()

> **watchElementResize**(`target`, `cb`, `mutationObserverInit?`): [`Unsubscribe`](../type-aliases/Unsubscribe.md)

Defined in: [src/utils/dom-env.ts:17](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/utils/dom-env.ts#L17)

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
