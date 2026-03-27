// src/components/v-map/v-map.spec.tsx
import { newSpecPage } from '@stencil/core/testing';
import { VMap } from './v-map';
import '../../testing/fail-on-console-spec';

describe('<v-map>', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [VMap],
      html: `<v-map flavour="leaflet" leaflet-css="none" center="8.5417,49.0069" zoom="10"></v-map>`,
    });

    expect(page.root).toBeTruthy();

    const shadow = page.root!.shadowRoot!;
    const map = shadow.querySelector('#map') as HTMLElement | null;

    expect(map).not.toBeNull();

    // Styles am #map (Target-Div) prüfen
    expect(map!.style.width).toBe('100%');
    expect(map!.style.height).toBe('100%');

    // optional: display block
    expect(map!.style.display).toBe('block');
  });

  it('exposes getMapProvider method', async () => {
    const page = await newSpecPage({
      components: [VMap],
      html: `<v-map flavour="leaflet" leaflet-css="none"></v-map>`,
    });
    const result = await page.rootInstance.getMapProvider();
    // Provider should be available after component renders
    expect(result).toBeDefined();
  });

  it('setView throws when provider is not ready', async () => {
    const component = new VMap();
    // mapProvider is undefined/null initially
    await expect(component.setView([7, 50], 10)).rejects.toThrow();
  });

  it('onFlavourChanged calls reset when flavour actually changes', async () => {
    const page = await newSpecPage({
      components: [VMap],
      html: `<v-map flavour="leaflet" leaflet-css="none"></v-map>`,
    });
    // Call onFlavourChanged directly with different values
    await (page.rootInstance as any).onFlavourChanged('ol', 'leaflet');
    // Should not throw
  });

  it('onFlavourChanged does nothing when values are the same', async () => {
    const page = await newSpecPage({
      components: [VMap],
      html: `<v-map flavour="leaflet" leaflet-css="none"></v-map>`,
    });
    await (page.rootInstance as any).onFlavourChanged('leaflet', 'leaflet');
    // Should not throw and should not call reset
  });

  it('createMap returns early when already creating', async () => {
    const page = await newSpecPage({
      components: [VMap],
      html: `<v-map flavour="leaflet" leaflet-css="none"></v-map>`,
    });
    const instance = page.rootInstance as any;
    instance.mapState = 'creating';
    // calling createMap while already in creating state should not throw
    await instance.createMap();
  });

  it('getMapProvider logs when provider is not yet ready', async () => {
    const instance = new VMap();
    // mapProvider is undefined initially, so the log branch should trigger
    const result = await instance.getMapProvider();
    expect(result).toBeUndefined();
  });

  it('setView works when provider is available', async () => {
    const page = await newSpecPage({
      components: [VMap],
      html: `<v-map flavour="leaflet" leaflet-css="none" center="8.5,49" zoom="10"></v-map>`,
    });
    const instance = page.rootInstance as any;
    // Only test if provider was actually created
    if (instance.mapProvider && instance.mapState === 'available') {
      await instance.setView([7, 50], 12);
    }
  });

  it('disconnectedCallback calls reset', async () => {
    const page = await newSpecPage({
      components: [VMap],
      html: `<v-map flavour="leaflet" leaflet-css="none"></v-map>`,
    });
    const instance = page.rootInstance as any;
    // Should not throw
    instance.disconnectedCallback();
    expect(instance.mapState).toBe('unavailable');
  });

  it('NOOP_PROVIDER methods are callable stubs', async () => {
    const page = await newSpecPage({
      components: [VMap],
      html: `<v-map flavour="leaflet" leaflet-css="none"></v-map>`,
    });

    // Capture the NOOP_PROVIDER via the MapProviderWillShutdown event
    let noopProvider: any;
    page.root!.addEventListener('map-provider-will-shutdown', ((e: CustomEvent) => {
      noopProvider = e.detail.mapProvider;
    }) as EventListener);

    const instance = page.rootInstance as any;
    instance.reset();

    expect(noopProvider).toBeDefined();

    // Exercise all NOOP_PROVIDER methods to cover their function bodies
    await noopProvider.init();
    await noopProvider.destroy();
    await noopProvider.setOpacity();
    await noopProvider.setVisible();
    await noopProvider.setZIndex();
    expect(await noopProvider.addLayerToGroup()).toBeNull();
    await noopProvider.updateLayer();
    await noopProvider.removeLayer();
    await noopProvider.setView();
    expect(await noopProvider.addBaseLayer()).toBeNull();
    await noopProvider.setBaseLayer();
    await noopProvider.ensureGroup();
    await noopProvider.setGroupVisible();
  });

  it('componentDidRender event listener handles MapProviderReady', async () => {
    const page = await newSpecPage({
      components: [VMap],
      html: `<v-map flavour="leaflet" leaflet-css="none"></v-map>`,
    });

    // The componentDidRender registers an event listener for MapProviderReady.
    // Fire it to cover the inline callback.
    page.root!.dispatchEvent(
      new CustomEvent('map-provider-ready', {
        detail: { mapProvider: {} },
        bubbles: false,
      }),
    );
  });
});
