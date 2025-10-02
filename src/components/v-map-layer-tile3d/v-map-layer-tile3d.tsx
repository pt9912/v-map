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

import { LayerConfig } from 'src/components';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import { log, warn } from '../../utils/logger';
import MSG from '../../utils/messages';
import { VMapEvents } from '../../utils/events';

const MSG_COMPONENT = 'v-map-layer-tile3d - ';

export type Cesium3DTileStyle = Record<string, unknown>;

@Component({
  tag: 'v-map-layer-tile3d',
  styleUrl: 'v-map-layer-tile3d.css',
  shadow: true,
})
export class VMapLayerTile3d {
  @Element() el!: HTMLElement;

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

  private helper: VMapLayerHelper;
  private appliedCesiumStyle?: Cesium3DTileStyle;

  async componentWillLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_LOAD);
    this.helper = new VMapLayerHelper(this.el);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);
    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);
    await this.applyExistingStyles();
    this.didLoad = true;
    this.ready.emit();
  }

  async disconnectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_DISCONNECTED_CALLBACK);
    this.helper.removeLayer();
  }

  /**
   * Indicates whether the tileset has been initialised and added to the map.
   */
  @Method()
  async isReady(): Promise<boolean> {
    return this.didLoad;
  }

  @Watch('url')
  async onUrlChanged(oldValue: string, newValue: string) {
    if (oldValue === newValue || !this.helper) return;
    await this.helper.updateLayer({
      type: 'tile3d',
      data: {
        url: newValue,
        tilesetOptions: this.parseTilesetOptions(),
        style: this.appliedCesiumStyle,
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
        style: this.appliedCesiumStyle,
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

  @Listen('styleReady', { target: 'document' })
  async onStyleReady(event: CustomEvent<unknown>) {
    const styleComponent = event.target as HTMLVMapStyleElement;
    if (!this.isCesiumStyle(styleComponent)) return;
    if (!this.isTargetedByStyle(styleComponent)) return;

    const style = styleComponent.getStyle
      ? await styleComponent.getStyle()
      : event.detail;

    if (!style || typeof style !== 'object') return;

    log(MSG_COMPONENT + 'Applying Cesium 3D Tiles style');
    this.appliedCesiumStyle = style as Cesium3DTileStyle;
    await this.updateLayerWithCesiumStyle();
  }

  private async applyExistingStyles() {
    const styleComponents = Array.from(
      document.querySelectorAll('v-map-style'),
    ) as HTMLVMapStyleElement[];

    for (const styleComponent of styleComponents) {
      if (!this.isCesiumStyle(styleComponent)) continue;
      if (!this.isTargetedByStyle(styleComponent)) continue;

      const style = styleComponent.getStyle
        ? await styleComponent.getStyle()
        : undefined;
      if (!style || typeof style !== 'object') continue;

      log(MSG_COMPONENT + 'Applying existing Cesium 3D Tiles style');
      this.appliedCesiumStyle = style as Cesium3DTileStyle;
      await this.updateLayerWithCesiumStyle();
    }
  }

  private isTargetedByStyle(styleComponent: HTMLVMapStyleElement): boolean {
    const layerTargets = styleComponent.layerTargets;
    if (!layerTargets) return false;

    const targets = layerTargets.split(',').map(id => id.trim());
    return targets.includes(this.el.id) || targets.length === 0;
  }

  private isCesiumStyle(styleComponent: HTMLVMapStyleElement): boolean {
    return styleComponent.format?.toLowerCase() === 'cesium-3d-tiles';
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
      warn(MSG_COMPONENT + 'Invalid tilesetOptions JSON provided', error);
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
    } as any;

    if (this.appliedCesiumStyle) {
      (config as any).cesiumStyle = this.appliedCesiumStyle;
    }

    return config;
  }

  render() {
    return <slot></slot>;
  }
}
