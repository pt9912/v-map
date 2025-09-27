import { Component, h, Element, Method, Prop, Watch } from '@stencil/core';
import { LayerConfig } from 'src/components';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import { log, warn } from '../../utils/logger';
import MSG from '../../utils/messages';

const MSG_COMPONENT: string = 'v-map-layer-geojson - ';

@Component({
  tag: 'v-map-layer-geojson',
  shadow: true,
})
export class VMapLayerGeoJSON {
  @Element() el!: HTMLElement;

  /** Prop, die du intern nutzt/weiterverarbeitest */
  @Prop({ mutable: true }) geojson?: unknown;

  @Prop({ reflect: true }) url: string = null;

  @Prop({ reflect: true }) visible: boolean = true;

  @Prop({ reflect: true }) zIndex: number = 1000;

  /**
   * Opazität der geojson-Kacheln (0–1).
   * @default 1
   */
  @Prop({ reflect: true }) opacity: number = 1.0;

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
    log(MSG_COMPONENT + MSG.COMPONENT_CONNECTED_CALLBACK);
  }

  async componentWillLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_LOAD);
    this.helper = new VMapLayerHelper(this.el);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);
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

    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);

    this.didLoad = true;
    //todo    this.ready.emit();
  }

  async disconnectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_DISCONNECTED_CALLBACK);
    this.mo?.disconnect();
    this.geoSlot?.removeEventListener('slotchange', this.onSlotChange);
    this.helper.removeLayer();
  }

  isReady(): boolean {
    return this.didLoad;
  }

  @Watch('geojson')
  async onGeoJsonChanged(oldValue: string, newValue: string) {
    log(MSG_COMPONENT + 'onGeoJsonChanged');
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
    log(MSG_COMPONENT + 'onUrlChanged');
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
    log(MSG_COMPONENT + 'onVisibleChanged');
    await this.helper?.setVisible(this.visible);
  }

  @Watch('opacity')
  async onOpacityChanged() {
    log(MSG_COMPONENT + 'onOpacityChanged');
    await this.helper?.setOpacity(this.opacity);
  }

  @Watch('zIndex')
  async onZIndexChanged() {
    log(MSG_COMPONENT + 'onZIndexChanged');
    await this.helper?.setZIndex(this.zIndex);
  }

  private onSlotChange = () => {
    log(MSG_COMPONENT + 'onSlotChange');
    this.observeAssignedNodes();
    this.readGeoJsonFromSlot();
  };

  private observeAssignedNodes() {
    log(MSG_COMPONENT + 'observeAssignedNodes');
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
    log(MSG_COMPONENT + 'readGeoJsonFromSlot');
    if (!this.geoSlot) {
      log(MSG_COMPONENT + 'readGeoJsonFromSlot - geoSlot: false');
      return;
    }
    const raw = this.geoSlot
      .assignedNodes({ flatten: true })
      .map(n => n.textContent || '')
      .join('')
      .trim();

    if (!raw) {
      log(MSG_COMPONENT + 'readGeoJsonFromSlot - raw: false');
      return; // nichts/keine Änderung
    }
    if (raw === this.lastString) {
      log(MSG_COMPONENT + 'readGeoJsonFromSlot - raw === this.lastString');
      return; // nichts/keine Änderung
    }

    this.lastString = raw;
    try {
      const geojson = JSON.parse(raw);
      log(MSG_COMPONENT + 'readGeoJsonFromSlot: ', geojson);
      this.geojson = geojson;
      // optional: eigenes Event „data-updated“ feuern
      // this.host.dispatchEvent(new CustomEvent('data-updated', { detail: this.geojson }));
    } catch (e) {
      warn(MSG_COMPONENT + 'Ungültiges JSON im Slot:', e);
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
