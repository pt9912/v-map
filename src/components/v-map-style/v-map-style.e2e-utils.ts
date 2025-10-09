import type { E2EPage } from '../../testing/e2e-testing';
import { newE2EPage } from '../../testing/e2e-testing';

jest.setTimeout(60_000);

newE2EPage.setIgnoreError('SLD parsing failed');

export const simpleSLD = `<?xml version="1.0" encoding="UTF-8"?>
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

export const polygonSLD = `<?xml version="1.0" encoding="UTF-8"?>
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

export const pointWKT = 'POINT(8.5 47.4)';
export const polygonWKT =
  'POLYGON((8.5 47.4, 8.6 47.4, 8.6 47.5, 8.5 47.5, 8.5 47.4))';

export const pointGeoJSON = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [8.5, 47.4],
  },
  properties: {
    name: 'Test Point',
  },
};

export const polygonGeoJSON = {
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

type RenderFn = (html: string, opts?: { wait?: boolean }) => Promise<void>;

export async function useMapStylePage(
  run: (ctx: { page: E2EPage; render: RenderFn }) => Promise<void>,
): Promise<void> {
  const page = await newE2EPage();
  await page.setContent('<div id="test-root"></div>');

  const render: RenderFn = async (html, opts) => {
    await page.evaluate(content => {
      const root = document.getElementById('test-root');
      if (root) {
        root.innerHTML = content;
      }
    }, html);
    if (opts?.wait === false) return;
    await page.waitForChanges();
  };

  try {
    await run({ page, render });
  } finally {
    try {
      await render('', { wait: false });
    } catch {
      // ignore cleanup failure
    }
    await page.close();
  }
}
