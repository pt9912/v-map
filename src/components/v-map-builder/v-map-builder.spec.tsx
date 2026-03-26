import { newSpecPage } from '@stencil/core/testing';
import { VMapBuilder } from './v-map-builder';

describe('v-map-builder', () => {
  it('normalizes layer and style metadata from a config object', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });

    const component = page.rootInstance as any;
    const normalized = component.normalize({
      map: {
        flavour: 'leaflet',
        zoom: '7',
        center: '8,49',
        styles: [
          {
            id: 'style-1',
            format: 'SLD',
            content: '<StyledLayerDescriptor />',
            layerTargets: ['a', 'b'],
            autoApply: 'false',
          },
        ],
        layerGroups: [
          {
            groupTitle: 'Base',
            visible: 'true',
            layers: [
              {
                id: 'google-1',
                type: 'google',
                apiKey: 'secret',
                libraries: ['places', 'geometry'],
                maxZoom: '19',
              },
              {
                id: 'custom-1',
                type: 'something-else',
                data: { foo: 'bar' },
              },
            ],
          },
        ],
      },
    });

    expect(normalized.map.zoom).toBe(7);
    expect(normalized.map.styles[0]).toEqual({
      key: 'style-1',
      format: 'sld',
      src: undefined,
      content: '<StyledLayerDescriptor />',
      layerTargets: 'a,b',
      autoApply: false,
      id: 'style-1',
    });
    expect(normalized.map.layerGroups[0].layers[0]).toEqual(
      expect.objectContaining({
        id: 'google-1',
        type: 'google',
        data: expect.objectContaining({
          apiKey: 'secret',
          libraries: 'places,geometry',
          maxZoom: 19,
        }),
      }),
    );
    expect(normalized.map.layerGroups[0].layers[1]).toEqual(
      expect.objectContaining({
        id: 'custom-1',
        type: 'custom',
        data: { foo: 'bar' },
      }),
    );
    expect(component.normalizeLayerType('tile3d')).toBe('tile3d');
    expect(component.normalizeLayerType('unknown')).toBe('custom');
  });

  it('normalizes many supported layer types and style source variants', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });

    const component = page.rootInstance as any;
    const normalized = component.normalize({
      map: {
        styles: [
          {
            source: 'https://example.com/style.sld',
            layerTargets: 'a, b',
            autoApply: true,
          },
          {
            source: '{"version":8}',
            format: 'mapbox-gl',
          },
          '<StyledLayerDescriptor version="1.0.0" />',
        ],
        layerGroups: [
          {
            title: 'Mixed',
            layers: [
              {
                type: 'wms',
                url: 'https://example.com/wms',
                sublayers: 'roads',
                transparent: 'true',
                extraParams: { ENV: 'test' },
              },
              {
                type: 'wms-tiled',
                url: 'https://example.com/wms-tiled',
                layers: 'base',
              },
              {
                type: 'geojson',
                data: { type: 'FeatureCollection', features: [] },
                fillOpacity: '0.4',
                pointRadius: '12',
              },
              {
                type: 'terrain',
                url: 'https://example.com/elevation.png',
                data: {
                  wireframe: 'yes',
                  minZoom: '3',
                  meshMaxError: '4',
                },
              },
              {
                type: 'wfs',
                url: 'https://example.com/wfs',
                layerName: 'ns:roads',
                crs: 'EPSG:4326',
              },
              {
                type: 'wcs',
                url: 'https://example.com/wcs',
                coverageName: 'dem',
                resolutions: [256, 256],
              },
              {
                type: 'geotiff',
                url: 'https://example.com/dem.tif',
              },
              {
                type: 'tile3d',
                url: 'https://example.com/tileset.json',
                options: { maximumScreenSpaceError: 8 },
              },
              {
                type: 'scatterplot',
                data: [{ position: [7, 50] }],
                getRadius: '5',
              },
              {
                type: 'wkt',
                wkt: 'POINT(7 50)',
                textSize: '11',
              },
            ],
          },
        ],
      },
    });

    expect(normalized.map.styles).toEqual([
      expect.objectContaining({
        src: 'https://example.com/style.sld',
        layerTargets: 'a,b',
        autoApply: true,
      }),
      expect.objectContaining({
        content: '{"version":8}',
        format: 'mapbox-gl',
      }),
      expect.objectContaining({
        content: '<StyledLayerDescriptor version="1.0.0" />',
      }),
    ]);

    expect(normalized.map.layerGroups[0].layers).toEqual([
      expect.objectContaining({
        type: 'wms',
        layers: 'roads',
        data: expect.objectContaining({
          transparent: true,
          params: { ENV: 'test' },
        }),
      }),
      expect.objectContaining({
        type: 'wms-tiled',
        data: expect.objectContaining({
          tiled: true,
        }),
      }),
      expect.objectContaining({
        type: 'geojson',
        data: expect.objectContaining({
          geojson: { type: 'FeatureCollection', features: [] },
          fillOpacity: 0.4,
          pointRadius: 12,
        }),
      }),
      expect.objectContaining({
        type: 'terrain',
        data: expect.objectContaining({
          elevationData: 'https://example.com/elevation.png',
          wireframe: true,
          minZoom: 3,
          meshMaxError: 4,
        }),
      }),
      expect.objectContaining({
        type: 'wfs',
        data: expect.objectContaining({
          typeName: 'ns:roads',
          srsName: 'EPSG:4326',
        }),
      }),
      expect.objectContaining({
        type: 'wcs',
        data: expect.objectContaining({
          coverageName: 'dem',
          resolutions: [256, 256],
        }),
      }),
      expect.objectContaining({
        type: 'geotiff',
        url: 'https://example.com/dem.tif',
      }),
      expect.objectContaining({
        type: 'tile3d',
        data: expect.objectContaining({
          tilesetOptions: { maximumScreenSpaceError: 8 },
        }),
      }),
      expect.objectContaining({
        type: 'scatterplot',
        data: expect.objectContaining({
          data: [{ position: [7, 50] }],
          getRadius: 5,
        }),
      }),
      expect.objectContaining({
        type: 'wkt',
        data: expect.objectContaining({
          wkt: 'POINT(7 50)',
          textSize: 11,
        }),
      }),
    ]);
  });

  it('parses JSON and YAML scripts and emits config events', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder>
        <script type="application/json">{"map":{"layerGroups":[]}}</script>
      </v-map-builder>`,
    });

    const readySpy = jest.fn();
    const errorSpy = jest.fn();
    page.root?.addEventListener('configReady', readySpy);
    page.root?.addEventListener('configError', errorSpy);

    (page.rootInstance as any).parseFromSlot();
    expect(readySpy).toHaveBeenCalledTimes(1);

    page.root!.innerHTML = `
      <script type="application/yaml">
map:
  layerGroups: []
      </script>
    `;
    (page.rootInstance as any).parseFromSlot();
    expect(readySpy).toHaveBeenCalledTimes(2);

    page.root!.innerHTML = '';
    (page.rootInstance as any).parseFromSlot();
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('applies config diffs into mounted map, styles and layers', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });

    const component = page.rootInstance as any;
    const initial = component.normalize({
      map: {
        flavour: 'ol',
        zoom: 4,
        center: '7,50',
        styles: [{ key: 'style-1', content: '<StyledLayerDescriptor />' }],
        layerGroups: [
          {
            groupTitle: 'Group A',
            layers: [
              { id: 'osm-1', type: 'osm', visible: true },
              { id: 'xyz-1', type: 'xyz', url: 'https://tiles/{z}/{x}/{y}.png' },
            ],
          },
        ],
      },
    });
    const next = component.normalize({
      map: {
        flavour: 'leaflet',
        zoom: 5,
        center: '8,49',
        styles: [
          {
            key: 'style-2',
            content: '{"version":8}',
            format: 'mapbox-gl',
          },
        ],
        layerGroups: [
          {
            groupTitle: 'Group A',
            layers: [
              { id: 'xyz-1', type: 'xyz', url: 'https://tiles-new/{z}/{x}/{y}.png' },
              { id: 'wms-1', type: 'wms', url: 'https://example.com/wms', layers: 'base' },
            ],
          },
        ],
      },
    });

    component.applyDiff(undefined, initial);

    const mount = page.root?.shadowRoot?.querySelector('[part="mount"]') as HTMLElement;
    const mapEl = mount.querySelector('v-map') as HTMLElement;

    expect(mapEl.getAttribute('flavour')).toBe('ol');
    expect(mapEl.querySelectorAll('v-map-style')).toHaveLength(1);
    expect(mapEl.querySelectorAll('v-map-layergroup')).toHaveLength(1);
    expect(
      mapEl.querySelector('v-map-layergroup')?.querySelectorAll(
        'v-map-layer-osm, v-map-layer-xyz',
      ),
    ).toHaveLength(2);

    component.applyDiff(initial, next);

    expect(mapEl.getAttribute('flavour')).toBe('leaflet');
    expect(mapEl.getAttribute('zoom')).toBe('5');
    expect(mapEl.querySelectorAll('v-map-style')).toHaveLength(1);
    expect(
      mapEl.querySelector('v-map-style')?.getAttribute('data-builder-style-id'),
    ).toBe('style-2');
    expect(
      mapEl.querySelector('v-map-layergroup')?.querySelector('#xyz-1')?.getAttribute('url'),
    ).toBe('https://tiles-new/{z}/{x}/{y}.png');
    expect(
      mapEl.querySelector('v-map-layergroup')?.querySelector('#wms-1'),
    ).not.toBeNull();
    expect(
      mapEl.querySelector('v-map-layergroup')?.querySelector('#osm-1'),
    ).toBeNull();
  });

  it('replaces layers when the type changes and removes obsolete styles', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });

    const component = page.rootInstance as any;
    const previous = component.normalize({
      map: {
        styles: [{ key: 'style-a', content: '<StyledLayerDescriptor />' }],
        layerGroups: [
          {
            groupTitle: 'Group A',
            layers: [{ id: 'layer-1', type: 'osm' }],
          },
        ],
      },
    });
    const next = component.normalize({
      map: {
        styles: [],
        layerGroups: [
          {
            groupTitle: 'Group A',
            layers: [
              {
                id: 'layer-1',
                type: 'wkt',
                wkt: 'POINT(7 50)',
                pointColor: '#ff0000',
              },
            ],
          },
        ],
      },
    });

    component.applyDiff(undefined, previous);
    component.applyDiff(previous, next);

    const mount = page.root?.shadowRoot?.querySelector('[part="mount"]') as HTMLElement;
    const mapEl = mount.querySelector('v-map') as HTMLElement;

    expect(mapEl.querySelectorAll('v-map-style')).toHaveLength(0);
    expect(mapEl.querySelector('#layer-1')?.tagName.toLowerCase()).toBe(
      'v-map-layer-wkt',
    );
    expect(mapEl.querySelector('#layer-1')?.getAttribute('point-color')).toBe(
      '#ff0000',
    );
  });
});
