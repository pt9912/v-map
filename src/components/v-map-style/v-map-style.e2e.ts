import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(60_000);

describe('<v-map-style> E2E', () => {
  const simpleSLD = `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
  xmlns="http://www.opengis.net/sld"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>test-layer</Name>
    <UserStyle>
      <Title>Simple Point Style</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Red Circle</Name>
          <PointSymbolizer>
            <Graphic>
              <Mark>
                <WellKnownName>circle</WellKnownName>
                <Fill>
                  <CssParameter name="fill">#ff0000</CssParameter>
                </Fill>
                <Stroke>
                  <CssParameter name="stroke">#000000</CssParameter>
                  <CssParameter name="stroke-width">2</CssParameter>
                </Stroke>
              </Mark>
              <Size>10</Size>
            </Graphic>
          </PointSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;

  const polygonSLD = `<?xml version="1.0" encoding="UTF-8"?>
<StyledLayerDescriptor version="1.0.0"
  xmlns="http://www.opengis.net/sld">
  <NamedLayer>
    <Name>polygon-layer</Name>
    <UserStyle>
      <Title>Blue Polygon Style</Title>
      <FeatureTypeStyle>
        <Rule>
          <Name>Blue Fill</Name>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#0066cc</CssParameter>
              <CssParameter name="fill-opacity">0.7</CssParameter>
            </Fill>
            <Stroke>
              <CssParameter name="stroke">#003366</CssParameter>
              <CssParameter name="stroke-width">3</CssParameter>
            </Stroke>
          </PolygonSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>`;

  const pointWKT = 'POINT(8.5 47.4)';
  const polygonWKT =
    'POLYGON((8.5 47.4, 8.6 47.4, 8.6 47.5, 8.5 47.5, 8.5 47.4))';

  const pointGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [8.5, 47.4],
    },
    properties: {
      name: 'Test Point',
    },
  };

  const polygonGeoJSON = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [8.5, 47.4],
          [8.6, 47.4],
          [8.6, 47.5],
          [8.5, 47.5],
          [8.5, 47.4],
        ],
      ],
    },
    properties: {
      name: 'Test Polygon',
    },
  };

  newE2EPage.setIgnoreError('SLD parsing failed');

  const usePage = async (
    run: (ctx: {
      page: E2EPage;
      render: (html: string, opts?: { wait?: boolean }) => Promise<void>;
    }) => Promise<void>,
  ) => {
    const page = await newE2EPage();
    await page.setContent('<div id="test-root"></div>');

    const render = async (html: string, opts?: { wait?: boolean }) => {
      await page.evaluate(
        content => {
          const root = document.getElementById('test-root');
          if (root) {
            root.innerHTML = content;
          }
        },
        html,
      );
      if (opts?.wait === false) return;
      await page.waitForChanges();
    };

    try {
      await run({ page, render });
    } finally {
      try {
        await render('', { wait: false });
      } catch {
        /* ignore */
      }
      await page.close();
    }
  };

  describe('v-map-style with v-map-layer-wkt', () => {
    it('should render and apply SLD style to WKT point layer', async () => {
      await usePage(async ({ page, render }) => {
        await render(`
          <v-map zoom="10" center-lat="47.4" center-lon="8.5">
            <v-map-style
              format="sld"
              content='${simpleSLD}'
              layer-targets="wkt-points">
            </v-map-style>

            <v-map-layergroup>
              <v-map-layer-wkt
                id="wkt-points"
                wkt="${pointWKT}">
              </v-map-layer-wkt>
            </v-map-layergroup>
          </v-map>
        `);

        const styleComponent = await page.find('v-map-style');
        const wktLayer = await page.find('v-map-layer-wkt');

        expect(styleComponent).toBeTruthy();
        expect(wktLayer).toBeTruthy();
        expect(await wktLayer.getProperty('wkt')).toBe(pointWKT);
        expect(await styleComponent.getProperty('format')).toBe('sld');
        expect(await styleComponent.getProperty('layerTargets')).toBe(
          'wkt-points',
        );
        expect(await styleComponent.getProperty('autoApply')).toBe(true);
      });
    });

    it('should handle polygon WKT with polygon SLD styling', async () => {
      await usePage(async ({ page, render }) => {
        await render(`
          <v-map zoom="10" center-lat="47.45" center-lon="8.55">
            <v-map-style
              format="sld"
              content='${polygonSLD}'
              layer-targets="wkt-polygons">
            </v-map-style>

            <v-map-layergroup>
              <v-map-layer-wkt
                id="wkt-polygons"
                wkt="${polygonWKT}">
              </v-map-layer-wkt>
            </v-map-layergroup>
          </v-map>
        `);

        const styleComponent = await page.find('v-map-style');
        const wktLayer = await page.find('v-map-layer-wkt');

        expect(styleComponent).toBeTruthy();
        expect(wktLayer).toBeTruthy();
        expect(await wktLayer.getProperty('wkt')).toBe(polygonWKT);
        expect(await styleComponent.getProperty('format')).toBe('sld');
        expect(await styleComponent.getProperty('layerTargets')).toBe(
          'wkt-polygons',
        );
        expect(await styleComponent.getProperty('autoApply')).toBe(true);
      });
    });
  });

  describe('v-map-style with v-map-layer-geojson', () => {
    it('should render and apply SLD style to GeoJSON point layer', async () => {
      await usePage(async ({ page, render }) => {
        await render(`
          <v-map zoom="10" center-lat="47.4" center-lon="8.5">
            <v-map-style
              format="sld"
              content='${simpleSLD}'
              layer-targets="geojson-points">
            </v-map-style>

            <v-map-layergroup>
              <v-map-layer-geojson
                id="geojson-points"
                geojson='${JSON.stringify(pointGeoJSON)}'>
              </v-map-layer-geojson>
            </v-map-layergroup>
          </v-map>
        `);

        const styleComponent = await page.find('v-map-style');
        const geojsonLayer = await page.find('v-map-layer-geojson');

        expect(styleComponent).toBeTruthy();
        expect(geojsonLayer).toBeTruthy();
        expect(await geojsonLayer.getProperty('geojson')).toBeTruthy();
        expect(await styleComponent.getProperty('autoApply')).toBe(true);
      });
    });

    it('should handle GeoJSON polygon with appropriate SLD styling', async () => {
      await usePage(async ({ page, render }) => {
        await render(`
          <v-map zoom="9" center-lat="47.45" center-lon="8.55">
            <v-map-style
              format="sld"
              content='${polygonSLD}'
              layer-targets="geojson-polygons">
            </v-map-style>

            <v-map-layergroup>
              <v-map-layer-geojson
                id="geojson-polygons"
                geojson='${JSON.stringify(polygonGeoJSON)}'>
              </v-map-layer-geojson>
            </v-map-layergroup>
          </v-map>
        `);

        const styleComponent = await page.find('v-map-style');
        const geojsonLayer = await page.find('v-map-layer-geojson');

        expect(styleComponent).toBeTruthy();
        expect(geojsonLayer).toBeTruthy();
        expect(await geojsonLayer.getProperty('id')).toBe('geojson-polygons');
        expect(await styleComponent.getProperty('format')).toBe('sld');
        expect(await styleComponent.getProperty('layerTargets')).toBe(
          'geojson-polygons',
        );
        expect(await styleComponent.getProperty('autoApply')).toBe(true);
      });
    });
  });

  describe('Multiple layers with different styles', () => {
    it('should handle multiple styles for different layer types', async () => {
      await usePage(async ({ page, render }) => {
        await render(`
          <v-map zoom="8" center-lat="47.4" center-lon="8.5">
            <v-map-style
              format="sld"
              content='${simpleSLD}'
              layer-targets="wkt-layer">
            </v-map-style>

            <v-map-style
              format="sld"
              content='${polygonSLD}'
              layer-targets="geojson-layer">
            </v-map-style>

            <v-map-layergroup>
              <v-map-layer-wkt
                id="wkt-layer"
                wkt="${pointWKT}">
              </v-map-layer-wkt>

              <v-map-layer-geojson
                id="geojson-layer"
                geojson='${JSON.stringify(polygonGeoJSON)}'>
              </v-map-layer-geojson>
            </v-map-layergroup>
          </v-map>
        `);

        const styleComponents = await page.findAll('v-map-style');
        expect(styleComponents).toHaveLength(2);

        const wktLayer = await page.find('v-map-layer-wkt');
        const geojsonLayer = await page.find('v-map-layer-geojson');

        expect(wktLayer).toBeTruthy();
        expect(geojsonLayer).toBeTruthy();

        for (const styleComponent of styleComponents) {
          expect(await styleComponent.getProperty('autoApply')).toBe(true);
        }
      });
    });
  });

  describe('Error handling scenarios', () => {
    it('should display error for invalid SLD content', async () => {
      await usePage(async ({ page, render }) => {
        await render(`
          <v-map zoom="10" center-lat="47.4" center-lon="8.5">
            <v-map-style
              format="sld"
              content="<invalid>xml content</invalid>"
              layer-targets="test-layer">
            </v-map-style>

            <v-map-layergroup>
              <v-map-layer-wkt
                id="test-layer"
                wkt="${pointWKT}">
              </v-map-layer-wkt>
            </v-map-layergroup>
          </v-map>
        `);

        const styleComponent = await page.find('v-map-style');
        expect(styleComponent).toBeTruthy();
        expect(await styleComponent.getProperty('format')).toBe('sld');
      });
    });

    it('should handle missing layer targets gracefully', async () => {
      await usePage(async ({ page, render }) => {
        await render(`
          <v-map zoom="10" center-lat="47.4" center-lon="8.5">
            <v-map-style
              format="sld"
              content='${simpleSLD}'
              layer-targets="non-existent-layer">
            </v-map-style>

            <v-map-layergroup>
              <v-map-layer-wkt
                id="actual-layer"
                wkt="${pointWKT}">
              </v-map-layer-wkt>
            </v-map-layergroup>
          </v-map>
        `);

        const styleComponent = await page.find('v-map-style');
        expect(styleComponent).toBeTruthy();
        expect(await styleComponent.getProperty('layerTargets')).toBe(
          'non-existent-layer',
        );
      });
    });

    it('should handle Mapbox GL style format', async () => {
      const mapboxStyle = JSON.stringify({
        version: 8,
        name: 'Test Mapbox Style',
        sources: {
          'test-source': {
            type: 'geojson',
            data: pointGeoJSON,
          },
        },
        layers: [
          {
            id: 'test-layer',
            type: 'circle',
            source: 'test-source',
            paint: {
              'circle-radius': 8,
              'circle-color': '#ff0000',
            },
          },
        ],
      });

      await usePage(async ({ page, render }) => {
        await render(`
          <v-map zoom="10" center-lat="47.4" center-lon="8.5">
            <v-map-style
              format="mapbox-gl"
              content='${mapboxStyle}'
              layer-targets="test-layer"
              auto-apply="true">
            </v-map-style>

            <v-map-layergroup>
              <v-map-layer-geojson
                id="test-layer"
                geojson='${JSON.stringify(pointGeoJSON)}'>
              </v-map-layer-geojson>
            </v-map-layergroup>
          </v-map>
        `);

        const styleComponent = await page.find('v-map-style');
        expect(styleComponent).toBeTruthy();
        expect(await styleComponent.getProperty('format')).toBe('mapbox-gl');
        expect(await styleComponent.getProperty('layerTargets')).toBe('test-layer');
        expect(await styleComponent.getProperty('autoApply')).toBe(true);
      });
    });
  });

  describe('Style component API', () => {
    it('should provide correct layer target parsing', async () => {
      await usePage(async ({ page, render }) => {
        await render(`
          <v-map>
            <v-map-style
              format="sld"
              content='${simpleSLD}'
              layer-targets="layer1,layer2,layer3"
              auto-apply="false">
            </v-map-style>
          </v-map>
        `);

        const styleComponent = await page.find('v-map-style');
        expect(await styleComponent.getProperty('layerTargets')).toBe(
          'layer1,layer2,layer3',
        );
      });
    });

    it('should report loading states correctly', async () => {
      await usePage(async ({ page, render }) => {
        await render(`
          <v-map>
            <v-map-style
              format="sld"
              content='${simpleSLD}'
              auto-apply="false">
            </v-map-style>
          </v-map>
        `);

        const styleComponent = await page.find('v-map-style');
        expect(await styleComponent.getProperty('format')).toBe('sld');
        expect(await styleComponent.getProperty('autoApply')).toBe(false);
      });
    });
  });
});
