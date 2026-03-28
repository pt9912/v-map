import { afterEach, beforeAll, describe, expect, it } from 'vitest';

async function waitFor(condition: () => boolean, timeoutMs = 3_000): Promise<void> {
  const deadline = performance.now() + timeoutMs;
  while (performance.now() < deadline) {
    if (condition()) return;
    await new Promise(resolve => requestAnimationFrame(() => resolve(undefined)));
  }
  throw new Error('Timed out while waiting for browser test condition');
}

describe('v-map-layercontrol browser', () => {
  beforeAll(async () => {
    await import('../../../dist/v-map/v-map.esm.js');
    await customElements.whenDefined('v-map-layercontrol');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders discovered layer groups from live DOM', async () => {
    document.body.innerHTML = `
      <div id="map-browser-1">
        <v-map-layergroup id="group-1" group-title="Base Maps" visible>
          <v-map-layer-osm id="osm" label="OpenStreetMap" visible opacity="0.6" zindex="3"></v-map-layer-osm>
          <v-map-layer-geotiff id="dem" label="DEM" opacity="0.9" zindex="4"></v-map-layer-geotiff>
        </v-map-layergroup>
      </div>
    `;

    const control = document.createElement('v-map-layercontrol');
    control.setAttribute('for', 'map-browser-1');
    document.body.appendChild(control);

    await waitFor(() => control.classList.contains('hydrated'));
    await waitFor(() => !!control.shadowRoot?.querySelector('.layer-control'));

    const titles = Array.from(
      control.shadowRoot!.querySelectorAll('.layer-item-title'),
    ).map(node => node.textContent?.trim());

    expect(control.shadowRoot?.querySelector('.layer-group-title')?.textContent).toBe('Base Maps');
    expect(titles).toEqual(['OpenStreetMap', 'DEM']);
  });

  it('reacts to live DOM mutations via MutationObserver', async () => {
    document.body.innerHTML = `
      <div id="map-browser-2">
        <v-map-layergroup id="group-2" group-title="Overlays" visible></v-map-layergroup>
      </div>
    `;

    const control = document.createElement('v-map-layercontrol');
    control.setAttribute('for', 'map-browser-2');
    document.body.appendChild(control);

    await waitFor(() => control.classList.contains('hydrated'));
    await waitFor(() => !!control.shadowRoot?.querySelector('.layer-control'));

    const group = document.querySelector('#group-2') as HTMLElement;
    const layer = document.createElement('v-map-layer-osm');
    layer.id = 'late-layer';
    layer.setAttribute('label', 'Late Layer');
    layer.setAttribute('visible', '');
    group.appendChild(layer);

    await waitFor(() =>
      control.shadowRoot?.textContent?.includes('Late Layer') ?? false,
    );

    expect(control.shadowRoot?.querySelector('.layer-item-title')?.textContent).toBe('Late Layer');
  });

  it('updates source layer attributes through browser UI interactions', async () => {
    document.body.innerHTML = `
      <div id="map-browser-3">
        <v-map-layergroup id="group-3" group-title="Interactive" visible>
          <v-map-layer-osm id="interactive-layer" label="Interactive Layer" visible opacity="1" zindex="2"></v-map-layer-osm>
        </v-map-layergroup>
      </div>
    `;

    const control = document.createElement('v-map-layercontrol');
    control.setAttribute('for', 'map-browser-3');
    document.body.appendChild(control);

    await waitFor(() => control.classList.contains('hydrated'));
    await waitFor(() => !!control.shadowRoot?.querySelector('.layer-item-checkbox'));

    const sourceLayer = document.getElementById('interactive-layer') as HTMLElement;
    const checkbox = control.shadowRoot!.querySelector(
      '.layer-item-checkbox',
    ) as HTMLInputElement;
    const opacity = control.shadowRoot!.querySelector(
      '.layer-item-opacity',
    ) as HTMLInputElement;
    const zIndex = control.shadowRoot!.querySelector(
      '.layer-item-zindex',
    ) as HTMLInputElement;

    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    opacity.value = '0.4';
    opacity.dispatchEvent(new Event('input', { bubbles: true }));
    zIndex.value = '7';
    zIndex.dispatchEvent(new Event('change', { bubbles: true }));

    await waitFor(() =>
      !sourceLayer.hasAttribute('visible') &&
      sourceLayer.getAttribute('opacity') === '0.4' &&
      sourceLayer.getAttribute('zindex') === '7',
    );

    expect(sourceLayer.hasAttribute('visible')).toBe(false);
    expect(sourceLayer.getAttribute('opacity')).toBe('0.4');
    expect(sourceLayer.getAttribute('zindex')).toBe('7');
  });

  it('updates group visibility through the rendered group checkbox', async () => {
    document.body.innerHTML = `
      <div id="map-browser-4">
        <v-map-layergroup id="group-4" group-title="Grouped" visible>
          <v-map-layer-osm id="grouped-layer" label="Grouped Layer" visible></v-map-layer-osm>
        </v-map-layergroup>
      </div>
    `;

    const control = document.createElement('v-map-layercontrol');
    control.setAttribute('for', 'map-browser-4');
    document.body.appendChild(control);

    await waitFor(() => control.classList.contains('hydrated'));
    await waitFor(() => !!control.shadowRoot?.querySelector('.layer-group-checkbox'));

    const sourceGroup = document.getElementById('group-4') as HTMLElement;
    const groupCheckbox = control.shadowRoot!.querySelector(
      '.layer-group-checkbox',
    ) as HTMLInputElement;

    groupCheckbox.checked = false;
    groupCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

    await waitFor(() => !sourceGroup.hasAttribute('visible'));

    expect(sourceGroup.hasAttribute('visible')).toBe(false);
  });

  it('updates the basemap id through the rendered selector', async () => {
    document.body.innerHTML = `
      <div id="map-browser-5">
        <v-map-layergroup id="group-5" group-title="Basemaps" basemapid="osm-1" visible>
          <v-map-layer-osm id="osm-1" label="OSM" visible></v-map-layer-osm>
          <v-map-layer-wms id="wms-1" label="WMS" visible></v-map-layer-wms>
        </v-map-layergroup>
      </div>
    `;

    const control = document.createElement('v-map-layercontrol');
    control.setAttribute('for', 'map-browser-5');
    document.body.appendChild(control);

    await waitFor(() => control.classList.contains('hydrated'));
    await waitFor(() => !!control.shadowRoot?.querySelector('.basemap-selector'));

    const sourceGroup = document.getElementById('group-5') as HTMLElement;
    const select = control.shadowRoot!.querySelector(
      '.basemap-selector',
    ) as HTMLSelectElement;

    select.value = 'wms-1';
    select.dispatchEvent(new Event('change', { bubbles: true }));

    await waitFor(() => sourceGroup.getAttribute('basemapid') === 'wms-1');

    expect(sourceGroup.getAttribute('basemapid')).toBe('wms-1');
  });
});
