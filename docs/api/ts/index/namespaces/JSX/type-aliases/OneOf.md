[**@npm9912/v-map**](../../../../index.md)

***

[@npm9912/v-map](../../../../index.md) / [index](../../../index.md) / [JSX](../index.md) / OneOf

# Type Alias: OneOf\<K, PropT, AttrT\>

> **OneOf**\<`K`, `PropT`, `AttrT`\> = `{ [P in K]: PropT }` & \{ \[P in \`attr:$\{K\}\` \| \`prop:$\{K\}\`\]?: never \} \| `` { [P in `attr:${K}`]: AttrT } `` & \{ \[P in K \| \`prop:$\{K\}\`\]?: never \} \| `` { [P in `prop:${K}`]: PropT } `` & \{ \[P in K \| \`attr:$\{K\}\`\]?: never \}

Defined in: [src/components.d.ts:1268](https://github.com/pt9912/v-map/blob/a6e98c7ad63232ff92ebecfa8a77a5e89f71786e/src/components.d.ts#L1268)

## Type Parameters

### K

`K` *extends* `string`

### PropT

`PropT`

### AttrT

`AttrT` = `PropT`
