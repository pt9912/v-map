import {
  Component,
  Prop,
  Element,
  Event,
  EventEmitter,
  Listen,
  Method,
  State,
  Watch,
  h,
} from '@stencil/core';

import type { LayerConfig } from '../../types/layerconfig';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import type { VMapErrorHost } from '../../layer/v-map-layer-helper';
import type { VMapErrorDetail } from '../../utils/events';
import { log } from '../../utils/logger';
import MSG from '../../utils/messages';
import { VMapEvents } from '../../utils/events';
import { type Cesium3DTileStyle } from '../../types/styling';
import { isGeoStylerStyle, StyleEvent } from '../../types/styling';

const MSG_COMPONENT = 'v-map-layer-tile3d - ';

@Component({
  tag: 'v-map-layer-tile3d',
  styleUrl: 'v-map-layer-tile3d.css',
  shadow: true,
})
export class VMapLayerTile3d implements VMapErrorHost {
  @Element() el!: HTMLElement;

  /** Current load state of the layer. */
  @Prop({ attribute: 'load-state', reflect: true, mutable: true })
  loadState: 'idle' | 'loading' | 'ready' | 'error' = 'idle';

  /**
   * URL pointing to the Cesium 3D Tileset.
   */
  @Prop({ reflect: true }) url!: string;

  /**
   * Optional JSON string or object with Cesium3DTileset options.
   */
  @Prop() tilesetOptions?: string | Record<string, unknown>;

  /**
   * Whether the tileset should be visible.
   * @default true
   */
  @Prop({ reflect: true }) visible: boolean = true;

  /**
   * Global opacity factor (0-1).
   * @default 1
   */
  @Prop({ reflect: true }) opacity: number = 1;

  /**
   * Z-index used for ordering tilesets.
   * @default 1000
   */
  @Prop({ reflect: true }) zIndex: number = 1000;

  /**
   * Fired once the tileset layer is initialised.
   */
  @Event({ eventName: VMapEvents.Ready }) ready!: EventEmitter<void>;

  @State() private didLoad = false;
  private hasLoadedOnce = false;

  private helper: VMapLayerHelper;
  private appliedCesiumStyle?: Cesium3DTileStyle;

