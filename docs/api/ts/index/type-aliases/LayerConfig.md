[**@pt9912/v-map**](../../README.md)

***

[@pt9912/v-map](../../README.md) / [index](../README.md) / LayerConfig

# Type Alias: LayerConfig

> **LayerConfig** = \{ `groupId?`: `string`; `style?`: [`StyleConfig`](../interfaces/StyleConfig.md); `type`: `"geojson"`; `url`: `string`; \} \| \{ `groupId?`: `string`; `type`: `"osm"`; `url?`: `string`; \} \| \{ `attributions?`: `string` \| `string`[]; `groupId?`: `string`; `maxZoom?`: `number`; `options?`: `Record`\<`string`, `unknown`\>; `type`: `"xyz"`; `url`: `string`; \} \| \{ `groupId?`: `string`; `type`: `"arcgis"`; `url`: `string`; \} \| \{ `apiKey`: `string`; `groupId?`: `string`; `highDpi?`: `boolean`; `language?`: `string`; `libraries?`: `string`[]; `mapType?`: `"roadmap"` \| `"satellite"` \| `"terrain"` \| `"hybrid"`; `maxZoom?`: `number`; `region?`: `string`; `scale?`: `"scaleFactor1x"` \| `"scaleFactor2x"`; `styles?`: `string`; `type`: `"google"`; \} \| \{ `groupId?`: `string`; `layers`: `string`; `params?`: `Record`\<`string`, `string`\>; `type`: `"wms"`; `url`: `string`; \} \| \{ `data?`: `any`; `getFillColor?`: `Color`; `getRadius?`: `number`; `getTooltip?`: (`info`) => `any`; `groupId?`: `string`; `id?`: `string`; `onClick?`: (`info`) => `void`; `onHover?`: (`info`) => `void`; `opacity?`: `number`; `type`: `"scatterplot"`; `visible?`: `boolean`; \} \| \{ `color?`: \[`number`, `number`, `number`\]; `elevationData`: `string`; `elevationDecoder?`: \{ `b`: `number`; `g`: `number`; `offset`: `number`; `r`: `number`; \}; `groupId?`: `string`; `maxZoom?`: `number`; `meshMaxError?`: `number`; `minZoom?`: `number`; `texture?`: `string`; `type`: `"terrain"`; `wireframe?`: `boolean`; \}

Defined in: [src/components/v-map/map-provider/map-provider.ts:45](https://github.com/pt9912/v-map/blob/bea65c6d2848bf21bb415bc9b7615d35b13f035e/src/components/v-map/map-provider/map-provider.ts#L45)
