[**@pt9912/v-map**](../../../README.md)

***

[@pt9912/v-map](../../../README.md) / [utils/dom-env](../README.md) / watchElementResize

# Function: watchElementResize()

> **watchElementResize**(`target`, `cb`, `mutationObserverInit?`): [`Unsubscribe`](../type-aliases/Unsubscribe.md)

Defined in: [src/utils/dom-env.ts:17](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/utils/dom-env.ts#L17)

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
