import { Component, h, Element, Method, Prop, Watch } from '@stencil/core';
import { LayerConfig } from 'src/components';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';

@Component({
  tag: 'v-map-layer-geojson',
  shadow: true,
})
export class VMapLayerGeoJSON {
  @Element() el!: HTMLElement;

  /** Prop, die du intern nutzt/weiterverarbeitest */
  @Prop({ mutable: true }) geojson?: unknown;

  @Prop() url: string = null;

  @Prop() visible: boolean = true;

  @Prop() zIndex: number = 1000;

  /**
   * Opazität der geojson-Kacheln (0–1).
   * @default 1
   */
  @Prop() opacity: number = 1.0;

  private geoSlot?: HTMLSlotElement;
  private mo?: MutationObserver;
  private lastString?: string;
  private layerId: string = null;
  private didLoad: boolean = false;

  private helper: VMapLayerHelper;

  @Method()
  async getLayerId() {
    return this.layerId;
  }

  async connectedCallback() {
    console.log('v-map-layer-geojson - connectedCallback');
  }

  async componentWillLoad() {
    console.log('v-map-layer-geojson - componentWillLoad');
    this.helper = new VMapLayerHelper(this.el);
  }

  async componentDidLoad() {
    console.log('v-map-layer-geojson - componentDidLoad');
    // Slot referenzieren
    this.geoSlot = this.el.shadowRoot!.querySelector(
      'slot[name="geojson"]',
    ) as HTMLSlotElement;

    if (this.geoSlot) {
      // 1) Auf Slot-Zuweisungswechsel reagieren
      this.geoSlot.addEventListener('slotchange', this.onSlotChange);

      // 2) Initial lesen + zugewiesene Nodes beobachten
      this.observeAssignedNodes();
      this.readGeoJsonFromSlot();
    }

    await this.helper.initLayer(() => this.createLayerConfig());

    this.didLoad = true;
    //todo    this.ready.emit();
  }

  async disconnectedCallback() {
    console.log('v-map-layer-geojson - disconnectedCallback');
    this.mo?.disconnect();
    this.geoSlot?.removeEventListener('slotchange', this.onSlotChange);
  }

  isReady(): boolean {
    return this.didLoad;
  }

  @Watch('geojson')
  async onGeoJsonChanged(oldValue: string, newValue: string) {
    console.log('v-map-layer-geojson - onGeoJsonChanged');
    // hier deinen Layer aktualisieren
    if (oldValue !== newValue) {
      await this.helper?.updateLayer({
        type: 'geojson',
        data: {
          geojson: JSON.stringify(this.geojson),
        },
      });
      //     await this.helper.initLayer(() => this.createLayerConfig());
    }
  }

  @Watch('url')
  async onUrlChanged(oldValue: string, newValue: string) {
    console.log('v-map-layer-geojson - onUrlChanged');
    if (oldValue !== newValue) {
      await this.helper?.updateLayer({
        type: 'geojson',
        data: {
          url: this.url,
        },
      });
    }
    //    if (oldValue !== newValue) {
    //      await this.helper.initLayer(() => this.createLayerConfig());
    //    }
  }

  @Watch('visible')
  async onVisibleChanged() {
    console.log('v-map-layer-geojson - onVisibleChanged');
    await this.helper?.setVisible(this.visible);
  }

  @Watch('opacity')
  async onOpacityChanged() {
    console.log('v-map-layer-geojson - onOpacityChanged');
    await this.helper?.setOpacity(this.opacity);
  }

  @Watch('zIndex')
  async onZIndexChanged() {
    console.log('v-map-layer-geojson - onZIndexChanged');
    await this.helper?.setZIndex(this.zIndex);
  }

  private onSlotChange = () => {
    console.log('v-map-layer-geojson - onSlotChange');
    this.observeAssignedNodes();
    this.readGeoJsonFromSlot();
  };

  private observeAssignedNodes() {
    console.log('v-map-layer-geojson - observeAssignedNodes');
    this.mo?.disconnect();
    if (!this.geoSlot) return;

    const nodes = this.geoSlot.assignedNodes({ flatten: true });
    this.mo = new MutationObserver(() => this.readGeoJsonFromSlot());
    for (const n of nodes) {
      // Text- oder Element-Knoten beobachten (inkl. Subtree)
      this.mo.observe(n, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    }
  }

  private readGeoJsonFromSlot() {
    console.log('v-map-layer-geojson - readGeoJsonFromSlot');
    if (!this.geoSlot) {
      console.log('v-map-layer-geojson - readGeoJsonFromSlot - geoSlot: false');
      return;
    }
    const raw = this.geoSlot
      .assignedNodes({ flatten: true })
      .map(n => n.textContent || '')
      .join('')
      .trim();

    if (!raw) {
      console.log('v-map-layer-geojson - readGeoJsonFromSlot - raw: false');
      return; // nichts/keine Änderung
    }
    if (raw === this.lastString) {
      console.log(
        'v-map-layer-geojson - readGeoJsonFromSlot - raw === this.lastString',
      );
      return; // nichts/keine Änderung
    }

    this.lastString = raw;
    try {
      const geojson = JSON.parse(raw);
      console.log('v-map-layer-geojson - readGeoJsonFromSlot: ', geojson);
      this.geojson = geojson;
      // optional: eigenes Event „data-updated“ feuern
      // this.host.dispatchEvent(new CustomEvent('data-updated', { detail: this.geojson }));
    } catch (e) {
      console.warn('v-map-layer-geojson - Ungültiges JSON im Slot:', e);
    }
  }

  private createLayerConfig(): LayerConfig {
    return {
      type: 'geojson',
      opacity: this.opacity,
      visible: this.visible,
      zIndex: this.zIndex,
      url: this.url,
      //style: this.vectorStyle,
      geojson: JSON.stringify(this.geojson),
    };
  }

  render() {
    return <slot name="geojson" onSlotchange={this.onSlotChange}></slot>;
  }
}
