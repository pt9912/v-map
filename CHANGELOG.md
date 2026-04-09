## [0.4.1](https://github.com/pt9912/v-map/compare/v0.4.0...v0.4.1) (2026-04-09)


### Bug Fixes

* **examples:** bump jsDelivr v-map pin from 0.3.0 to 0.4.0 ([c6debe1](https://github.com/pt9912/v-map/commit/c6debe174500768ab3556e69c0386b1d88cc35df))
* **v-map:** make zoom/center prop changes actually reach the provider ([6d2a8cf](https://github.com/pt9912/v-map/commit/6d2a8cfc39bac2ef2de42e5ed31a7b0ca4911f66))


### Features

* **examples:** add Astro framework guide ([83ec2cc](https://github.com/pt9912/v-map/commit/83ec2cc20030b5123f249083a497d8edef230cc1))
* **examples:** add Lit framework guide ([e17f093](https://github.com/pt9912/v-map/commit/e17f093c01a1ddfb6bd37623534facc0331d5968))
* **examples:** add Nuxt 4 framework guide ([28d5465](https://github.com/pt9912/v-map/commit/28d546587514ea18d2492d843859ee90d0b10ed3))

# [0.4.0](https://github.com/pt9912/v-map/compare/v0.3.0...v0.4.0) (2026-04-09)


### Bug Fixes

* **examples:** drop unnecessary String(zoom) cast and untrack .next/ ([4c9f7c5](https://github.com/pt9912/v-map/commit/4c9f7c58e2dde99550ee7fa153a228ba8a8d4956))


### Features

* **examples:** add Angular framework guide ([b5a4970](https://github.com/pt9912/v-map/commit/b5a4970fad75b3f0cf167c3bf92783fdef91189e))
* **examples:** add Next.js framework guide ([7f7b05d](https://github.com/pt9912/v-map/commit/7f7b05dccd06a39a00d2d086d283a31da006100d))
* **examples:** add React framework guide + fix Stencil chunk 404 in iframe demos ([0dddeab](https://github.com/pt9912/v-map/commit/0dddeab8b8a2c1d1a0ab246a50714791e5c252c0))
* **examples:** add Vue 3 framework guide ([6e9a9b9](https://github.com/pt9912/v-map/commit/6e9a9b9e188a3f8ef154d3d9c99a57f47d88d6e1))
* **v-map:** propagate zoom and center prop changes to provider via @Watch ([75acad6](https://github.com/pt9912/v-map/commit/75acad6755c3042fd16e8e3602392566c79ff397))

# [0.3.0](https://github.com/pt9912/v-map/compare/v0.2.4...v0.3.0) (2026-04-08)


### Features

* **docs:** embed sveltekit example as live iframe via @[example:name] ([d966057](https://github.com/pt9912/v-map/commit/d9660577924d837f865260b61db0c75926d460ab))

## [0.2.4](https://github.com/pt9912/v-map/compare/v0.2.3...v0.2.4) (2026-04-08)


### Bug Fixes

* **test:** stabilize openlayers-provider-wfs-wcs spec via vi.hoisted ([69ab155](https://github.com/pt9912/v-map/commit/69ab155887bd66a1bbaf550e5ec939e9f1a4a835))


### Features

* **examples:** bulk up sveltekit demo into a reactive showcase ([dff23e8](https://github.com/pt9912/v-map/commit/dff23e8b8ac22af29791168b3f80ad75b4ad7644))

## [0.2.3](https://github.com/pt9912/v-map/compare/v0.2.2...v0.2.3) (2026-04-08)


### Bug Fixes

* **docs:** emit @[...] markers as block tokens to avoid nested <p> ([f2c4d30](https://github.com/pt9912/v-map/commit/f2c4d3050e1a8c1a25dadeb9503e355fdcd2837e))

## [0.2.2](https://github.com/pt9912/v-map/compare/v0.2.1...v0.2.2) (2026-04-08)


### Bug Fixes

* **docs:** load v-map.esm.js from jsDelivr instead of bundling the loader ([0ac9483](https://github.com/pt9912/v-map/commit/0ac9483e9d207477536ed83a244535e8747e7134))

## [0.2.1](https://github.com/pt9912/v-map/compare/v0.2.0...v0.2.1) (2026-04-08)


### Bug Fixes

* **docs:** live home demo via Vue SFC + tiny markdown shortcut ([108573a](https://github.com/pt9912/v-map/commit/108573a318331113571d4e8a895cc80082774fc3))

# [0.2.0](https://github.com/pt9912/v-map/compare/v0.1.1...v0.2.0) (2026-04-08)


### Features

* **v-map-error:** add declarative error toast component ([bedf2f0](https://github.com/pt9912/v-map/commit/bedf2f0af8a9c4f838e8f9aae000f2e423ca2bfc))

## [0.1.1](https://github.com/pt9912/v-map/compare/v0.1.0...v0.1.1) (2026-04-07)


### Bug Fixes

* **npm:** remove invalid top-level "branches" field from package.json ([1dd3689](https://github.com/pt9912/v-map/commit/1dd3689d57b4c4a1337b94327fbd8948b9e6e741))

# [0.1.0](https://github.com/pt9912/v-map/compare/v0.0.0...v0.1.0) (2026-04-07)


### Bug Fixes

* add @npm9912/s-gml mock to resolve ES module parsing error ([d204a4f](https://github.com/pt9912/v-map/commit/d204a4f00e682cae6327f26c93fbc7f90927ff86))
* add all missing external dependencies from dist/esm analysis ([9920ae6](https://github.com/pt9912/v-map/commit/9920ae65d0c2e049d2ee213864a6ea86ae91c7e3))
* add missing [@loaders](https://github.com/loaders).gl and [@deck](https://github.com/deck).gl packages to devDependencies ([ad325e3](https://github.com/pt9912/v-map/commit/ad325e3b370b4b5b20aa6c8981573ead9c0364c4))
* add mutex for thread-safe Cesium loading ([461d51a](https://github.com/pt9912/v-map/commit/461d51a6ad14809935624f50ab45f6a4eceedfff))
* add tiff-imagery-provider to devDependencies ([a1a7c0e](https://github.com/pt9912/v-map/commit/a1a7c0e95a321a92fac7d892b3119601020cf43e))
* build scripts ([f5464af](https://github.com/pt9912/v-map/commit/f5464afb0e541c4eca71b5300cbd91c447dd4fc6))
* **builder:** honor autoApply and empty targets ([4087b31](https://github.com/pt9912/v-map/commit/4087b317c8feeca5c180e332a36e09ac7280f316))
* **builder:** replace :scope selector and update tests for light DOM rendering ([e2ddf3c](https://github.com/pt9912/v-map/commit/e2ddf3c6d14a02d853d21f0c0486013b726a3097))
* **builder:** set autoApply property for styles ([11744db](https://github.com/pt9912/v-map/commit/11744db29be2961aa24917a4dca680b91c5270b9))
* **builder:** use light DOM selector in e2e test for v-map lookup ([cb2b209](https://github.com/pt9912/v-map/commit/cb2b209bca3fefef1c1405d8da2eeffc36f9b761))
* **build:** stabilize leaflet resolution across toolchains ([d0c8e80](https://github.com/pt9912/v-map/commit/d0c8e8019688ebee7234b30924011b876b3d46fb))
* **cesium:** use EPSG:3857 for GeoTIFF tile processor ([f114a7c](https://github.com/pt9912/v-map/commit/f114a7c66fad049ed7e525d1189b60b95baba8e8))
* **ci:** fix browser test inactivity watchdog never triggering ([18d5b79](https://github.com/pt9912/v-map/commit/18d5b79c2a99722cb0fba2afb4171b61f9fdcbdc))
* **ci:** resolve strict TypeScript errors on CI ([156b796](https://github.com/pt9912/v-map/commit/156b796a19678c596b2658359f74be27f6855ad3))
* **ci:** retry stalled vitest browser startup ([e35fd62](https://github.com/pt9912/v-map/commit/e35fd62a50ae014077747fc5d22078b95c61e4c3))
* correct Cesium GeoStyler test mocks and timeouts ([42cea7b](https://github.com/pt9912/v-map/commit/42cea7ba1cd311872be751b400d6b61bbd404ef0))
* correct Leaflet GeoStyler test mocks ([f359558](https://github.com/pt9912/v-map/commit/f35955842558021c12a76e83ffda8250facd6d71))
* **deck:** add missing geotiff case in updateLayer ([1973ee2](https://github.com/pt9912/v-map/commit/1973ee21d53c782d6f32cdb26a41363333d74d58))
* **deck:** preserve geotiff state across layer clones ([6928f06](https://github.com/pt9912/v-map/commit/6928f065db84fc096c04978427fde8d910f5ea30))
* **deck:** resolve SimpleMeshLayer texture crash and GeoTIFF request flood ([fb3a716](https://github.com/pt9912/v-map/commit/fb3a716aca469ab525ba675c6b56705681dd7830))
* **demo:** harden terrain-geotiff demo page ([c6a8403](https://github.com/pt9912/v-map/commit/c6a840393106e3b5e41303259dff7f1d0638a78a))
* **demo:** repair local demo serving and controls ([0066780](https://github.com/pt9912/v-map/commit/006678043e445e7424d4afe9902a80ad7a65b4fe))
* **demo:** replace broken GeoTIFF URLs with working CORS-enabled alternatives ([69cdb58](https://github.com/pt9912/v-map/commit/69cdb585c384fe5889d112067bde02e97d1f043f))
* devcontainer ([dc2f3c1](https://github.com/pt9912/v-map/commit/dc2f3c19a7271226efcaceb54347a916580a0674))
* **geotiff:** add retry mechanism for readRasters ([895d352](https://github.com/pt9912/v-map/commit/895d3528f85a7a00c8a3d905c9c8cc62e1e236e2))
* **geotiff:** align projection handling across providers ([1f60f51](https://github.com/pt9912/v-map/commit/1f60f51f6686b4ee81341d5068d1570ea7f63b46))
* **geotiff:** optimize tile loading with extent restrictions ([fc8df37](https://github.com/pt9912/v-map/commit/fc8df37978e2b7a27dfa37d5760ac799515a8780)), closes [#2434](https://github.com/pt9912/v-map/issues/2434)
* **geotiff:** sanitize terrain nodata and clear stale deck state ([d081c4e](https://github.com/pt9912/v-map/commit/d081c4ed622c49f818bef71b609294ea4b38b62a))
* guard map lifecycle during provider teardown ([2b7947b](https://github.com/pt9912/v-map/commit/2b7947b8f01087ef20aa2029eabd615602980c07))
* harden component lifecycle against missing parents and providers ([dda8ebf](https://github.com/pt9912/v-map/commit/dda8ebfd68bc3be94d579cb6e69e301715617f00))
* **layercontrol:** remove unnecessary JSX Fragment wrapper ([d3764e3](https://github.com/pt9912/v-map/commit/d3764e30403e7525a30f4bf50b01c8181c299eca))
* **leaflet:** add null check for layer in updateGeoTIFFLayer ([1347894](https://github.com/pt9912/v-map/commit/13478946f416502a18fcbf0b816f1130a71eb049))
* **leaflet:** add type definitions and preserve null layer ids ([517ef64](https://github.com/pt9912/v-map/commit/517ef6453fd981c558ab6faa7963935c82d7d4e2))
* move z-index input min attribute ([e78ea9e](https://github.com/pt9912/v-map/commit/e78ea9eacd6638018c6571ad27658d95db5ba3ef))
* **ol:** replace alert() with CustomEvent in Google source error handler ([4fd34e0](https://github.com/pt9912/v-map/commit/4fd34e0acf2b598607dce358c3c5091b987113a3))
* **ol:** update wcs source handling ([1ce1419](https://github.com/pt9912/v-map/commit/1ce14191249825d0bb62b52654bd1cde2162b581))
* resolve build errors in GeoStyler test files ([1985e02](https://github.com/pt9912/v-map/commit/1985e02f663b63514f56f220af6d28e9c2cccb15))
* resolve Jest ES module parsing errors and fix all failing spec tests ([7e53fae](https://github.com/pt9912/v-map/commit/7e53fae3cc78054df627a33ea38ea425078e9f6c))
* resolve TypeScript errors in terrain and deck layers ([9ce0fba](https://github.com/pt9912/v-map/commit/9ce0fbadb1fc95f3e40772811fcf64af2c8abab7))
* src ([78e1095](https://github.com/pt9912/v-map/commit/78e10956058f9a33db64d3190faef1a78143a33d))
* **storybook:** configure Vite to resolve [@loaders](https://github.com/loaders).gl dependencies ([073b11e](https://github.com/pt9912/v-map/commit/073b11e2401f87b9e0f864642e0cf35c7fbe8b27))
* **terrain-geotiff:** expose and update render mode ([0d6b340](https://github.com/pt9912/v-map/commit/0d6b340c040f37c40ff207956433d10d887d555e))
* **terrain:** add working elevation URLs to terrain layer stories ([00f9d4c](https://github.com/pt9912/v-map/commit/00f9d4c8734dd1daa1ed976db44009ac9ba614fd))
* test workfow ([8d0a02e](https://github.com/pt9912/v-map/commit/8d0a02eefdeedc8bacf3be77ea4785e40d6025a0))
* **test:** adapt utility tests for vitest 4 constructor mock changes ([eaf0388](https://github.com/pt9912/v-map/commit/eaf03888bf35c522472b636e4206b28a6da024b0))
* **test:** add set() to ImageLayer mock for WCS test ([de8de47](https://github.com/pt9912/v-map/commit/de8de471838d2b7678a759171880f6e367d2df32))
* v-map test ([f48f7cb](https://github.com/pt9912/v-map/commit/f48f7cb4fea6def75fd0b57741d6cc428077a986))
* **vite:** add [@loaders](https://github.com/loaders).gl dependencies to optimizeDeps ([a28eef9](https://github.com/pt9912/v-map/commit/a28eef9dc3cdb5daa259a9fec4360755c90f90fc))
* workflow test ([bea65c6](https://github.com/pt9912/v-map/commit/bea65c6d2848bf21bb415bc9b7615d35b13f035e))
* workflows ([94252f9](https://github.com/pt9912/v-map/commit/94252f9b767bf954c3a449e7194a475b9c792d12))
* workflows ([f2c7ad0](https://github.com/pt9912/v-map/commit/f2c7ad0c3c7ef6932d8b5db69912acca7c407c47))
* workflows test ([b6258bf](https://github.com/pt9912/v-map/commit/b6258bf3c108db95b719b7ada6c8ba3ecbf80b65))
* worlflows ([5649d72](https://github.com/pt9912/v-map/commit/5649d72d259eb5014b353a2b99b18e8f3d328a04))


### Features

* add cesium xyz layer support ([31b41b1](https://github.com/pt9912/v-map/commit/31b41b18ac6b57e612200cec79597eaf539a6c03))
* add DEFAULT_STYLE configuration ([ccb2932](https://github.com/pt9912/v-map/commit/ccb2932850c55dd1db1698237aa101eb0fc152fe))
* add GeoStyler support to all map providers ([19efec6](https://github.com/pt9912/v-map/commit/19efec66dafce4e52ed7c680f98e4d28e2fd037d))
* add GeoStyler support to WFS layer component ([1d12ee3](https://github.com/pt9912/v-map/commit/1d12ee3af039fa772d83bf4da660d0982110cffd))
* add geostylerStyle and style properties to WFS LayerConfig ([d5d2739](https://github.com/pt9912/v-map/commit/d5d2739a1111a744ab544e23be9a1e891c6b4094))
* add GML parsing support to Cesium WFS implementation ([0274ccd](https://github.com/pt9912/v-map/commit/0274ccdbcbd1caf37ecb2dec586a23aefd6b2f03))
* add Mapbox GL Style support to v-map-style component ([6c8987e](https://github.com/pt9912/v-map/commit/6c8987e97b59eba7e03a4ca020ba537711c93c1e))
* add QGIS and LYRX (ArcGIS Pro) style support ([d7fb41a](https://github.com/pt9912/v-map/commit/d7fb41a69185cccbd54b52e7648ba57f4a6edb0f))
* add setIgnoreError to E2E testing utilities ([2a6d88c](https://github.com/pt9912/v-map/commit/2a6d88c80ad9bc83280087011ee4f7610083c251))
* add Storybook stories for missing layer components ([3a01f1c](https://github.com/pt9912/v-map/commit/3a01f1cceca1cd33e67bfcdce47f796c1f138176))
* add terrain layer component and provider support ([ac368ea](https://github.com/pt9912/v-map/commit/ac368ead6d5e8e13bca5125c7afc82c58e4ff77c))
* add v-map-style component for declarative styling ([970f4b3](https://github.com/pt9912/v-map/commit/970f4b35604f3398ba7c24427ee73ffa9753d94a))
* add WFS support to Cesium provider ([20221a4](https://github.com/pt9912/v-map/commit/20221a4753f9d47a5396efe397083e6326812d8d))
* add WFS support to Leaflet provider ([dbb553c](https://github.com/pt9912/v-map/commit/dbb553c7fce67af0fbff0a7353dc36c5af253e27))
* add wfs/wcs layers for openlayers provider ([eb95551](https://github.com/pt9912/v-map/commit/eb95551765e4e6303d5d02d87e4ce3b0d5741251))
* apply existing styles to late-mounted layers ([dc11bbe](https://github.com/pt9912/v-map/commit/dc11bbe80f9910b9501652c936ba377a6a601edf))
* **builder:** render configured map styles ([71294af](https://github.com/pt9912/v-map/commit/71294afc6e8c2c4f422f916b71885f4f29963970))
* **builder:** render v-map in light DOM and support id/basemapid config ([91b74f7](https://github.com/pt9912/v-map/commit/91b74f7ed202f0a20e21b1552412d5638d68a6c0))
* **cesium:** add terrain-geotiff support for GeoTIFF elevation data ([a0b7ed7](https://github.com/pt9912/v-map/commit/a0b7ed7232508c59f39e36e564e7b87147889359))
* **cesium:** add WCS (Web Coverage Service) support for Cesium ([0389466](https://github.com/pt9912/v-map/commit/03894669c71ecfe4c835f7e2d5b23a755c975811))
* **components:** add v-map-layer-terrain-geotiff web component ([6764be8](https://github.com/pt9912/v-map/commit/6764be8eb98286b988f8546ecdf071d9fa8cc754))
* **deck:** add DeckGLGeoTIFFTerrainLayer for 3D terrain from GeoTIFF ([2c1e995](https://github.com/pt9912/v-map/commit/2c1e9958f1c2632a6e4b924599d4100001acfe66))
* **deck:** add WCS (Web Coverage Service) support for deck.gl ([1175289](https://github.com/pt9912/v-map/commit/1175289add5c3e3c3e3db864e7d963d76fef85d6))
* **deck:** integrate terrain-geotiff layer in deck-provider ([0c569dc](https://github.com/pt9912/v-map/commit/0c569dce59289a9c8ababf4c9befcc4cb8f4f5cb))
* **deck:** render geotiff via cog layer ([3e87427](https://github.com/pt9912/v-map/commit/3e87427c18465756fd3627c3a70ff99397d74e19))
* **demo-app:** add demo application ([1e8f557](https://github.com/pt9912/v-map/commit/1e8f55783756eb44d38ad504685b0d7dd6bf4a21))
* **demo:** add MiniScale UK as third GeoTIFF example ([298e265](https://github.com/pt9912/v-map/commit/298e2659e84f88ab65ba19432bf8622ca104d361))
* **demo:** add pure HTML demo pages for v-map integration ([85b31c3](https://github.com/pt9912/v-map/commit/85b31c3648e57eccaab8489b9b62f2e04effaa0b))
* **demo:** add SvelteKit demo app ([43cc82e](https://github.com/pt9912/v-map/commit/43cc82e4374fb22e77401fb4d89196406388ecdf))
* **demo:** add v-map-layer-geotiff support to demo app ([2f2b9f6](https://github.com/pt9912/v-map/commit/2f2b9f6590f02fe26eb9cfedc2b901327998fe21))
* enhance WFS/WCS/WMS stories with real endpoints and multi-provider support ([2ba915d](https://github.com/pt9912/v-map/commit/2ba915de859daea62d3349bc535b2a71866c4930))
* **error-api:** add unified vmap-error event to v-map-style and v-map-builder ([836601c](https://github.com/pt9912/v-map/commit/836601c5f67d646069ee9057fef3ecbe5239761e))
* **error-api:** add VMapErrorDetail type and refactor VMapLayerHelper ([ace7a09](https://github.com/pt9912/v-map/commit/ace7a0942c242728de0a3416a710d1a7a95ca158))
* **error-api:** implement Error-API in Group A layer components ([8772f25](https://github.com/pt9912/v-map/commit/8772f25d01b755b58f106253b0c5884a2485da63))
* **error-api:** migrate Group B components to VMapLayerHelper ([d342445](https://github.com/pt9912/v-map/commit/d342445d64b7d0d5db5034b547ee43bbd00b125d))
* **error-api:** propagate runtime layer errors through vmap-error ([7b33500](https://github.com/pt9912/v-map/commit/7b335001729fb0518de649a730e903a8053b7f9e))
* expand builder layer support ([b00bc42](https://github.com/pt9912/v-map/commit/b00bc42b808c9e6451d377331f3b69df1b6d0518))
* **geotiff:** implement Martini terrain mesh for DeckGLGeoTIFFTerrainLayer ([dc26e72](https://github.com/pt9912/v-map/commit/dc26e7292a0ab29adbeddfe7286dfa4fc7392939))
* integrate DEFAULT_STYLE fallback in all map providers ([f8655ce](https://github.com/pt9912/v-map/commit/f8655ce23a3989f15c97adf4aa7e9f072e9a2a68))
* integrate v-map-style with layer components ([30e5735](https://github.com/pt9912/v-map/commit/30e5735b390219902aba6904fdc3f9ceccb82f9b))
* **leaflet:** add WCS GridLayer with 2.0.1 and 1.x.x support ([f97aceb](https://github.com/pt9912/v-map/commit/f97aceb3493ff38eb0b9473a270a57304c559108))
* **leaflet:** integrate WCS support in leaflet-provider ([5b9dbbc](https://github.com/pt9912/v-map/commit/5b9dbbc9e4cf9ca80a8de132273edaaa420eaf34))
* **ol:** improve WCS support for 2.0.1 with GeoTIFF FLOAT32 ([27f5517](https://github.com/pt9912/v-map/commit/27f5517d8d35f9157c15f0754e8ca2ed2d8dff3f))
* support additional v-map-style formats ([e6a52bf](https://github.com/pt9912/v-map/commit/e6a52bf405741bc10bec3ba4b05a7060bdf1cf5b))
* support arcgis layers in leaflet, ol, and deck ([8f0817a](https://github.com/pt9912/v-map/commit/8f0817afc9b5ea7f80423de35105ce1ef20ead85))
* support cesium 3d tiles styling ([47bc96d](https://github.com/pt9912/v-map/commit/47bc96dbb630838d8cacfa2e04b7f693dba4efe3))
* support GeoStyler styling across map providers ([dafd2e4](https://github.com/pt9912/v-map/commit/dafd2e4b01fb13e2be0cdcdfca2dcbb2b8e02b29))
* **test:** migrate component spec tests from Stencil Jest to @stencil/vitest ([11cfea4](https://github.com/pt9912/v-map/commit/11cfea47226043dae5fd3ceb606c3b43751e2cbe))
* **types:** add terrain-geotiff layer type to LayerConfig ([109cea1](https://github.com/pt9912/v-map/commit/109cea17d018cdbcdc5c335bcfaa1ceda8754431))
* **v-map-style:** add comprehensive Storybook stories ([5f9375c](https://github.com/pt9912/v-map/commit/5f9375cc82eca8ea274ab3125c71686dd424baed))
* **v-map-style:** add format="geostyler" for direct GeoStyler JSON input ([e80094b](https://github.com/pt9912/v-map/commit/e80094b62a643da41e59a1635442a621fef9a210))
* **v-map:** add map-mousemove event with geo-coordinates ([ce465db](https://github.com/pt9912/v-map/commit/ce465db1b74e3300e3d57de951f182ee3f6678fe))


### Performance Improvements

* **test:** build once before e2e batches with --no-build flag ([de6777a](https://github.com/pt9912/v-map/commit/de6777a24b69a4c34cdd06a8023a7cdaa5675360))
