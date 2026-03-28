import { vi, describe, it, expect } from 'vitest';
import { h } from '@stencil/vitest';
import { VMapBuilder } from './v-map-builder';

function toPropName(attr: string): string {
  return attr.replace(/-([a-z])/g, (_match, char: string) => char.toUpperCase());
}

function createEmitter(root: HTMLElement, eventName: string) {
  return {
    emit: vi.fn((detail?: unknown) => {
      root.dispatchEvent(
        new CustomEvent(eventName, {
          detail,
          bubbles: false,
        }),
      );
    }),
  };
}

function appendVNode(parent: HTMLElement, node: any): void {
  if (node == null) return;
  if (Array.isArray(node)) {
    node.forEach(child => appendVNode(parent, child));
    return;
  }
  if (typeof node === 'string' || typeof node === 'number') {
    parent.appendChild(document.createTextNode(String(node)));
    return;
  }
  if (typeof node !== 'object') return;
  if (node.$text$ != null) {
    parent.appendChild(document.createTextNode(String(node.$text$)));
    return;
  }
  if (!node.$tag$) return;

  const el = document.createElement(node.$tag$);
  for (const [name, rawValue] of Object.entries(node.$attrs$ ?? {})) {
    if (typeof rawValue === 'function' || rawValue == null) continue;
    el.setAttribute(name, rawValue === true ? '' : String(rawValue));
  }
  appendVNode(el, node.$children$ ?? []);
  parent.appendChild(el);
}

async function render(vnode: any) {
  const root = document.createElement('v-map-builder');
  const instance = new VMapBuilder() as any;
  instance.hostEl = root;
  instance.configReady = createEmitter(root, 'configReady');
  instance.configError = createEmitter(root, 'configError');

  const attrs = vnode?.$attrs$ ?? {};
  for (const [name, rawValue] of Object.entries(attrs)) {
    if (typeof rawValue === 'function' || rawValue == null) continue;
    const propName = toPropName(name);
    instance[propName] = rawValue;
    root.setAttribute(name, String(rawValue));
  }

  appendVNode(root, vnode?.$children$ ?? []);
  return { root, instance };
}