  async connectedCallback() {
    if (!this.hasLoadedOnce) return;
    this.helper.startLoading();
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);
  }

  async componentWillLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_LOAD);
    this.helper = new VMapLayerHelper(this.el, this);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);
    this.helper.startLoading();
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);
    await this.applyExistingStyles();
    this.didLoad = true;
    this.hasLoadedOnce = true;
    this.ready.emit();
  }

  async disconnectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_DISCONNECTED_CALLBACK);
    await this.helper?.dispose();
  }

  /**
   * Indicates whether the tileset has been initialised and added to the map.
   */
  @Method()
  async isReady(): Promise<boolean> {
    return this.didLoad;
  }

  setLoadState(state: 'idle' | 'loading' | 'ready' | 'error') {
    this.loadState = state;
  }

  /** Returns the last error detail, if any. */
  @Method()
  async getError(): Promise<VMapErrorDetail | undefined> {
    return this.helper?.getError();
  }

  @Watch('url')
  async onUrlChanged(oldValue: string, newValue: string) {
    if (oldValue === newValue || !this.helper) return;
    await this.helper.updateLayer({
      type: 'tile3d',
      data: {
        url: newValue,
        tilesetOptions: this.parseTilesetOptions(),
        cesiumStyle: this.appliedCesiumStyle,
      },
    });
  }

  @Watch('tilesetOptions')
  async onTilesetOptionsChanged() {
    if (!this.helper) return;
    await this.helper.updateLayer({
      type: 'tile3d',
      data: {
        url: this.url,
        tilesetOptions: this.parseTilesetOptions(),
        cesiumStyle: this.appliedCesiumStyle,
      },
    });
  }

  @Watch('visible')
  async onVisibleChanged() {
    await this.helper?.setVisible(this.visible);
  }

  @Watch('opacity')
  async onOpacityChanged() {
    await this.helper?.setOpacity(this.opacity);
  }

  @Watch('zIndex')
  async onZIndexChanged() {
    await this.helper?.setZIndex(this.zIndex);
  }

  /**
   * Listen for style events from v-map-style components
   */
  @Listen('styleReady', { target: 'document' })
  async onStyleReady(event: CustomEvent<StyleEvent>) {
    const { style, layerIds } = event.detail;
    if (!style || isGeoStylerStyle(style)) return;
    if (!this.isTargetedByStyle(layerIds)) return;

    log(MSG_COMPONENT + 'Applying Cesium 3D Tiles style');
    this.appliedCesiumStyle = style as Cesium3DTileStyle;
    await this.updateLayerWithCesiumStyle();
  }

  // @Listen('styleReady', { target: 'document' })
  // async onStyleReady(event: CustomEvent<unknown>) {
  //   const styleComponent = event.target as HTMLVMapStyleElement;
  //   if (!this.isCesiumStyle(styleComponent)) return;
  //   if (!this.isTargetedByStyle(styleComponent)) return;

  //   const style = styleComponent.getStyle
  //     ? await styleComponent.getStyle()
  //     : event.detail;

  //   if (!style || typeof style !== 'object') return;

  //   log(MSG_COMPONENT + 'Applying Cesium 3D Tiles style');
  //   this.appliedCesiumStyle = style as Cesium3DTileStyle;
  //   await this.updateLayerWithCesiumStyle();
  // }

  private async applyExistingStyles() {
    const styleComponents = Array.from(
      document.querySelectorAll('v-map-style'),
    ) as HTMLVMapStyleElement[];

    for (const styleComponent of styleComponents) {
      const style = styleComponent.getStyle
        ? await styleComponent.getStyle()
        : undefined;
      if (!style) continue;
      if (isGeoStylerStyle(style)) continue;

      const layerTargetIds = styleComponent.getLayerTargetIds
        ? await styleComponent.getLayerTargetIds()
        : undefined;
      if (!layerTargetIds) continue;
      if (!this.isTargetedByStyle(layerTargetIds)) continue;

      log(MSG_COMPONENT + 'Applying existing Cesium 3D Tiles style');
      this.appliedCesiumStyle = style as Cesium3DTileStyle;
      await this.updateLayerWithCesiumStyle();
    }
  }

  /**
   * Check if this layer is targeted by a style component
   */
  private isTargetedByStyle(layerIds?: string[]): boolean {
    if (!layerIds) return false;
    return layerIds.includes(this.el.id) || layerIds.length === 0;
  }

  private async updateLayerWithCesiumStyle() {
    if (!this.helper || !this.appliedCesiumStyle) return;
    await this.helper.updateLayer({
      type: 'tile3d-style',
      data: {
        style: this.appliedCesiumStyle,
      },
    });
  }

  private parseTilesetOptions(): Record<string, unknown> | undefined {
    if (!this.tilesetOptions) return undefined;
    if (typeof this.tilesetOptions === 'object') {
      return this.tilesetOptions;
    }

    try {
      return JSON.parse(this.tilesetOptions);
    } catch (error) {
      this.helper?.setError({ type: 'parse', message: 'Invalid tilesetOptions JSON', attribute: 'tilesetOptions', cause: error });
      return undefined;
    }
  }

  private createLayerConfig(): LayerConfig {
    const config: LayerConfig = {
      type: 'tile3d',
      url: this.url,
      visible: this.visible,
      opacity: this.opacity,
      zIndex: this.zIndex,
      tilesetOptions: this.parseTilesetOptions(),
      cesiumStyle: this.appliedCesiumStyle,
    };

    return config;
  }

  render() {
    return <slot></slot>;
  }
}
