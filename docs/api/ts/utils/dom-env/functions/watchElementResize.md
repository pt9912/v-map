[**@pt9912/v-map**](../../../README.md)

***

[@pt9912/v-map](../../../README.md) / [utils/dom-env](../README.md) / watchElementResize

# Function: watchElementResize()

> **watchElementResize**(`target`, `cb`, `mutationObserverInit?`): [`Unsubscribe`](../type-aliases/Unsubscribe.md)

Defined in: [src/utils/dom-env.ts:17](https://github.com/pt9912/v-map/blob/20407f373f7ebc2682ca79717d899afeb8b11ae8/src/utils/dom-env.ts#L17)

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
