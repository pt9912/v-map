// src/components/v-map-layer-terrain-geotiff/v-map-layer-terrain-geotiff.tsx
import {
  Component,
  Prop,
  Method,
  Event,
  EventEmitter,
  Watch,
  Element,
  h,
} from '@stencil/core';

import type { VMapLayer } from '../../types/vmaplayer';
import { VMapEvents } from '../../utils/events';
import type { LayerConfig } from '../../types/layerconfig';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import { log } from '../../utils/logger';
import MSG from '../../utils/messages';
import type { ColorMap as GeoStylerColorMap } from 'geostyler-style';

const MSG_COMPONENT: string = 'v-map-layer-terrain-geotiff - ';

@Component({
  tag: 'v-map-layer-terrain-geotiff',
  styleUrl: 'v-map-layer-terrain-geotiff.css',
  shadow: true,
})
export class VMapLayerTerrainGeotiff implements VMapLayer {
  @Element() el!: HTMLElement;

  /**
   * URL to the GeoTIFF file containing elevation data.
   */
  @Prop() url: string = null;

  /**
   * Quell-Projektion des GeoTIFF (z. B. "EPSG:32632" oder proj4-String)
   */
  @Prop() projection?: string = null;

  /**
   * Erzwingt die Verwendung der projection-Prop, ignoriert GeoKeys
   */
  @Prop() forceProjection?: boolean = false;

  @Prop() visible: boolean = true;

  /**
   * Opacity of the terrain layer (0–1).
   * @default 1
   */
  @Prop() opacity: number = 1.0;

  /**
   * Z-index for layer stacking order. Higher values render on top.
   */
  @Prop() zIndex: number = 100;

  /**
   * NoData value to discard (overriding any nodata values in the metadata).
   */
  @Prop() nodata?: number = null;

  /**
   * Mesh error tolerance in meters (Martini).
   * Smaller values = more detailed mesh, but slower.
   * @default 4.0
   */
  @Prop() meshMaxError?: number = 4.0;

  /**
   * Enable wireframe mode (show only mesh lines).
   * @default false
   */
  @Prop() wireframe?: boolean = false;

  /**
   * Optional texture URL (can be an image or tile URL).
   */
  @Prop() texture?: string = null;

  /**
   * Color for the terrain (if no texture is provided).
   * [r, g, b] with values 0-255.
   * @default [255, 255, 255]
   */
  @Prop() color?: [number, number, number] = null;

  /**
   * ColorMap for elevation data visualization.
   * Only relevant when no texture is set.
   */
  @Prop() colorMap?: string | GeoStylerColorMap = null;

  /**
   * Value range for colormap normalization [min, max].
   */
  @Prop() valueRange?: [number, number] = null;

  /**
   * Elevation exaggeration factor.
   * @default 1.0
   */
  @Prop() elevationScale?: number = 1.0;

  /**
   * Minimum zoom level.
   */
  @Prop() minZoom?: number = 0;

  /**
   * Maximum zoom level.
   */
  @Prop() maxZoom?: number = 24;

  /**
   * Tile size in pixels.
   * @default 256
   */
  @Prop() tileSize?: number = 256;

  /**
   * Fired when the terrain layer is ready.
   * @event ready
   */
  @Event({ eventName: VMapEvents.Ready }) ready!: EventEmitter<void>;

  private didLoad: boolean = false;

  private helper: VMapLayerHelper;

  @Watch('url')
  async onUrlChanged() {
    log(MSG_COMPONENT + 'onUrlChanged');
    await this.helper?.updateLayer({
      type: 'terrain-geotiff',
      data: this.createLayerConfig(),
    });
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

  @Watch('projection')
  @Watch('forceProjection')
  @Watch('nodata')
  @Watch('meshMaxError')
  @Watch('wireframe')
  @Watch('texture')
  @Watch('color')
  @Watch('colorMap')
  @Watch('valueRange')
  @Watch('elevationScale')
  @Watch('minZoom')
  @Watch('maxZoom')
  @Watch('tileSize')
  async onPropertyChanged() {
    log(MSG_COMPONENT + 'onPropertyChanged');
    await this.helper?.updateLayer({
      type: 'terrain-geotiff',
      data: this.createLayerConfig(),
    });
  }

  isReady(): boolean {
    return this.didLoad;
  }

  /**
   * Returns the internal layer ID used by the map provider.
   */
  @Method()
  async getLayerId() {
    return this.helper.getLayerId();
  }

  private createLayerConfig(): LayerConfig {
    return {
      type: 'terrain-geotiff',
      visible: this.visible,
      zIndex: this.zIndex,
      opacity: this.opacity,
      url: this.url,
      projection: this.projection,
      forceProjection: this.forceProjection,
      nodata: this.nodata,
      meshMaxError: this.meshMaxError,
      wireframe: this.wireframe,
      texture: this.texture,
      color: this.color,
      colorMap: this.colorMap,
      valueRange: this.valueRange,
      elevationScale: this.elevationScale,
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      tileSize: this.tileSize,
    };
  }

  async connectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_CONNECTED_CALLBACK);
  }

  disconnectedCallback() {
    log(MSG_COMPONENT + MSG.COMPONENT_DISCONNECTED_CALLBACK);
  }

  async componentWillLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_LOAD);
    this.helper = new VMapLayerHelper(this.el);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + MSG.COMPONENT_DID_LOAD);

    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);

    this.didLoad = true;
    this.ready.emit();
  }

  async componentWillRender() {
    log(MSG_COMPONENT + MSG.COMPONENT_WILL_RENDER);
  }

  render() {
    return <slot></slot>;
  }
}
