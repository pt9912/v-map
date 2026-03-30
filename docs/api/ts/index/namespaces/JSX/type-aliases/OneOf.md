[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / OneOf

# Type Alias: OneOf\<K, PropT, AttrT\>

> **OneOf**\<`K`, `PropT`, `AttrT`\> = `{ [P in K]: PropT }` & \{ \[P in \`attr:$\{K\}\` \| \`prop:$\{K\}\`\]?: never \} \| `` { [P in `attr:${K}`]: AttrT } `` & \{ \[P in K \| \`prop:$\{K\}\`\]?: never \} \| `` { [P in `prop:${K}`]: PropT } `` & \{ \[P in K \| \`attr:$\{K\}\`\]?: never \}

Defined in: [src/components.d.ts:1268](https://github.com/pt9912/v-map/blob/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc/src/components.d.ts#L1268)

## Type Parameters

### K

`K` *extends* `string`

### PropT

`PropT`

### AttrT

`AttrT` = `PropT`
