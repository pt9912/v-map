[**@npm9912/v-map**](../../../../README.md)

***

[@npm9912/v-map](../../../../README.md) / [index](../../../README.md) / [JSX](../README.md) / OneOf

# Type Alias: OneOf\<K, PropT, AttrT\>

> **OneOf**\<`K`, `PropT`, `AttrT`\> = `{ [P in K]: PropT }` & \{ \[P in \`attr:$\{K\}\` \| \`prop:$\{K\}\`\]?: never \} \| `` { [P in `attr:${K}`]: AttrT } `` & \{ \[P in K \| \`prop:$\{K\}\`\]?: never \} \| `` { [P in `prop:${K}`]: PropT } `` & \{ \[P in K \| \`attr:$\{K\}\`\]?: never \}

Defined in: [src/components.d.ts:1145](https://github.com/pt9912/v-map/blob/e2b853347ead69afd667cd745419d9a650534b71/src/components.d.ts#L1145)

## Type Parameters

### K

`K` *extends* `string`

### PropT

`PropT`

### AttrT

`AttrT` = `PropT`