describe('v-map-builder', () => {
  it('normalizes layer and style metadata from a config object', async () => {
    const { root, instance } = await render(
      h('v-map-builder', null),
    );

    const component = (instance ?? root) as any;
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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );

    const component = (instance ?? root) as any;
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
    const { root, instance } = await render(
      h('v-map-builder', null,
        h('script', { type: 'application/json' }, '{"map":{"layerGroups":[]}}'),
      ),
    );

    const readySpy = vi.fn();
    const errorSpy = vi.fn();
    root?.addEventListener('configReady', readySpy);
    root?.addEventListener('configError', errorSpy);

    const component = (instance ?? root) as any;
    component.parseFromSlot();
    expect(readySpy).toHaveBeenCalledTimes(1);

    root!.innerHTML = `
      <script type="application/yaml">
map:
  layerGroups: []
      </script>
    `;
    component.parseFromSlot();
    expect(readySpy).toHaveBeenCalledTimes(2);

    root!.innerHTML = '';
    component.parseFromSlot();
    expect(errorSpy).toHaveBeenCalledTimes(1);
  });

  it('applies config diffs into mounted map, styles and layers', async () => {
    const { root, instance } = await render(
      h('v-map-builder', null),
    );

    const component = (instance ?? root) as any;
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

    const mapEl = root?.querySelector('v-map') as HTMLElement;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );

    const component = (instance ?? root) as any;
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

    const mapEl = root?.querySelector('v-map') as HTMLElement;

    expect(mapEl.querySelectorAll('v-map-style')).toHaveLength(0);
    expect(mapEl.querySelector('#layer-1')?.tagName.toLowerCase()).toBe(
      'v-map-layer-wkt',
    );
    expect(mapEl.querySelector('#layer-1')?.getAttribute('point-color')).toBe(
      '#ff0000',
    );
  });

  it('toOptionalBoolean returns false for falsy strings and undefined for unrecognized input', async () => {
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

    expect(component.toCsv('a,b,c')).toBe('a,b,c');
    expect(component.toCsv('single')).toBe('single');
    expect(component.toCsv(42)).toBe('42');
  });

  it('toKebabCase converts camelCase and snake_case to kebab-case', async () => {
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

    expect(component.toKebabCase('fooBar')).toBe('foo-bar');
    expect(component.toKebabCase('foo_bar')).toBe('foo-bar');
    expect(component.toKebabCase('fooBarBaz')).toBe('foo-bar-baz');
    expect(component.toKebabCase('FooBar')).toBe('foo-bar');
    expect(component.toKebabCase('already-kebab')).toBe('already-kebab');
    expect(component.toKebabCase('ALLCAPS')).toBe('allcaps');
    expect(component.toKebabCase('myXMLParser')).toBe('my-xmlparser');
  });

  it('createLayerEl creates correct elements for terrain type', async () => {
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

    // Use a non-HTML element to avoid DOM style attribute interference
    const el = document.createElement('v-map-layer-wms');
    const ensureAttrSpy = vi.spyOn(component, 'ensureAttr');

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const setDataSpy = vi.fn();
    el.setData = setDataSpy;
    component.patchLayer(el, {
      data: { old: { key: 'value' }, new: { key: 'newvalue' } },
    }, next);

    expect(setDataSpy).toHaveBeenCalledWith({ key: 'newvalue' });
  });

  it('normalizeStyle returns undefined when entry is an object without src or content', async () => {
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

    const result = component.normalizeStyle({ format: 'sld' }, 0);
    expect(result).toBeUndefined();
  });

  it('syncStyles updates existing elements and removes obsolete ones', async () => {
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null,
        h('script', { type: 'application/json' }, '{"map":{"layerGroups":[]}}'),
      ),
    );
    const component = (instance ?? root) as any;
    const spy = vi.spyOn(component, 'parseFromSlot');

    component.onMapConfigChanged('old', 'new');

    expect(spy).toHaveBeenCalled();
  });

  it('onSlotChange handler triggers parseFromSlot', async () => {
    const { root, instance } = await render(
      h('v-map-builder', null,
        h('script', { type: 'application/json' }, '{"map":{"layerGroups":[]}}'),
      ),
    );
    const component = (instance ?? root) as any;
    const spy = vi.spyOn(component, 'parseFromSlot');

    component.onSlotChange();

    expect(spy).toHaveBeenCalled();
  });

  it('applyDiff handles moved layers by reordering them', async () => {
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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

    const groupEl = root?.querySelector('v-map-layergroup') as HTMLElement;
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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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
    const { root, instance } = await render(
      h('v-map-builder', null),
    );
    const component = (instance ?? root) as any;

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

  /* ------------------------------------------------------------------ */
  /*  Prototype-based unit tests for source coverage                     */
  /* ------------------------------------------------------------------ */
  describe('prototype-based source coverage', () => {

    function createMockHost() {
      const el = document.createElement('v-map-builder');
      return el;
    }

    // --- normalize ---

    it('normalize handles raw input without map wrapper', () => {
      const component = {
        hostEl: createMockHost(),
        normalizeStyles: VMapBuilder.prototype['normalizeStyles'],
        normalizeStyle: VMapBuilder.prototype['normalizeStyle'],
        normalizeLayer: VMapBuilder.prototype['normalizeLayer'],
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
      } as any;
      const result = VMapBuilder.prototype['normalize'].call(component, {
        flavour: 'leaflet',
        zoom: 5,
        center: '8,49',
        layerGroups: [],
      });
      expect(result.map.flavour).toBe('leaflet');
      expect(result.map.zoom).toBe(5);
      expect(result.map.center).toBe('8,49');
    });

    it('normalize uses defaults for missing fields', () => {
      const component = {
        hostEl: createMockHost(),
        normalizeStyles: VMapBuilder.prototype['normalizeStyles'],
        normalizeStyle: VMapBuilder.prototype['normalizeStyle'],
        normalizeLayer: VMapBuilder.prototype['normalizeLayer'],
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
      } as any;
      const result = VMapBuilder.prototype['normalize'].call(component, null);
      expect(result.map.flavour).toBe('ol');
      expect(result.map.id).toBe('map1');
      expect(result.map.zoom).toBe(2);
      expect(result.map.center).toBe('0,0');
      expect(result.map.layerGroups).toEqual([]);
    });

    it('normalize handles non-object input gracefully', () => {
      const component = {
        hostEl: createMockHost(),
        normalizeStyles: VMapBuilder.prototype['normalizeStyles'],
        normalizeStyle: VMapBuilder.prototype['normalizeStyle'],
        normalizeLayer: VMapBuilder.prototype['normalizeLayer'],
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
      } as any;
      const result = VMapBuilder.prototype['normalize'].call(component, 'invalid');
      expect(result.map.flavour).toBe('ol');
      expect(result.map.layerGroups).toEqual([]);
    });

    // --- normalizeLayerType ---

    it('normalizeLayerType returns correct types for all supported values', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['normalizeLayerType'];

      expect(fn.call(component, 'osm')).toBe('osm');
      expect(fn.call(component, 'wms')).toBe('wms');
      expect(fn.call(component, 'wms-tiled')).toBe('wms-tiled');
      expect(fn.call(component, 'geojson')).toBe('geojson');
      expect(fn.call(component, 'xyz')).toBe('xyz');
      expect(fn.call(component, 'terrain')).toBe('terrain');
      expect(fn.call(component, 'wfs')).toBe('wfs');
      expect(fn.call(component, 'wcs')).toBe('wcs');
      expect(fn.call(component, 'google')).toBe('google');
      expect(fn.call(component, 'geotiff')).toBe('geotiff');
      expect(fn.call(component, 'tile3d')).toBe('tile3d');
      expect(fn.call(component, 'scatterplot')).toBe('scatterplot');
      expect(fn.call(component, 'wkt')).toBe('wkt');
    });

    it('normalizeLayerType returns custom for unknown types', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['normalizeLayerType'];

      expect(fn.call(component, 'unknown')).toBe('custom');
      expect(fn.call(component, undefined)).toBe('custom');
      expect(fn.call(component, null)).toBe('custom');
      expect(fn.call(component, '')).toBe('custom');
    });

    // --- toOptionalString ---

    it('toOptionalString converts values correctly', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['toOptionalString'];

      expect(fn.call(component, 'hello')).toBe('hello');
      expect(fn.call(component, 42)).toBe('42');
      expect(fn.call(component, undefined)).toBeUndefined();
      expect(fn.call(component, null)).toBeUndefined();
      expect(fn.call(component, true)).toBe('true');
    });

    // --- toOptionalNumber ---

    it('toOptionalNumber converts values correctly', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['toOptionalNumber'];

      expect(fn.call(component, 42)).toBe(42);
      expect(fn.call(component, '3.14')).toBeCloseTo(3.14);
      expect(fn.call(component, undefined)).toBeUndefined();
      expect(fn.call(component, null)).toBeUndefined();
      expect(fn.call(component, '')).toBeUndefined();
      expect(fn.call(component, 'abc')).toBeUndefined();
      expect(fn.call(component, NaN)).toBeUndefined();
      expect(fn.call(component, Infinity)).toBeUndefined();
    });

    // --- toOptionalBoolean ---

    it('toOptionalBoolean converts truthy strings', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['toOptionalBoolean'];

      expect(fn.call(component, true)).toBe(true);
      expect(fn.call(component, false)).toBe(false);
      expect(fn.call(component, 'true')).toBe(true);
      expect(fn.call(component, '1')).toBe(true);
      expect(fn.call(component, 'yes')).toBe(true);
      expect(fn.call(component, 'y')).toBe(true);
      expect(fn.call(component, 'TRUE')).toBe(true);
      expect(fn.call(component, 'Yes')).toBe(true);
    });

    it('toOptionalBoolean converts falsy strings', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['toOptionalBoolean'];

      expect(fn.call(component, 'false')).toBe(false);
      expect(fn.call(component, '0')).toBe(false);
      expect(fn.call(component, 'no')).toBe(false);
      expect(fn.call(component, 'n')).toBe(false);
      expect(fn.call(component, 'FALSE')).toBe(false);
    });

    it('toOptionalBoolean returns undefined for unrecognized values', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['toOptionalBoolean'];

      expect(fn.call(component, undefined)).toBeUndefined();
      expect(fn.call(component, null)).toBeUndefined();
      expect(fn.call(component, '')).toBeUndefined();
      expect(fn.call(component, 'maybe')).toBeUndefined();
    });

    // --- toCsv ---

    it('toCsv joins array values as CSV', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
      } as any;
      const fn = VMapBuilder.prototype['toCsv'];

      expect(fn.call(component, ['a', 'b', 'c'])).toBe('a,b,c');
      expect(fn.call(component, [1, 2, 3])).toBe('1,2,3');
      expect(fn.call(component, ['only'])).toBe('only');
    });

    it('toCsv filters out empty entries', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
      } as any;
      const fn = VMapBuilder.prototype['toCsv'];

      expect(fn.call(component, ['a', null, '', 'b'])).toBe('a,b');
    });

    it('toCsv returns string as-is for non-array values', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
      } as any;
      const fn = VMapBuilder.prototype['toCsv'];

      expect(fn.call(component, 'a,b,c')).toBe('a,b,c');
      expect(fn.call(component, 42)).toBe('42');
    });

    it('toCsv returns undefined for null/undefined', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
      } as any;
      const fn = VMapBuilder.prototype['toCsv'];

      expect(fn.call(component, undefined)).toBeUndefined();
      expect(fn.call(component, null)).toBeUndefined();
    });

    // --- cleanRecord ---

    it('cleanRecord removes null/undefined entries', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['cleanRecord'];

      const result = fn.call(component, { a: 1, b: null, c: undefined, d: 'test' });
      expect(result).toEqual({ a: 1, d: 'test' });
    });

    it('cleanRecord returns undefined for empty result', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['cleanRecord'];

      expect(fn.call(component, { a: null, b: undefined })).toBeUndefined();
    });

    it('cleanRecord returns undefined for undefined input', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['cleanRecord'];

      expect(fn.call(component, undefined)).toBeUndefined();
    });

    // --- createLayerEl ---

    it('createLayerEl creates osm element via prototype', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;

      const el = VMapBuilder.prototype['createLayerEl'].call(component, {
        id: 'osm-1',
        type: 'osm',
        url: 'https://tile.osm.org/{z}/{x}/{y}.png',
      });
      expect(el.tagName.toLowerCase()).toBe('v-map-layer-osm');
      expect(el.getAttribute('id')).toBe('osm-1');
    });

    it('createLayerEl creates wms element with all attributes via prototype', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;

      const el = VMapBuilder.prototype['createLayerEl'].call(component, {
        id: 'wms-1',
        type: 'wms',
        url: 'https://example.com/wms',
        layers: 'roads',
        visible: true,
        opacity: 0.8,
        zIndex: 5,
        data: {
          transparent: true,
          format: 'image/png',
          version: '1.3.0',
          time: '2024-01-01',
          styles: 'default',
          params: { CQL_FILTER: 'id=1' },
        },
      });
      expect(el.tagName.toLowerCase()).toBe('v-map-layer-wms');
      expect(el.getAttribute('url')).toBe('https://example.com/wms');
      expect(el.getAttribute('layers')).toBe('roads');
      expect(el.getAttribute('transparent')).toBe('true');
      expect(el.getAttribute('format')).toBe('image/png');
      expect(el.getAttribute('version')).toBe('1.3.0');
      expect(el.getAttribute('time')).toBe('2024-01-01');
    });

    it('createLayerEl creates wms-tiled element with tiled=true via prototype', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;

      const el = VMapBuilder.prototype['createLayerEl'].call(component, {
        id: 'wms-tiled-1',
        type: 'wms-tiled',
        url: 'https://example.com/wms',
        layers: 'base',
        data: {},
      });
      expect(el.tagName.toLowerCase()).toBe('v-map-layer-wms');
      expect(el.getAttribute('tiled')).toBe('true');
    });

    it('createLayerEl creates xyz element via prototype', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;

      const el = VMapBuilder.prototype['createLayerEl'].call(component, {
        id: 'xyz-1',
        type: 'xyz',
        url: 'https://tiles/{z}/{x}/{y}.png',
        data: {
          attributions: 'OSM',
          maxZoom: 19,
          tileSize: 256,
          subdomains: 'a,b,c',
        },
      });
      expect(el.tagName.toLowerCase()).toBe('v-map-layer-xyz');
      expect(el.getAttribute('url')).toBe('https://tiles/{z}/{x}/{y}.png');
      expect(el.getAttribute('attributions')).toBe('OSM');
      expect(el.getAttribute('max-zoom')).toBe('19');
      expect(el.getAttribute('tile-size')).toBe('256');
      expect(el.getAttribute('subdomains')).toBe('a,b,c');
    });

    it('createLayerEl creates geojson element via prototype', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;

      const geojson = { type: 'FeatureCollection', features: [] };
      const el = VMapBuilder.prototype['createLayerEl'].call(component, {
        id: 'geojson-1',
        type: 'geojson',
        url: 'https://example.com/data.geojson',
        data: {
          geojson,
          fillColor: '#ff0000',
          strokeWidth: 2,
        },
      });
      expect(el.tagName.toLowerCase()).toBe('v-map-layer-geojson');
      expect(el.getAttribute('url')).toBe('https://example.com/data.geojson');
      expect(el.getAttribute('geojson')).toBe(JSON.stringify(geojson));
      expect(el.getAttribute('fill-color')).toBe('#ff0000');
      expect(el.getAttribute('stroke-width')).toBe('2');
    });

    it('createLayerEl creates scatterplot element via prototype', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;

      const el = VMapBuilder.prototype['createLayerEl'].call(component, {
        id: 'scatter-1',
        type: 'scatterplot',
        data: {
          url: 'https://example.com/points.json',
          getRadius: 10,
          getFillColor: [255, 0, 0],
        },
      });
      expect(el.tagName.toLowerCase()).toBe('v-map-layer-scatterplot');
      expect(el.getAttribute('url')).toBe('https://example.com/points.json');
      expect(el.getAttribute('get-radius')).toBe('10');
    });

    it('createLayerEl creates default/custom element via prototype', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;

      const el = VMapBuilder.prototype['createLayerEl'].call(component, {
        id: 'custom-1',
        type: 'custom',
        data: { myProp: 'val', nested: { x: 1 } },
      });
      expect(el.tagName.toLowerCase()).toBe('v-map-layer-custom');
      expect(el.getAttribute('type')).toBe('custom');
      expect(el.getAttribute('my-prop')).toBe('val');
      expect(el.getAttribute('nested')).toBe(JSON.stringify({ x: 1 }));
    });

    it('createLayerEl attaches style as JSON when present', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;

      const style = { color: 'red', weight: 3 };
      const el = VMapBuilder.prototype['createLayerEl'].call(component, {
        id: 'osm-styled',
        type: 'osm',
        style,
      });
      expect(el.getAttribute('style')).toBe(JSON.stringify(style));
    });

    // --- parseFromSlot ---

    it('parseFromSlot emits configReady on valid JSON script', () => {
      const hostEl = createMockHost();
      const script = document.createElement('script');
      script.type = 'application/json';
      script.textContent = '{"map":{"flavour":"leaflet","layerGroups":[]}}';
      hostEl.appendChild(script);

      const emittedReady: any[] = [];
      const emittedError: any[] = [];

      const component = {
        hostEl,
        current: undefined as any,
        configReady: { emit: (v: any) => emittedReady.push(v) },
        configError: { emit: (v: any) => emittedError.push(v) },
        normalize: VMapBuilder.prototype['normalize'],
        normalizeStyles: VMapBuilder.prototype['normalizeStyles'],
        normalizeStyle: VMapBuilder.prototype['normalizeStyle'],
        normalizeLayer: VMapBuilder.prototype['normalizeLayer'],
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        applyDiff: VMapBuilder.prototype['applyDiff'],
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
        ensureGroup: VMapBuilder.prototype['ensureGroup'],
        createLayerEl: VMapBuilder.prototype['createLayerEl'],
        syncStyles: VMapBuilder.prototype['syncStyles'],
        patchLayer: VMapBuilder.prototype['patchLayer'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
      } as any;

      VMapBuilder.prototype['parseFromSlot'].call(component);

      expect(emittedReady).toHaveLength(1);
      expect(emittedReady[0].map.flavour).toBe('leaflet');
      expect(emittedError).toHaveLength(0);
    });

    it('parseFromSlot emits configError when no script found', () => {
      const hostEl = createMockHost();
      const emittedReady: any[] = [];
      const emittedError: any[] = [];

      const component = {
        hostEl,
        current: undefined,
        configReady: { emit: (v: any) => emittedReady.push(v) },
        configError: { emit: (v: any) => emittedError.push(v) },
      } as any;

      VMapBuilder.prototype['parseFromSlot'].call(component);

      expect(emittedReady).toHaveLength(0);
      expect(emittedError).toHaveLength(1);
      expect(emittedError[0].message).toContain('No configuration <script> found');
    });

    it('parseFromSlot parses YAML script', () => {
      const hostEl = createMockHost();
      const script = document.createElement('script');
      script.type = 'application/yaml';
      script.textContent = 'map:\n  flavour: ol\n  layerGroups: []';
      hostEl.appendChild(script);

      const emittedReady: any[] = [];

      const component = {
        hostEl,
        current: undefined as any,
        configReady: { emit: (v: any) => emittedReady.push(v) },
        configError: { emit: vi.fn() },
        normalize: VMapBuilder.prototype['normalize'],
        normalizeStyles: VMapBuilder.prototype['normalizeStyles'],
        normalizeStyle: VMapBuilder.prototype['normalizeStyle'],
        normalizeLayer: VMapBuilder.prototype['normalizeLayer'],
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        applyDiff: VMapBuilder.prototype['applyDiff'],
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
        ensureGroup: VMapBuilder.prototype['ensureGroup'],
        createLayerEl: VMapBuilder.prototype['createLayerEl'],
        syncStyles: VMapBuilder.prototype['syncStyles'],
        patchLayer: VMapBuilder.prototype['patchLayer'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
      } as any;

      VMapBuilder.prototype['parseFromSlot'].call(component);

      expect(emittedReady).toHaveLength(1);
      expect(emittedReady[0].map.flavour).toBe('ol');
    });

    // --- applyDiff ---

    it('applyDiff creates v-map element and populates it', () => {
      const hostEl = createMockHost();

      const component = {
        hostEl,
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
        ensureGroup: VMapBuilder.prototype['ensureGroup'],
        createLayerEl: VMapBuilder.prototype['createLayerEl'],
        syncStyles: VMapBuilder.prototype['syncStyles'],
        patchLayer: VMapBuilder.prototype['patchLayer'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
      } as any;

      const cfg = {
        map: {
          flavour: 'ol',
          id: 'map1',
          zoom: 5,
          center: '8,49',
          style: '',
          styles: [],
          layerGroups: [
            {
              groupTitle: 'Base',
              basemapid: '',
              visible: true,
              layers: [
                { id: 'osm-1', type: 'osm' as const, visible: true },
              ],
            },
          ],
        },
      };

      VMapBuilder.prototype['applyDiff'].call(component, undefined, cfg);

      const mapEl = hostEl.querySelector('v-map');
      expect(mapEl).not.toBeNull();
      expect(mapEl!.getAttribute('flavour')).toBe('ol');
      expect(mapEl!.getAttribute('zoom')).toBe('5');
      expect(mapEl!.getAttribute('center')).toBe('8,49');

      const groupEl = mapEl!.querySelector('v-map-layergroup');
      expect(groupEl).not.toBeNull();
      expect(groupEl!.getAttribute('group-title')).toBe('Base');

      const osmEl = groupEl!.querySelector('#osm-1');
      expect(osmEl).not.toBeNull();
      expect(osmEl!.tagName.toLowerCase()).toBe('v-map-layer-osm');
    });

    it('applyDiff removes obsolete layer groups', () => {
      const hostEl = createMockHost();

      const component = {
        hostEl,
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
        ensureGroup: VMapBuilder.prototype['ensureGroup'],
        createLayerEl: VMapBuilder.prototype['createLayerEl'],
        syncStyles: VMapBuilder.prototype['syncStyles'],
        patchLayer: VMapBuilder.prototype['patchLayer'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
      } as any;

      const initial = {
        map: {
          flavour: 'ol',
          id: 'map1',
          zoom: 2,
          center: '0,0',
          style: '',
          styles: [],
          layerGroups: [
            { groupTitle: 'Keep', basemapid: '', layers: [] },
            { groupTitle: 'Remove', basemapid: '', layers: [] },
          ],
        },
      };

      VMapBuilder.prototype['applyDiff'].call(component, undefined, initial);

      const mapEl = hostEl.querySelector('v-map')!;
      expect(mapEl.querySelectorAll('v-map-layergroup')).toHaveLength(2);

      const next = {
        map: {
          flavour: 'ol',
          id: 'map1',
          zoom: 2,
          center: '0,0',
          style: '',
          styles: [],
          layerGroups: [
            { groupTitle: 'Keep', basemapid: '', layers: [] },
          ],
        },
      };

      VMapBuilder.prototype['applyDiff'].call(component, initial, next);
      expect(mapEl.querySelectorAll('v-map-layergroup')).toHaveLength(1);
      expect(mapEl.querySelector('v-map-layergroup')!.getAttribute('group-title')).toBe('Keep');
    });

    // --- componentDidLoad / onMapConfigChanged / onSlotChange ---

    it('componentDidLoad calls parseFromSlot', () => {
      const parseFromSlotSpy = vi.fn();
      const component = {
        parseFromSlot: parseFromSlotSpy,
      } as any;

      VMapBuilder.prototype['componentDidLoad'].call(component);
      expect(parseFromSlotSpy).toHaveBeenCalledTimes(1);
    });

    it('onMapConfigChanged calls parseFromSlot', async () => {
      const parseFromSlotSpy = vi.fn();
      const component = {
        parseFromSlot: parseFromSlotSpy,
      } as any;

      await VMapBuilder.prototype.onMapConfigChanged.call(component, 'old', 'new');
      expect(parseFromSlotSpy).toHaveBeenCalledTimes(1);
    });

    it('onSlotChange calls parseFromSlot', () => {
      const parseFromSlotSpy = vi.fn();
      // Access the arrow function via instance property pattern
      // onSlotChange is an arrow function on the instance, not the prototype
      // We must test it via a constructed instance approach
      const inst = new (VMapBuilder as any)();
      inst.parseFromSlot = parseFromSlotSpy;
      inst.onSlotChange();
      expect(parseFromSlotSpy).toHaveBeenCalledTimes(1);
    });

    it('render returns a virtual DOM node', () => {
      const component = {} as any;
      const result = VMapBuilder.prototype.render.call(component);
      expect(result).toBeTruthy();
    });

    // --- ensureAttr ---

    it('ensureAttr sets, updates, and removes attributes', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['ensureAttr'];
      const el = document.createElement('div');

      // Set attribute
      fn.call(component, el, 'data-test', 'value');
      expect(el.getAttribute('data-test')).toBe('value');

      // Update attribute
      fn.call(component, el, 'data-test', 'newvalue');
      expect(el.getAttribute('data-test')).toBe('newvalue');

      // Remove attribute
      fn.call(component, el, 'data-test', undefined);
      expect(el.hasAttribute('data-test')).toBe(false);

      // No-op when value is null and attribute already missing
      fn.call(component, el, 'data-test', null);
      expect(el.hasAttribute('data-test')).toBe(false);
    });

    // --- ensureGroup ---

    it('ensureGroup creates a new group element', () => {
      const component = {
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;
      const fn = VMapBuilder.prototype['ensureGroup'];
      const mapEl = document.createElement('v-map');

      const group = fn.call(component, mapEl, 'Base', 'basemap1', true, 0);
      expect(group.tagName.toLowerCase()).toBe('v-map-layergroup');
      expect(group.getAttribute('group-title')).toBe('Base');
      expect(group.getAttribute('basemapid')).toBe('basemap1');
      expect(group.getAttribute('visible')).toBe('true');
    });

    it('ensureGroup reuses existing group element', () => {
      const component = {
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;
      const fn = VMapBuilder.prototype['ensureGroup'];
      const mapEl = document.createElement('v-map');

      const existing = document.createElement('v-map-layergroup');
      existing.setAttribute('group-title', 'Base');
      mapEl.appendChild(existing);

      const group = fn.call(component, mapEl, 'Base', '', undefined, 0);
      expect(group).toBe(existing);
    });

    // --- toKebabCase ---

    it('toKebabCase converts correctly via prototype', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['toKebabCase'];

      expect(fn.call(component, 'fooBar')).toBe('foo-bar');
      expect(fn.call(component, 'foo_bar')).toBe('foo-bar');
      expect(fn.call(component, 'FooBarBaz')).toBe('foo-bar-baz');
      expect(fn.call(component, 'already-kebab')).toBe('already-kebab');
    });

    // --- normalizeStyle ---

    it('normalizeStyle handles string entry as content', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeStyle'];

      const result = fn.call(component, '<StyledLayerDescriptor />', 0);
      expect(result).toBeDefined();
      expect(result!.content).toBe('<StyledLayerDescriptor />');
      expect(result!.key).toBe('style-1');
      expect(result!.format).toBe('sld');
    });

    it('normalizeStyle handles source as URL', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeStyle'];

      const result = fn.call(component, {
        source: 'https://example.com/style.sld',
      }, 0);
      expect(result).toBeDefined();
      expect(result!.src).toBe('https://example.com/style.sld');
      expect(result!.content).toBeUndefined();
    });

    it('normalizeStyle handles source as inline content', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeStyle'];

      const result = fn.call(component, {
        source: '{"version":8}',
        format: 'mapbox-gl',
      }, 0);
      expect(result).toBeDefined();
      expect(result!.content).toBe('{"version":8}');
      expect(result!.src).toBeUndefined();
    });

    it('normalizeStyle returns undefined for null entry', () => {
      const component = {} as any;
      const fn = VMapBuilder.prototype['normalizeStyle'];

      expect(fn.call(component, null, 0)).toBeUndefined();
    });

    it('normalizeStyle returns undefined for object without src or content', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeStyle'];

      expect(fn.call(component, { format: 'sld' }, 0)).toBeUndefined();
    });

    it('normalizeStyle handles relative source paths', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeStyle'];

      const result1 = fn.call(component, { source: './styles/main.sld' }, 0);
      expect(result1!.src).toBe('./styles/main.sld');

      const result2 = fn.call(component, { source: '../styles/main.sld' }, 0);
      expect(result2!.src).toBe('../styles/main.sld');

      const result3 = fn.call(component, { source: '/styles/main.sld' }, 0);
      expect(result3!.src).toBe('/styles/main.sld');
    });

    it('normalizeStyle handles layerTargets as string with spaces', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeStyle'];

      const result = fn.call(component, {
        content: '<sld/>',
        layerTargets: ' layer-a , layer-b , ',
      }, 0);
      expect(result!.layerTargets).toBe('layer-a,layer-b');
    });

    it('normalizeStyle handles autoApply values', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeStyle'];

      const r1 = fn.call(component, { content: '<sld/>', autoApply: true }, 0);
      expect(r1!.autoApply).toBe(true);

      const r2 = fn.call(component, { content: '<sld/>', autoApply: 'false' }, 0);
      expect(r2!.autoApply).toBe(false);

      const r3 = fn.call(component, { content: '<sld/>', autoApply: undefined }, 0);
      expect(r3!.autoApply).toBeUndefined();
    });

    // --- patchLayer via prototype ---

    it('patchLayer handles url change via prototype', () => {
      const component = {
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
        createLayerEl: VMapBuilder.prototype['createLayerEl'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
      } as any;

      const el = document.createElement('v-map-layer-wms');
      el.setAttribute('url', 'https://old.com/wms');

      VMapBuilder.prototype['patchLayer'].call(component, el, {
        url: { old: 'https://old.com/wms', new: 'https://new.com/wms' },
      }, { id: 'wms-1', type: 'wms' } as any);

      expect(el.getAttribute('url')).toBe('https://new.com/wms');
    });

    // --- syncStyles via prototype ---

    it('syncStyles creates and removes style elements via prototype', () => {
      const component = {
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;

      const mapEl = document.createElement('v-map');

      const styles = [
        { key: 'style-1', format: 'sld', content: '<sld/>', autoApply: true as boolean | undefined },
        { key: 'style-2', format: 'mapbox-gl', content: '{"version":8}', autoApply: undefined as boolean | undefined },
      ];

      VMapBuilder.prototype['syncStyles'].call(component, mapEl, styles);

      const created = mapEl.querySelectorAll('v-map-style[data-builder-style="true"]');
      expect(created).toHaveLength(2);
      expect(created[0].getAttribute('data-builder-style-id')).toBe('style-1');
      expect(created[1].getAttribute('data-builder-style-id')).toBe('style-2');

      // Now update: remove style-1, keep style-2
      VMapBuilder.prototype['syncStyles'].call(component, mapEl, [
        { key: 'style-2', format: 'mapbox-gl', content: '{"version":9}' },
      ]);

      const remaining = mapEl.querySelectorAll('v-map-style[data-builder-style="true"]');
      expect(remaining).toHaveLength(1);
      expect(remaining[0].getAttribute('content')).toBe('{"version":9}');
    });

    // --- normalizeLayer via prototype ---

    it('normalizeLayer generates id from indices when no id provided', () => {
      const component = {
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeLayer'];

      const result = fn.call(component, { type: 'osm' }, 2, 3);
      expect(result.id).toBe('3-4');
    });

    it('normalizeLayer normalizes wms layer correctly', () => {
      const component = {
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeLayer'];

      const result = fn.call(component, {
        id: 'wms-1',
        type: 'wms',
        url: 'https://example.com/wms',
        sublayers: 'roads',
        transparent: 'true',
        extraParams: { ENV: 'test' },
      }, 0, 0);

      expect(result.type).toBe('wms');
      expect(result.url).toBe('https://example.com/wms');
      expect(result.layers).toBe('roads');
      expect(result.data).toEqual(expect.objectContaining({
        transparent: true,
        params: { ENV: 'test' },
      }));
    });

    it('normalizeLayer normalizes osm layer with url', () => {
      const component = {
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeLayer'];

      const result = fn.call(component, {
        id: 'osm-1',
        type: 'osm',
        url: 'https://tile.osm.org/{z}/{x}/{y}.png',
      }, 0, 0);

      expect(result.type).toBe('osm');
      expect(result.url).toBe('https://tile.osm.org/{z}/{x}/{y}.png');
    });

    it('normalizeLayer handles custom type with data object', () => {
      const component = {
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeLayer'];

      const result = fn.call(component, {
        id: 'custom-1',
        type: 'something-else',
        data: { foo: 'bar', baz: 42 },
      }, 0, 0);

      expect(result.type).toBe('custom');
      expect(result.data).toEqual(expect.objectContaining({ foo: 'bar', baz: 42 }));
    });

    it('normalizeLayer handles layer with style property', () => {
      const component = {
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeLayer'];

      const result = fn.call(component, {
        id: 'osm-styled',
        type: 'osm',
        style: { color: 'blue' },
      }, 0, 0);

      expect(result.style).toEqual({ color: 'blue' });
    });

    // --- normalizeLayer: additional branch coverage ---

    function makeNormCtx() {
      return {
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
      } as any;
    }

    it('normalizeLayer normalizes geojson layer', () => {
      const result = VMapBuilder.prototype['normalizeLayer'].call(makeNormCtx(), {
        id: 'gj-1',
        type: 'geojson',
        url: 'https://example.com/data.geojson',
        fillColor: '#ff0000',
        fillOpacity: '0.5',
        strokeColor: '#000',
        strokeWidth: '2',
        strokeOpacity: '0.8',
        pointRadius: '10',
        pointColor: '#0f0',
        iconUrl: 'https://icon.png',
        iconSize: '24,24',
        textProperty: 'name',
        textColor: '#333',
        textSize: '14',
        data: { type: 'FeatureCollection', features: [] },
      }, 0, 0);

      expect(result.type).toBe('geojson');
      expect(result.url).toBe('https://example.com/data.geojson');
      expect(result.data).toEqual(expect.objectContaining({
        geojson: { type: 'FeatureCollection', features: [] },
        fillColor: '#ff0000',
        fillOpacity: 0.5,
        strokeColor: '#000',
        strokeWidth: 2,
        strokeOpacity: 0.8,
        pointRadius: 10,
        pointColor: '#0f0',
        iconUrl: 'https://icon.png',
        iconSize: '24,24',
        textProperty: 'name',
        textColor: '#333',
        textSize: 14,
      }));
    });

    it('normalizeLayer normalizes xyz layer', () => {
      const result = VMapBuilder.prototype['normalizeLayer'].call(makeNormCtx(), {
        id: 'xyz-1',
        type: 'xyz',
        url: 'https://tiles/{z}/{x}/{y}.png',
        attributions: 'OSM',
        maxZoom: '19',
        tileSize: '256',
        subdomains: ['a', 'b', 'c'],
      }, 0, 0);

      expect(result.type).toBe('xyz');
      expect(result.url).toBe('https://tiles/{z}/{x}/{y}.png');
      expect(result.data).toEqual(expect.objectContaining({
        attributions: 'OSM',
        maxZoom: 19,
        tileSize: 256,
        subdomains: 'a,b,c',
      }));
    });

    it('normalizeLayer normalizes terrain layer with nested data', () => {
      const result = VMapBuilder.prototype['normalizeLayer'].call(makeNormCtx(), {
        id: 't-1',
        type: 'terrain',
        data: {
          elevationData: 'https://elevation.png',
          texture: 'https://texture.png',
          wireframe: 'yes',
          minZoom: '2',
          maxZoom: '14',
          meshMaxError: '5',
          color: '#ff0000',
        },
      }, 0, 0);

      expect(result.type).toBe('terrain');
      expect(result.data).toEqual(expect.objectContaining({
        elevationData: 'https://elevation.png',
        texture: 'https://texture.png',
        wireframe: true,
        minZoom: 2,
        maxZoom: 14,
        meshMaxError: 5,
        color: '#ff0000',
      }));
    });

    it('normalizeLayer normalizes wfs layer', () => {
      const result = VMapBuilder.prototype['normalizeLayer'].call(makeNormCtx(), {
        id: 'wfs-1',
        type: 'wfs',
        url: 'https://example.com/wfs',
        layerName: 'ns:roads',
        crs: 'EPSG:4326',
        version: '2.0.0',
        format: 'application/json',
        params: { maxFeatures: 100 },
      }, 0, 0);

      expect(result.type).toBe('wfs');
      expect(result.url).toBe('https://example.com/wfs');
      expect(result.data).toEqual(expect.objectContaining({
        url: 'https://example.com/wfs',
        typeName: 'ns:roads',
        srsName: 'EPSG:4326',
        version: '2.0.0',
        outputFormat: 'application/json',
        params: { maxFeatures: 100 },
      }));
    });

    it('normalizeLayer normalizes wcs layer', () => {
      const result = VMapBuilder.prototype['normalizeLayer'].call(makeNormCtx(), {
        id: 'wcs-1',
        type: 'wcs',
        url: 'https://example.com/wcs',
        coverageName: 'dem',
        format: 'image/tiff',
        version: '2.0.1',
        projection: 'EPSG:4326',
        resolutions: [256, 256],
        params: { subset: 'time' },
      }, 0, 0);

      expect(result.type).toBe('wcs');
      expect(result.url).toBe('https://example.com/wcs');
      expect(result.data).toEqual(expect.objectContaining({
        url: 'https://example.com/wcs',
        coverageName: 'dem',
        format: 'image/tiff',
        version: '2.0.1',
        projection: 'EPSG:4326',
        resolutions: [256, 256],
        params: { subset: 'time' },
      }));
    });

    it('normalizeLayer normalizes google layer', () => {
      const result = VMapBuilder.prototype['normalizeLayer'].call(makeNormCtx(), {
        id: 'g-1',
        type: 'google',
        apiKey: 'key123',
        mapType: 'satellite',
        language: 'en',
        region: 'US',
        scale: 2,
        libraries: ['places', 'geometry'],
        maxZoom: '20',
        styles: [{ featureType: 'water' }],
      }, 0, 0);

      expect(result.type).toBe('google');
      expect(result.data).toEqual(expect.objectContaining({
        apiKey: 'key123',
        mapType: 'satellite',
        language: 'en',
        region: 'US',
        libraries: 'places,geometry',
        maxZoom: 20,
        styles: [{ featureType: 'water' }],
      }));
    });

    it('normalizeLayer normalizes geotiff layer', () => {
      const result = VMapBuilder.prototype['normalizeLayer'].call(makeNormCtx(), {
        id: 'gt-1',
        type: 'geotiff',
        url: 'https://example.com/dem.tif',
      }, 0, 0);

      expect(result.type).toBe('geotiff');
      expect(result.url).toBe('https://example.com/dem.tif');
    });

    it('normalizeLayer normalizes tile3d layer', () => {
      const result = VMapBuilder.prototype['normalizeLayer'].call(makeNormCtx(), {
        id: 't3d-1',
        type: 'tile3d',
        url: 'https://example.com/tileset.json',
        options: { maximumScreenSpaceError: 8 },
        cesiumStyle: { color: 'red' },
      }, 0, 0);

      expect(result.type).toBe('tile3d');
      expect(result.url).toBe('https://example.com/tileset.json');
      expect(result.data).toEqual(expect.objectContaining({
        tilesetOptions: { maximumScreenSpaceError: 8 },
        style: { color: 'red' },
      }));
    });

    it('normalizeLayer normalizes scatterplot layer', () => {
      const result = VMapBuilder.prototype['normalizeLayer'].call(makeNormCtx(), {
        id: 'sp-1',
        type: 'scatterplot',
        url: 'https://example.com/data.json',
        data: [{ position: [7, 50] }],
        getFillColor: [255, 0, 0],
        getRadius: '5',
      }, 0, 0);

      expect(result.type).toBe('scatterplot');
      expect(result.data).toEqual(expect.objectContaining({
        url: 'https://example.com/data.json',
        data: [{ position: [7, 50] }],
        getRadius: 5,
      }));
    });

    it('normalizeLayer normalizes wkt layer', () => {
      const result = VMapBuilder.prototype['normalizeLayer'].call(makeNormCtx(), {
        id: 'wkt-1',
        type: 'wkt',
        wkt: 'POINT(7 50)',
        url: 'https://example.com/data.wkt',
        fillColor: '#ff0000',
        fillOpacity: '0.4',
        strokeColor: '#000',
        strokeWidth: '2',
        strokeOpacity: '0.8',
        pointRadius: '12',
        pointColor: '#0f0',
        iconUrl: 'https://icon.png',
        iconSize: '32,32',
        textProperty: 'name',
        textColor: '#333',
        textSize: '11',
      }, 0, 0);

      expect(result.type).toBe('wkt');
      expect(result.data).toEqual(expect.objectContaining({
        wkt: 'POINT(7 50)',
        url: 'https://example.com/data.wkt',
        fillColor: '#ff0000',
        fillOpacity: 0.4,
        strokeColor: '#000',
        strokeWidth: 2,
        strokeOpacity: 0.8,
        pointRadius: 12,
        pointColor: '#0f0',
        iconUrl: 'https://icon.png',
        iconSize: '32,32',
        textProperty: 'name',
        textColor: '#333',
        textSize: 11,
      }));
    });

    it('normalizeLayer normalizes wms-tiled with tiled=true', () => {
      const result = VMapBuilder.prototype['normalizeLayer'].call(makeNormCtx(), {
        id: 'wt-1',
        type: 'wms-tiled',
        url: 'https://example.com/wms',
        layers: 'base',
        styles: 'default',
        format: 'image/png',
        transparent: 'true',
        version: '1.3.0',
        time: '2024-01-01',
        params: { CQL: 'test' },
      }, 0, 0);

      expect(result.type).toBe('wms-tiled');
      expect(result.tiled).toBe(true);
      expect(result.data).toEqual(expect.objectContaining({
        tiled: true,
        styles: 'default',
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        time: '2024-01-01',
        params: { CQL: 'test' },
      }));
    });

    it('normalizeLayer handles custom type without data object', () => {
      const result = VMapBuilder.prototype['normalizeLayer'].call(makeNormCtx(), {
        id: 'c-1',
        type: 'unknown-type',
        foo: 'bar',
        baz: 42,
      }, 0, 0);

      expect(result.type).toBe('custom');
      // When data is not an object, the rawLayer itself is used as payload
      expect(result.data).toEqual(expect.objectContaining({ foo: 'bar', baz: 42 }));
    });

    // --- normalizeStyles ---

    it('normalizeStyles normalizes array of styles', () => {
      const component = {
        normalizeStyle: VMapBuilder.prototype['normalizeStyle'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
      } as any;

      const result = VMapBuilder.prototype['normalizeStyles'].call(component, [
        '<sld/>',
        { content: '{"version":8}', format: 'mapbox-gl' },
      ]);
      expect(result).toHaveLength(2);
      expect(result[0].content).toBe('<sld/>');
      expect(result[1].format).toBe('mapbox-gl');
    });

    it('normalizeStyles wraps single value in array', () => {
      const component = {
        normalizeStyle: VMapBuilder.prototype['normalizeStyle'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
      } as any;

      const result = VMapBuilder.prototype['normalizeStyles'].call(component, '<sld/>');
      expect(result).toHaveLength(1);
      expect(result[0].content).toBe('<sld/>');
    });

    it('normalizeStyles returns empty array for empty input', () => {
      const component = {
        normalizeStyle: VMapBuilder.prototype['normalizeStyle'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
      } as any;

      const result = VMapBuilder.prototype['normalizeStyles'].call(component, undefined);
      expect(result).toEqual([]);
    });

    // --- additional createLayerEl branches ---

    function makeCreateCtx() {
      return {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;
    }

    it('createLayerEl creates terrain element with elevationDecoder as string', () => {
      const el = VMapBuilder.prototype['createLayerEl'].call(makeCreateCtx(), {
        id: 'terr-dec',
        type: 'terrain',
        data: {
          elevationData: 'https://el.png',
          elevationDecoder: '{"rScaler":1}',
        },
      });
      expect(el.tagName.toLowerCase()).toBe('v-map-layer-terrain');
      expect(el.getAttribute('elevation-decoder')).toBe('{"rScaler":1}');
    });

    it('createLayerEl creates terrain element with elevationDecoder as object', () => {
      const decoder = { rScaler: 6553.6, gScaler: 25.6 };
      const el = VMapBuilder.prototype['createLayerEl'].call(makeCreateCtx(), {
        id: 'terr-dec2',
        type: 'terrain',
        data: {
          elevationData: 'https://el.png',
          elevationDecoder: decoder,
        },
      });
      expect(el.getAttribute('elevation-decoder')).toBe(JSON.stringify(decoder));
    });

    it('createLayerEl handles terrain with color as non-array', () => {
      const el = VMapBuilder.prototype['createLayerEl'].call(makeCreateCtx(), {
        id: 'terr-c',
        type: 'terrain',
        data: { elevationData: 'https://el.png', color: '#ff0000' },
      });
      expect(el.getAttribute('color')).toBe('#ff0000');
    });

    it('createLayerEl handles terrain with color as array', () => {
      const el = VMapBuilder.prototype['createLayerEl'].call(makeCreateCtx(), {
        id: 'terr-ca',
        type: 'terrain',
        data: { elevationData: 'https://el.png', color: [255, 0, 0] },
      });
      expect(el.getAttribute('color')).toBe(JSON.stringify([255, 0, 0]));
    });

    it('createLayerEl creates wcs element with string params and resolutions', () => {
      const el = VMapBuilder.prototype['createLayerEl'].call(makeCreateCtx(), {
        id: 'wcs-s',
        type: 'wcs',
        data: {
          url: 'https://wcs',
          coverageName: 'dem',
          resolutions: '256,256',
          params: 'subset=time',
        },
      });
      expect(el.getAttribute('resolutions')).toBe('256,256');
      expect(el.getAttribute('params')).toBe('subset=time');
    });

    it('createLayerEl creates google element with string styles', () => {
      const el = VMapBuilder.prototype['createLayerEl'].call(makeCreateCtx(), {
        id: 'g-s',
        type: 'google',
        data: { apiKey: 'k', styles: '[{"featureType":"water"}]' },
      });
      expect(el.getAttribute('styles')).toBe('[{"featureType":"water"}]');
    });

    it('createLayerEl creates tile3d element with string tilesetOptions', () => {
      const el = VMapBuilder.prototype['createLayerEl'].call(makeCreateCtx(), {
        id: 't3d-s',
        type: 'tile3d',
        url: 'https://tileset.json',
        data: { tilesetOptions: '{"maxError":8}' },
      });
      expect(el.getAttribute('tileset-options')).toBe('{"maxError":8}');
    });

    it('createLayerEl creates scatterplot element with string data', () => {
      const el = VMapBuilder.prototype['createLayerEl'].call(makeCreateCtx(), {
        id: 'sp-s',
        type: 'scatterplot',
        data: { data: '[{"pos":[7,50]}]' },
      });
      expect(el.getAttribute('data')).toBe('[{"pos":[7,50]}]');
    });

    it('createLayerEl creates wkt element with object wkt', () => {
      const el = VMapBuilder.prototype['createLayerEl'].call(makeCreateCtx(), {
        id: 'wkt-o',
        type: 'wkt',
        data: { wkt: { type: 'something' } },
      });
      expect(el.getAttribute('wkt')).toBe(JSON.stringify({ type: 'something' }));
    });

    // --- patchLayer: additional branches ---

    it('patchLayer replaces element for data change on known type via prototype', () => {
      const ctx = {
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
        createLayerEl: VMapBuilder.prototype['createLayerEl'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
      } as any;

      const parent = document.createElement('div');
      const oldEl = document.createElement('v-map-layer-terrain');
      oldEl.setAttribute('id', 'terrain-1');
      parent.appendChild(oldEl);

      VMapBuilder.prototype['patchLayer'].call(ctx, oldEl, {
        data: {
          old: { elevationData: 'old.png' },
          new: { elevationData: 'new.png' },
        },
      }, { id: 'terrain-1', type: 'terrain', data: { elevationData: 'new.png' } } as any);

      expect(parent.querySelector('v-map-layer-terrain')).not.toBeNull();
      expect(parent.querySelector('v-map-layer-terrain')!.getAttribute('elevation-data')).toBe('new.png');
    });

    it('patchLayer falls back to attribute for data change on custom type via prototype', () => {
      const ctx = {
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
        createLayerEl: VMapBuilder.prototype['createLayerEl'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
      } as any;

      const parent = document.createElement('div');
      const el = document.createElement('v-map-layer-custom') as any;
      el.setAttribute('id', 'c-1');
      parent.appendChild(el);

      VMapBuilder.prototype['patchLayer'].call(ctx, el, {
        data: { old: undefined, new: { key: 'val' } },
      }, { id: 'c-1', type: 'custom', data: { key: 'val' } } as any);

      expect(el.getAttribute('data')).toBe(JSON.stringify({ key: 'val' }));
    });

    it('patchLayer calls setData when method exists via prototype', () => {
      const ctx = {
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
        createLayerEl: VMapBuilder.prototype['createLayerEl'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
      } as any;

      const parent = document.createElement('div');
      const el = document.createElement('v-map-layer-custom') as any;
      el.setAttribute('id', 'c-2');
      parent.appendChild(el);
      el.setData = vi.fn();

      VMapBuilder.prototype['patchLayer'].call(ctx, el, {
        data: { old: undefined, new: { key: 'val' } },
      }, { id: 'c-2', type: 'custom', data: { key: 'val' } } as any);

      expect(el.setData).toHaveBeenCalledWith({ key: 'val' });
    });

    it('patchLayer replaces element for type change via prototype', () => {
      const ctx = {
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
        createLayerEl: VMapBuilder.prototype['createLayerEl'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
      } as any;

      const parent = document.createElement('div');
      const oldEl = document.createElement('v-map-layer-osm');
      oldEl.setAttribute('id', 'l-1');
      parent.appendChild(oldEl);

      VMapBuilder.prototype['patchLayer'].call(ctx, oldEl, {
        type: { old: 'osm', new: 'wms' },
      }, { id: 'l-1', type: 'wms', url: 'https://wms', layers: 'base' } as any);

      expect(parent.querySelector('v-map-layer-osm')).toBeNull();
      expect(parent.querySelector('v-map-layer-wms')).not.toBeNull();
    });

    // --- applyDiff: with actual diffing ---

    it('applyDiff handles update and move of existing layers via prototype', () => {
      const hostEl = createMockHost();
      const ctx = {
        hostEl,
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
        ensureGroup: VMapBuilder.prototype['ensureGroup'],
        createLayerEl: VMapBuilder.prototype['createLayerEl'],
        syncStyles: VMapBuilder.prototype['syncStyles'],
        patchLayer: VMapBuilder.prototype['patchLayer'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
      } as any;

      const initial = {
        map: {
          flavour: 'ol', id: 'map1', zoom: 5, center: '8,49', style: '',
          styles: [],
          layerGroups: [{
            groupTitle: 'Base', basemapid: '', layers: [
              { id: 'a', type: 'osm' as const, visible: true },
              { id: 'b', type: 'osm' as const, visible: true },
              { id: 'c', type: 'osm' as const, visible: true },
            ],
          }],
        },
      };

      VMapBuilder.prototype['applyDiff'].call(ctx, undefined, initial);

      const groupEl = hostEl.querySelector('v-map')!.querySelector('v-map-layergroup')!;
      expect(groupEl.children).toHaveLength(3);
      expect(groupEl.children[0].getAttribute('id')).toBe('a');

      // Reorder: c, a, b — and update visibility of a
      const next = {
        map: {
          flavour: 'ol', id: 'map1', zoom: 5, center: '8,49', style: '',
          styles: [],
          layerGroups: [{
            groupTitle: 'Base', basemapid: '', layers: [
              { id: 'c', type: 'osm' as const, visible: true },
              { id: 'a', type: 'osm' as const, visible: false },
              { id: 'b', type: 'osm' as const, visible: true },
            ],
          }],
        },
      };

      VMapBuilder.prototype['applyDiff'].call(ctx, initial, next);

      expect(groupEl.children[0].getAttribute('id')).toBe('c');
      expect(groupEl.children[1].getAttribute('id')).toBe('a');
      expect(groupEl.children[2].getAttribute('id')).toBe('b');
    });

    // --- has correct default property values ---

    it('has correct default property values', () => {
      const instance = new (VMapBuilder as any)();
      expect(instance.mapconfig).toBeUndefined();
    });

    // --- additional branch coverage ---

    it('normalize handles layerGroup with non-array layers (line 422 false branch)', () => {
      const component = {
        hostEl: createMockHost(),
        normalizeStyles: VMapBuilder.prototype['normalizeStyles'],
        normalizeStyle: VMapBuilder.prototype['normalizeStyle'],
        normalizeLayer: VMapBuilder.prototype['normalizeLayer'],
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
      } as any;
      const result = VMapBuilder.prototype['normalize'].call(component, {
        map: {
          layerGroups: [
            {
              groupTitle: 'NoLayers',
              layers: 'not-an-array', // triggers false branch of Array.isArray(g.layers)
            },
          ],
        },
      });
      expect(result.map.layerGroups[0].groupTitle).toBe('NoLayers');
      expect(result.map.layerGroups[0].layers).toEqual([]);
    });

    it('normalize handles layerGroup using fallback title from g.group (line 419)', () => {
      const component = {
        hostEl: createMockHost(),
        normalizeStyles: VMapBuilder.prototype['normalizeStyles'],
        normalizeStyle: VMapBuilder.prototype['normalizeStyle'],
        normalizeLayer: VMapBuilder.prototype['normalizeLayer'],
        normalizeLayerType: VMapBuilder.prototype['normalizeLayerType'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
      } as any;
      const result = VMapBuilder.prototype['normalize'].call(component, {
        map: {
          layerGroups: [
            { group: 'FromGroup', layers: [] },
            { title: 'FromTitle', layers: [] },
            { layers: [] }, // no title at all => fallback "Group 3"
          ],
        },
      });
      expect(result.map.layerGroups[0].groupTitle).toBe('FromGroup');
      expect(result.map.layerGroups[1].groupTitle).toBe('FromTitle');
      expect(result.map.layerGroups[2].groupTitle).toBe('Group 3');
    });

    it('normalizeStyle handles Array layerTargets that filter to empty (line 457-460)', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeStyle'];

      // Array with all-empty entries => layerTargets should be undefined
      const result = fn.call(component, {
        content: '<sld/>',
        layerTargets: ['', '  ', ''],
      }, 0);
      expect(result).toBeDefined();
      expect(result!.layerTargets).toBeUndefined();

      // Array with valid entries
      const result2 = fn.call(component, {
        content: '<sld/>',
        layerTargets: ['layer-a', 'layer-b'],
      }, 0);
      expect(result2!.layerTargets).toBe('layer-a,layer-b');
    });

    it('normalizeStyle covers string entry branch when content is empty (line 499-500)', () => {
      const component = {
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
      } as any;
      const fn = VMapBuilder.prototype['normalizeStyle'];

      // Entry is an empty string "":
      // raw = { content: "" }, content = String("") = "" (falsy)
      // !src && !content => true
      // typeof entry === 'string' => true => line 500 executes
      const result = fn.call(component, '', 0);
      // Returns a NormalizedStyle with content = ""
      expect(result).toBeDefined();
      expect(result!.content).toBe('');
      expect(result!.key).toBe('style-1');
    });

    it('syncStyles repositions connected element before reference (lines 573-574)', () => {
      const component = {
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
      } as any;

      const mapEl = document.createElement('v-map');
      // Attach to document so children have isConnected = true
      document.body.appendChild(mapEl);

      try {
        // Create an existing style that's already a child of mapEl (and isConnected=true)
        const existingStyle = document.createElement('v-map-style');
        existingStyle.setAttribute('data-builder-style', 'true');
        existingStyle.setAttribute('data-builder-style-id', 'style-a');
        mapEl.appendChild(existingStyle);

        // Add a non-builder child (anchor) AFTER the style
        const layerGroup = document.createElement('v-map-layergroup');
        mapEl.appendChild(layerGroup);

        // Verify preconditions: style is connected and parent is mapEl
        expect(existingStyle.isConnected).toBe(true);
        expect(existingStyle.parentElement).toBe(mapEl);

        // Now sync with the same style
        // The anchor (first non-builder-style child) is layerGroup
        // reference = anchor && anchor.parentElement === mapEl ? anchor : null => layerGroup
        // el.isConnected = true, el.parentElement === mapEl => first if is false
        // reference is truthy => else if (reference) => true => lines 573-574 executed
        const styles = [
          { key: 'style-a', format: 'sld', content: '<updated/>', autoApply: true },
        ];

        VMapBuilder.prototype['syncStyles'].call(component, mapEl, styles);

        const styleEl = mapEl.querySelector('v-map-style[data-builder-style-id="style-a"]');
        expect(styleEl).not.toBeNull();
        expect(styleEl!.getAttribute('content')).toBe('<updated/>');
        // Style should be before the layerGroup (inserted before anchor)
        expect(mapEl.children[0].tagName.toLowerCase()).toBe('v-map-style');
        expect(mapEl.children[1].tagName.toLowerCase()).toBe('v-map-layergroup');
      } finally {
        document.body.removeChild(mapEl);
      }
    });

    it('add() falls back to String() when JSON.stringify throws (line 646)', () => {
      const ctx = makeCreateCtx();

      // The only call site using { json: true } is terrain's elevationDecoder
      // Create a circular reference object that will cause JSON.stringify to throw
      const circular: any = { rScaler: 1 };
      circular.self = circular;

      const layer = {
        id: 'terrain-circ',
        type: 'terrain',
        data: {
          elevationData: 'https://el.png',
          elevationDecoder: circular, // non-string, will trigger { json: true } and JSON.stringify will throw
        },
      };

      const el = VMapBuilder.prototype['createLayerEl'].call(ctx, layer);
      expect(el.tagName.toLowerCase()).toBe('v-map-layer-terrain');
      // Falls back to String(circular) = "[object Object]"
      expect(el.getAttribute('elevation-decoder')).toBe('[object Object]');
    });

    it('createLayerEl creates wfs element without params (line 746 false branch)', () => {
      const el = VMapBuilder.prototype['createLayerEl'].call(makeCreateCtx(), {
        id: 'wfs-noparams',
        type: 'wfs',
        url: 'https://example.com/wfs',
        data: {
          url: 'https://example.com/wfs',
          typeName: 'ns:rivers',
          // no params property
        },
      });
      expect(el.tagName.toLowerCase()).toBe('v-map-layer-wfs');
      expect(el.getAttribute('type-name')).toBe('ns:rivers');
      expect(el.hasAttribute('params')).toBe(false);
    });

    it('createLayerEl creates geotiff element with url from data (line 798 data.url branch)', () => {
      const el = VMapBuilder.prototype['createLayerEl'].call(makeCreateCtx(), {
        id: 'geotiff-dataurl',
        type: 'geotiff',
        // no layer.url, only data.url
        data: {
          url: 'https://example.com/from-data.tif',
        },
      });
      expect(el.tagName.toLowerCase()).toBe('v-map-layer-geotiff');
      expect(el.getAttribute('url')).toBe('https://example.com/from-data.tif');
    });

    it('applyDiff removes layers that were in old config but not in new (lines 985-988)', () => {
      const hostEl = createMockHost();
      const ctx = {
        hostEl,
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
        ensureGroup: VMapBuilder.prototype['ensureGroup'],
        createLayerEl: VMapBuilder.prototype['createLayerEl'],
        syncStyles: VMapBuilder.prototype['syncStyles'],
        patchLayer: VMapBuilder.prototype['patchLayer'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
      } as any;

      const initial = {
        map: {
          flavour: 'ol', id: 'map1', zoom: 5, center: '8,49', style: '',
          styles: [],
          layerGroups: [{
            groupTitle: 'Base', basemapid: '', layers: [
              { id: 'keep-me', type: 'osm' as const },
              { id: 'remove-me', type: 'osm' as const },
              { id: 'also-remove', type: 'xyz' as const, url: 'https://tiles/{z}/{x}/{y}.png' },
            ],
          }],
        },
      };

      VMapBuilder.prototype['applyDiff'].call(ctx, undefined, initial);

      const groupEl = hostEl.querySelector('v-map')!.querySelector('v-map-layergroup')!;
      expect(groupEl.children).toHaveLength(3);

      // Now remove two layers
      const next = {
        map: {
          flavour: 'ol', id: 'map1', zoom: 5, center: '8,49', style: '',
          styles: [],
          layerGroups: [{
            groupTitle: 'Base', basemapid: '', layers: [
              { id: 'keep-me', type: 'osm' as const },
            ],
          }],
        },
      };

      VMapBuilder.prototype['applyDiff'].call(ctx, initial, next);

      expect(groupEl.children).toHaveLength(1);
      expect(groupEl.children[0].getAttribute('id')).toBe('keep-me');
    });

    it('patchLayer handles opacity, zIndex, layers, tiled individually (lines 882-896)', () => {
      const ctx = {
        ensureAttr: VMapBuilder.prototype['ensureAttr'],
        createLayerEl: VMapBuilder.prototype['createLayerEl'],
        toOptionalString: VMapBuilder.prototype['toOptionalString'],
        toOptionalNumber: VMapBuilder.prototype['toOptionalNumber'],
        toOptionalBoolean: VMapBuilder.prototype['toOptionalBoolean'],
        toCsv: VMapBuilder.prototype['toCsv'],
        cleanRecord: VMapBuilder.prototype['cleanRecord'],
        toKebabCase: VMapBuilder.prototype['toKebabCase'],
      } as any;

      // Test opacity alone
      const el1 = document.createElement('v-map-layer-wms');
      VMapBuilder.prototype['patchLayer'].call(ctx, el1, {
        opacity: { old: 1, new: 0.7 },
      }, { id: 'l1', type: 'wms' } as any);
      expect(el1.getAttribute('opacity')).toBe('0.7');

      // Test zIndex alone
      const el2 = document.createElement('v-map-layer-wms');
      VMapBuilder.prototype['patchLayer'].call(ctx, el2, {
        zIndex: { old: undefined, new: 5 },
      }, { id: 'l2', type: 'wms' } as any);
      expect(el2.getAttribute('z-index')).toBe('5');

      // Test layers alone
      const el3 = document.createElement('v-map-layer-wms');
      VMapBuilder.prototype['patchLayer'].call(ctx, el3, {
        layers: { old: 'old-layer', new: 'new-layer' },
      }, { id: 'l3', type: 'wms' } as any);
      expect(el3.getAttribute('layers')).toBe('new-layer');

      // Test tiled alone
      const el4 = document.createElement('v-map-layer-wms');
      VMapBuilder.prototype['patchLayer'].call(ctx, el4, {
        tiled: { old: undefined, new: 'true' },
      }, { id: 'l4', type: 'wms' } as any);
      expect(el4.getAttribute('tiled')).toBe('true');

      // Test style alone with truthy value
      const el5 = document.createElement('v-map-layer-wms');
      VMapBuilder.prototype['patchLayer'].call(ctx, el5, {
        style: { old: undefined, new: { color: 'blue' } },
      }, { id: 'l5', type: 'wms' } as any);
      expect(el5.getAttribute('style')).toBe(JSON.stringify({ color: 'blue' }));

      // Test style alone with falsy value (undefined)
      const el6 = document.createElement('v-map-layer-wms');
      el6.setAttribute('style', '{"color":"red"}');
      VMapBuilder.prototype['patchLayer'].call(ctx, el6, {
        style: { old: { color: 'red' }, new: undefined },
      }, { id: 'l6', type: 'wms' } as any);
      // style should be removed
      expect(el6.hasAttribute('style')).toBe(false);
    });
  });
});
