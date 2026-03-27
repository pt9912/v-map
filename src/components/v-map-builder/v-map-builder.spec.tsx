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

  it('toOptionalBoolean returns false for falsy strings and undefined for unrecognized input', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    // false-returning cases
    expect(component.toOptionalBoolean('false')).toBe(false);
    expect(component.toOptionalBoolean('0')).toBe(false);
    expect(component.toOptionalBoolean('no')).toBe(false);
    expect(component.toOptionalBoolean('n')).toBe(false);
    expect(component.toOptionalBoolean('FALSE')).toBe(false);
    expect(component.toOptionalBoolean('No')).toBe(false);

    // undefined-returning cases for unrecognized strings
    expect(component.toOptionalBoolean('randomstring')).toBeUndefined();
    expect(component.toOptionalBoolean('maybe')).toBeUndefined();
    expect(component.toOptionalBoolean('')).toBeUndefined();
  });

  it('toCsv returns the string as-is when value is already a string', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    expect(component.toCsv('a,b,c')).toBe('a,b,c');
    expect(component.toCsv('single')).toBe('single');
    expect(component.toCsv(42)).toBe('42');
  });

  it('toKebabCase converts camelCase and snake_case to kebab-case', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    expect(component.toKebabCase('fooBar')).toBe('foo-bar');
    expect(component.toKebabCase('foo_bar')).toBe('foo-bar');
    expect(component.toKebabCase('fooBarBaz')).toBe('foo-bar-baz');
    expect(component.toKebabCase('FooBar')).toBe('foo-bar');
    expect(component.toKebabCase('already-kebab')).toBe('already-kebab');
    expect(component.toKebabCase('ALLCAPS')).toBe('allcaps');
    expect(component.toKebabCase('myXMLParser')).toBe('my-xmlparser');
  });

  it('createLayerEl creates correct elements for terrain type', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'terrain-1',
      type: 'terrain',
      data: {
        elevationData: 'https://example.com/elevation.png',
        texture: 'https://example.com/texture.png',
        wireframe: true,
        minZoom: 3,
        maxZoom: 15,
        meshMaxError: 4,
        color: [255, 0, 0],
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.tagName.toLowerCase()).toBe('v-map-layer-terrain');
    expect(el.getAttribute('id')).toBe('terrain-1');
    expect(el.getAttribute('elevation-data')).toBe('https://example.com/elevation.png');
    expect(el.getAttribute('texture')).toBe('https://example.com/texture.png');
    expect(el.getAttribute('wireframe')).toBe('true');
    expect(el.getAttribute('min-zoom')).toBe('3');
    expect(el.getAttribute('max-zoom')).toBe('15');
    expect(el.getAttribute('mesh-max-error')).toBe('4');
    expect(el.getAttribute('color')).toBe(JSON.stringify([255, 0, 0]));
  });

  it('createLayerEl creates correct elements for wfs type', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'wfs-1',
      type: 'wfs',
      url: 'https://example.com/wfs',
      data: {
        url: 'https://example.com/wfs',
        typeName: 'ns:roads',
        version: '2.0.0',
        outputFormat: 'application/json',
        srsName: 'EPSG:4326',
        params: { maxFeatures: 100 },
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.tagName.toLowerCase()).toBe('v-map-layer-wfs');
    expect(el.getAttribute('url')).toBe('https://example.com/wfs');
    expect(el.getAttribute('type-name')).toBe('ns:roads');
    expect(el.getAttribute('version')).toBe('2.0.0');
    expect(el.getAttribute('output-format')).toBe('application/json');
    expect(el.getAttribute('srs-name')).toBe('EPSG:4326');
    expect(el.getAttribute('params')).toBe(JSON.stringify({ maxFeatures: 100 }));
  });

  it('createLayerEl creates correct elements for wcs type', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'wcs-1',
      type: 'wcs',
      url: 'https://example.com/wcs',
      data: {
        url: 'https://example.com/wcs',
        coverageName: 'dem',
        format: 'image/tiff',
        version: '2.0.1',
        projection: 'EPSG:4326',
        resolutions: [256, 256],
        params: { subset: 'time("2020-01-01")' },
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.tagName.toLowerCase()).toBe('v-map-layer-wcs');
    expect(el.getAttribute('url')).toBe('https://example.com/wcs');
    expect(el.getAttribute('coverage-name')).toBe('dem');
    expect(el.getAttribute('format')).toBe('image/tiff');
    expect(el.getAttribute('version')).toBe('2.0.1');
    expect(el.getAttribute('projection')).toBe('EPSG:4326');
    expect(el.getAttribute('resolutions')).toBe(JSON.stringify([256, 256]));
    expect(el.getAttribute('params')).toBe(JSON.stringify({ subset: 'time("2020-01-01")' }));
  });

  it('createLayerEl creates correct elements for google type', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'google-1',
      type: 'google',
      data: {
        apiKey: 'my-key',
        mapType: 'satellite',
        language: 'en',
        region: 'US',
        scale: 2,
        libraries: 'places,geometry',
        maxZoom: 19,
        styles: [{ featureType: 'water' }],
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.tagName.toLowerCase()).toBe('v-map-layer-google');
    expect(el.getAttribute('api-key')).toBe('my-key');
    expect(el.getAttribute('map-type')).toBe('satellite');
    expect(el.getAttribute('language')).toBe('en');
    expect(el.getAttribute('region')).toBe('US');
    expect(el.getAttribute('scale')).toBe('2');
    expect(el.getAttribute('libraries')).toBe('places,geometry');
    expect(el.getAttribute('max-zoom')).toBe('19');
    expect(el.getAttribute('styles')).toBe(JSON.stringify([{ featureType: 'water' }]));
  });

  it('createLayerEl creates correct elements for geotiff type', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'geotiff-1',
      type: 'geotiff',
      url: 'https://example.com/dem.tif',
    };
    const el = component.createLayerEl(layer);
    expect(el.tagName.toLowerCase()).toBe('v-map-layer-geotiff');
    expect(el.getAttribute('url')).toBe('https://example.com/dem.tif');
  });

  it('createLayerEl creates correct elements for tile3d type', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'tile3d-1',
      type: 'tile3d',
      url: 'https://example.com/tileset.json',
      data: {
        tilesetOptions: { maximumScreenSpaceError: 8 },
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.tagName.toLowerCase()).toBe('v-map-layer-tile3d');
    expect(el.getAttribute('url')).toBe('https://example.com/tileset.json');
    expect(el.getAttribute('tileset-options')).toBe(
      JSON.stringify({ maximumScreenSpaceError: 8 }),
    );
  });

  it('createLayerEl creates correct elements for scatterplot type', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'scatter-1',
      type: 'scatterplot',
      data: {
        url: 'https://example.com/data.json',
        data: [{ position: [7, 50] }],
        getFillColor: [255, 0, 0],
        getRadius: 5,
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.tagName.toLowerCase()).toBe('v-map-layer-scatterplot');
    expect(el.getAttribute('url')).toBe('https://example.com/data.json');
    expect(el.getAttribute('data')).toBe(JSON.stringify([{ position: [7, 50] }]));
    expect(el.getAttribute('get-fill-color')).toBe('255,0,0');
    expect(el.getAttribute('get-radius')).toBe('5');
  });

  it('createLayerEl creates correct elements for wkt type', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'wkt-1',
      type: 'wkt',
      data: {
        wkt: 'POINT(7 50)',
        url: 'https://example.com/data.wkt',
        fillColor: '#ff0000',
        fillOpacity: 0.4,
        strokeColor: '#000000',
        strokeWidth: 2,
        strokeOpacity: 0.8,
        pointRadius: 12,
        pointColor: '#00ff00',
        iconUrl: 'https://example.com/icon.png',
        iconSize: '32,32',
        textProperty: 'name',
        textColor: '#333',
        textSize: 11,
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.tagName.toLowerCase()).toBe('v-map-layer-wkt');
    expect(el.getAttribute('wkt')).toBe('POINT(7 50)');
    expect(el.getAttribute('url')).toBe('https://example.com/data.wkt');
    expect(el.getAttribute('fill-color')).toBe('#ff0000');
    expect(el.getAttribute('fill-opacity')).toBe('0.4');
    expect(el.getAttribute('stroke-color')).toBe('#000000');
    expect(el.getAttribute('stroke-width')).toBe('2');
    expect(el.getAttribute('point-radius')).toBe('12');
    expect(el.getAttribute('point-color')).toBe('#00ff00');
    expect(el.getAttribute('text-size')).toBe('11');
  });

  it('createLayerEl creates custom element for unknown types', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'custom-1',
      type: 'custom',
      data: {
        myOption: 'value1',
        nestedObj: { a: 1 },
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.tagName.toLowerCase()).toBe('v-map-layer-custom');
    expect(el.getAttribute('type')).toBe('custom');
    expect(el.getAttribute('my-option')).toBe('value1');
    expect(el.getAttribute('nested-obj')).toBe(JSON.stringify({ a: 1 }));
  });

  it('createLayerEl handles WMS with params object', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'wms-params',
      type: 'wms',
      url: 'https://example.com/wms',
      layers: 'base',
      data: {
        transparent: true,
        params: { ENV: 'test', CQL_FILTER: 'id=1' },
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.tagName.toLowerCase()).toBe('v-map-layer-wms');
    expect(el.getAttribute('url')).toBe('https://example.com/wms');
    expect(el.getAttribute('layers')).toBe('base');
    expect(el.getAttribute('params')).toBe(
      JSON.stringify({ ENV: 'test', CQL_FILTER: 'id=1' }),
    );
    expect(el.getAttribute('transparent')).toBe('true');

    // Also test when params is already a string
    const layer2 = {
      id: 'wms-params-str',
      type: 'wms',
      url: 'https://example.com/wms',
      data: { params: 'ENV=test' },
    };
    const el2 = component.createLayerEl(layer2);
    expect(el2.getAttribute('params')).toBe('ENV=test');
  });

  it('createLayerEl handles geojson data as object and string', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const geojsonObj = { type: 'FeatureCollection', features: [] };
    const layer = {
      id: 'geojson-1',
      type: 'geojson',
      data: {
        geojson: geojsonObj,
        fillColor: '#ff0000',
        fillOpacity: 0.5,
        strokeColor: '#000',
        strokeWidth: 1,
        strokeOpacity: 0.8,
        pointRadius: 5,
        pointColor: '#0000ff',
        iconUrl: 'https://example.com/icon.png',
        iconSize: '24,24',
        textProperty: 'label',
        textColor: '#333',
        textSize: 14,
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.tagName.toLowerCase()).toBe('v-map-layer-geojson');
    expect(el.getAttribute('geojson')).toBe(JSON.stringify(geojsonObj));
    expect(el.getAttribute('fill-color')).toBe('#ff0000');
    expect(el.getAttribute('fill-opacity')).toBe('0.5');
    expect(el.getAttribute('text-property')).toBe('label');
    expect(el.getAttribute('text-color')).toBe('#333');
    expect(el.getAttribute('text-size')).toBe('14');

    // When geojson payload is already a string
    const layer2 = {
      id: 'geojson-str',
      type: 'geojson',
      data: {
        geojson: '{"type":"Point","coordinates":[7,50]}',
      },
    };
    const el2 = component.createLayerEl(layer2);
    expect(el2.getAttribute('geojson')).toBe('{"type":"Point","coordinates":[7,50]}');
  });

  it('patchLayer handles visible, opacity, zIndex, layers, and tiled changes', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const el = document.createElement('v-map-layer-wms');
    el.setAttribute('id', 'layer-1');
    el.setAttribute('visible', 'true');
    el.setAttribute('opacity', '1');

    const next = {
      id: 'layer-1',
      type: 'wms',
      visible: 'false',
      opacity: 0.5,
      zIndex: 10,
      layers: 'new-layers',
      tiled: 'true',
    } as any;

    component.patchLayer(el, {
      visible: { old: 'true', new: 'false' },
      opacity: { old: 1, new: 0.5 },
      zIndex: { old: undefined, new: 10 },
      layers: { old: undefined, new: 'new-layers' },
      tiled: { old: undefined, new: 'true' },
    }, next);

    expect(el.getAttribute('visible')).toBe('false');
    expect(el.getAttribute('opacity')).toBe('0.5');
    expect(el.getAttribute('z-index')).toBe('10');
    expect(el.getAttribute('layers')).toBe('new-layers');
    expect(el.getAttribute('tiled')).toBe('true');
  });

  it('patchLayer handles style changes via ensureAttr', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    // Use a non-HTML element to avoid DOM style attribute interference
    const el = document.createElement('v-map-layer-wms');
    const ensureAttrSpy = jest.spyOn(component, 'ensureAttr');

    const styleObj = { color: 'red' };
    const next = { id: 'layer-1', type: 'wms', style: styleObj } as any;

    component.patchLayer(el, {
      style: { old: undefined, new: styleObj },
    }, next);

    expect(ensureAttrSpy).toHaveBeenCalledWith(el, 'style', JSON.stringify(styleObj));

    // Also test removing style (new = undefined)
    ensureAttrSpy.mockClear();
    component.patchLayer(el, {
      style: { old: styleObj, new: undefined },
    }, { id: 'layer-1', type: 'wms' } as any);

    expect(ensureAttrSpy).toHaveBeenCalledWith(el, 'style', undefined);
  });

  it('patchLayer replaces element when type changes', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    // Set up a parent container with an existing element
    const parent = document.createElement('div');
    const oldEl = document.createElement('v-map-layer-osm');
    oldEl.setAttribute('id', 'layer-1');
    parent.appendChild(oldEl);

    const next = { id: 'layer-1', type: 'wms', url: 'https://example.com/wms', layers: 'base' } as any;
    component.patchLayer(oldEl, {
      type: { old: 'osm', new: 'wms' },
    }, next);

    // The old element should be replaced
    expect(parent.querySelector('v-map-layer-osm')).toBeNull();
    expect(parent.querySelector('v-map-layer-wms')).not.toBeNull();
    expect(parent.querySelector('v-map-layer-wms')?.getAttribute('id')).toBe('layer-1');
  });

  it('patchLayer replaces element when data changes for known types', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    // Test data change for terrain - should trigger element replacement
    const parent = document.createElement('div');
    const oldEl = document.createElement('v-map-layer-terrain');
    oldEl.setAttribute('id', 'terrain-1');
    parent.appendChild(oldEl);

    const next = {
      id: 'terrain-1',
      type: 'terrain',
      data: { elevationData: 'https://new-url.com/elevation.png' },
    } as any;
    component.patchLayer(oldEl, {
      data: {
        old: { elevationData: 'https://old-url.com/elevation.png' },
        new: { elevationData: 'https://new-url.com/elevation.png' },
      },
    }, next);

    // Old element should have been replaced
    const newEl = parent.querySelector('v-map-layer-terrain');
    expect(newEl).not.toBeNull();
    expect(newEl?.getAttribute('elevation-data')).toBe('https://new-url.com/elevation.png');
  });

  it('patchLayer falls back to setData or attribute for data change on custom types', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    // For a custom type, data changes should call setData or set attribute
    const parent = document.createElement('div');
    const el = document.createElement('v-map-layer-custom') as any;
    el.setAttribute('id', 'custom-1');
    parent.appendChild(el);

    // Without setData method - should set the data attribute
    const next = {
      id: 'custom-1',
      type: 'custom',
      data: { key: 'value' },
    } as any;
    component.patchLayer(el, {
      data: { old: undefined, new: { key: 'value' } },
    }, next);

    expect(el.getAttribute('data')).toBe(JSON.stringify({ key: 'value' }));

    // With setData method - should call it
    const setDataSpy = jest.fn();
    el.setData = setDataSpy;
    component.patchLayer(el, {
      data: { old: { key: 'value' }, new: { key: 'newvalue' } },
    }, next);

    expect(setDataSpy).toHaveBeenCalledWith({ key: 'newvalue' });
  });

  it('normalizeStyle returns undefined when entry is an object without src or content', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const result = component.normalizeStyle({ format: 'sld' }, 0);
    expect(result).toBeUndefined();
  });

  it('syncStyles updates existing elements and removes obsolete ones', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    // Set up a map element with pre-existing builder styles
    const mapEl = document.createElement('v-map');

    const existingStyle = document.createElement('v-map-style');
    existingStyle.setAttribute('data-builder-style', 'true');
    existingStyle.setAttribute('data-builder-style-id', 'style-a');
    existingStyle.setAttribute('format', 'sld');
    existingStyle.setAttribute('content', '<old/>');
    mapEl.appendChild(existingStyle);

    const obsoleteStyle = document.createElement('v-map-style');
    obsoleteStyle.setAttribute('data-builder-style', 'true');
    obsoleteStyle.setAttribute('data-builder-style-id', 'style-obsolete');
    obsoleteStyle.setAttribute('content', '<obsolete/>');
    mapEl.appendChild(obsoleteStyle);

    // Add a non-builder child to act as anchor
    const layerGroup = document.createElement('v-map-layergroup');
    mapEl.appendChild(layerGroup);

    const newStyles = [
      {
        key: 'style-a',
        format: 'sld',
        content: '<updated/>',
        autoApply: true,
      },
      {
        key: 'style-b',
        format: 'mapbox-gl',
        content: '{"version":8}',
        autoApply: false,
      },
    ];

    component.syncStyles(mapEl, newStyles);

    const builderStyles = mapEl.querySelectorAll(
      'v-map-style[data-builder-style="true"]',
    );
    expect(builderStyles).toHaveLength(2);

    // style-a should be updated
    const styleA = mapEl.querySelector(
      'v-map-style[data-builder-style-id="style-a"]',
    );
    expect(styleA).not.toBeNull();
    expect(styleA?.getAttribute('content')).toBe('<updated/>');
    expect(styleA?.getAttribute('format')).toBe('sld');

    // style-b should be newly created
    const styleB = mapEl.querySelector(
      'v-map-style[data-builder-style-id="style-b"]',
    );
    expect(styleB).not.toBeNull();
    expect(styleB?.getAttribute('content')).toBe('{"version":8}');
    expect(styleB?.getAttribute('format')).toBe('mapbox-gl');

    // obsolete style should be removed
    const obsolete = mapEl.querySelector(
      'v-map-style[data-builder-style-id="style-obsolete"]',
    );
    expect(obsolete).toBeNull();
  });

  it('onMapConfigChanged triggers parseFromSlot', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder>
        <script type="application/json">{"map":{"layerGroups":[]}}</script>
      </v-map-builder>`,
    });
    const component = page.rootInstance as any;
    const spy = jest.spyOn(component, 'parseFromSlot');

    component.onMapConfigChanged('old', 'new');

    expect(spy).toHaveBeenCalled();
  });

  it('onSlotChange handler triggers parseFromSlot', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder>
        <script type="application/json">{"map":{"layerGroups":[]}}</script>
      </v-map-builder>`,
    });
    const component = page.rootInstance as any;
    const spy = jest.spyOn(component, 'parseFromSlot');

    component.onSlotChange();

    expect(spy).toHaveBeenCalled();
  });

  it('applyDiff handles moved layers by reordering them', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    // Create initial state with three layers
    const initial = component.normalize({
      map: {
        layerGroups: [
          {
            groupTitle: 'Group A',
            layers: [
              { id: 'layer-a', type: 'osm' },
              { id: 'layer-b', type: 'osm' },
              { id: 'layer-c', type: 'osm' },
            ],
          },
        ],
      },
    });
    component.applyDiff(undefined, initial);

    const mount = page.root?.shadowRoot?.querySelector('[part="mount"]') as HTMLElement;
    const groupEl = mount.querySelector('v-map-layergroup') as HTMLElement;
    expect(groupEl.children).toHaveLength(3);
    expect(groupEl.children[0].getAttribute('id')).toBe('layer-a');
    expect(groupEl.children[1].getAttribute('id')).toBe('layer-b');
    expect(groupEl.children[2].getAttribute('id')).toBe('layer-c');

    // Reorder: move layer-c to the beginning
    const reordered = component.normalize({
      map: {
        layerGroups: [
          {
            groupTitle: 'Group A',
            layers: [
              { id: 'layer-c', type: 'osm' },
              { id: 'layer-a', type: 'osm' },
              { id: 'layer-b', type: 'osm' },
            ],
          },
        ],
      },
    });
    component.applyDiff(initial, reordered);

    expect(groupEl.children[0].getAttribute('id')).toBe('layer-c');
    expect(groupEl.children[1].getAttribute('id')).toBe('layer-a');
    expect(groupEl.children[2].getAttribute('id')).toBe('layer-b');
  });

  it('createLayerEl handles terrain with elevationDecoder as object', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const decoder = { rScaler: 6553.6, gScaler: 25.6, bScaler: 0.1, offset: -10000 };
    const layer = {
      id: 'terrain-dec',
      type: 'terrain',
      data: {
        elevationData: 'https://example.com/elevation.png',
        elevationDecoder: decoder,
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.getAttribute('elevation-decoder')).toBe(JSON.stringify(decoder));
  });

  it('createLayerEl handles terrain color as non-array string', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'terrain-color-str',
      type: 'terrain',
      data: {
        elevationData: 'https://example.com/elevation.png',
        color: '#ff0000',
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.getAttribute('color')).toBe('#ff0000');
  });

  it('createLayerEl handles wcs and wfs with string params and resolutions', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    // WCS with string resolutions and string params
    const wcsLayer = {
      id: 'wcs-str',
      type: 'wcs',
      data: {
        url: 'https://example.com/wcs',
        coverageName: 'dem',
        resolutions: '256,256',
        params: 'subset=time',
      },
    };
    const wcsEl = component.createLayerEl(wcsLayer);
    expect(wcsEl.getAttribute('resolutions')).toBe('256,256');
    expect(wcsEl.getAttribute('params')).toBe('subset=time');

    // WFS with string params
    const wfsLayer = {
      id: 'wfs-str',
      type: 'wfs',
      data: {
        url: 'https://example.com/wfs',
        typeName: 'ns:roads',
        params: 'maxFeatures=100',
      },
    };
    const wfsEl = component.createLayerEl(wfsLayer);
    expect(wfsEl.getAttribute('params')).toBe('maxFeatures=100');
  });

  it('createLayerEl handles google styles as string', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'google-str',
      type: 'google',
      data: {
        apiKey: 'key',
        styles: '[{"featureType":"water"}]',
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.getAttribute('styles')).toBe('[{"featureType":"water"}]');
  });

  it('createLayerEl handles tile3d tilesetOptions as string', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'tile3d-str',
      type: 'tile3d',
      url: 'https://example.com/tileset.json',
      data: {
        tilesetOptions: '{"maximumScreenSpaceError":8}',
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.getAttribute('tileset-options')).toBe('{"maximumScreenSpaceError":8}');
  });

  it('createLayerEl handles scatterplot data as string', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'scatter-str',
      type: 'scatterplot',
      data: {
        data: '[{"position":[7,50]}]',
        getRadius: 5,
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.getAttribute('data')).toBe('[{"position":[7,50]}]');
  });

  it('createLayerEl handles wkt data as object (non-string)', async () => {
    const page = await newSpecPage({
      components: [VMapBuilder],
      html: `<v-map-builder></v-map-builder>`,
    });
    const component = page.rootInstance as any;

    const layer = {
      id: 'wkt-obj',
      type: 'wkt',
      data: {
        wkt: { type: 'something' },
      },
    };
    const el = component.createLayerEl(layer);
    expect(el.getAttribute('wkt')).toBe(JSON.stringify({ type: 'something' }));
  });
});
