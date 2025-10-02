import { Component, Prop, Element, Method, State, Watch, h } from '@stencil/core';
import { LayerConfig } from 'src/components';
import { VMapLayerHelper } from '../../layer/v-map-layer-helper';
import { log, warn } from '../../utils/logger';

const MSG_COMPONENT = 'v-map-layer-terrain - ';

type ElevationDecoder = {
  r: number;
  g: number;
  b: number;
  offset: number;
};

type ColorTuple = [number, number, number];

@Component({
  tag: 'v-map-layer-terrain',
  styleUrl: 'v-map-layer-terrain.css',
  shadow: true,
})
export class VMapLayerTerrain {
  @Element() el!: HTMLElement;

  /**
   * URL zu Höhenraster im Heightmap-Format (z. B. GeoTIFF oder PNG Heightmap).
   */
  @Prop({ reflect: true }) elevationData!: string;

  /**
   * Optionale Textur (RGB) für das Terrain.
   */
  @Prop({ reflect: true }) texture?: string;

  /**
   * JSON-Repräsentation eines Elevation-Decoders (z. B. '{"r":1,"g":1,"b":1,"offset":0}').
   */
  @Prop({ reflect: true }) elevationDecoder?: string;

  /**
   * Darstellung des Mesh als Drahtgitter.
   */
  @Prop({ reflect: true }) wireframe?: boolean;

  /**
   * Basisfarbe für das Terrain. Erwartet Hex oder RGB (z. B. '#ff0000' oder '255,0,0').
   */
  @Prop({ reflect: true }) color?: string;

  /**
   * Minimale Zoomstufe für das Terrain.
   */
  @Prop({ reflect: true }) minZoom?: number;

  /**
   * Maximale Zoomstufe für das Terrain.
   */
  @Prop({ reflect: true }) maxZoom?: number;

  /**
   * Fehler-Toleranz für das Mesh (wird an TerrainRenderer durchgereicht).
   */
  @Prop({ reflect: true }) meshMaxError?: number;

  /**
   * Sichtbarkeit des Layers.
   */
  @Prop({ reflect: true }) visible: boolean = true;

  /**
   * Opazität des Layers.
   */
  @Prop({ reflect: true }) opacity: number = 1;

  /**
   * Z-Index für die Darstellung.
   */
  @Prop({ reflect: true }) zIndex: number = 1000;

  @State() private didLoad = false;

  private helper: VMapLayerHelper;

  componentWillLoad() {
    log(MSG_COMPONENT + 'componentWillLoad');
    this.helper = new VMapLayerHelper(this.el);
  }

  async componentDidLoad() {
    log(MSG_COMPONENT + 'componentDidLoad');

    await this.helper.initLayer(() => this.createLayerConfig(), this.el.id);

    this.didLoad = true;
  }

  async disconnectedCallback() {
    log(MSG_COMPONENT + 'disconnectedCallback');
    await this.helper?.removeLayer();
  }

  /**
   * Liefert `true`, sobald das Terrain-Layer initialisiert wurde.
   */
  @Method()
  async isReady(): Promise<boolean> {
    return this.didLoad;
  }

  @Watch('visible')
  async onVisibleChanged() {
    if (!this.didLoad) return;
    await this.helper?.setVisible(this.visible);
  }

  @Watch('opacity')
  async onOpacityChanged() {
    if (!this.didLoad) return;
    await this.helper?.setOpacity(this.opacity);
  }

  @Watch('zIndex')
  async onZIndexChanged() {
    if (!this.didLoad) return;
    await this.helper?.setZIndex(this.zIndex);
  }

  @Watch('elevationData')
  @Watch('texture')
  @Watch('elevationDecoder')
  @Watch('wireframe')
  @Watch('color')
  @Watch('minZoom')
  @Watch('maxZoom')
  @Watch('meshMaxError')
  async onTerrainConfigChanged() {
    if (!this.didLoad) return;
    await this.pushTerrainUpdate();
  }

  private async pushTerrainUpdate() {
    await this.helper?.updateLayer({
      type: 'terrain',
      data: {
        type: 'terrain',
        elevationData: this.elevationData,
        texture: this.texture,
        elevationDecoder: this.getElevationDecoder(),
        wireframe: this.wireframe,
        color: this.getColorArray(),
        minZoom: this.minZoom,
        maxZoom: this.maxZoom,
        meshMaxError: this.meshMaxError,
        opacity: this.opacity,
        visible: this.visible,
        zIndex: this.zIndex,
      } as Partial<Extract<LayerConfig, { type: 'terrain' }>>,
    });
  }

  private getElevationDecoder(): ElevationDecoder | undefined {
    if (!this.elevationDecoder) return undefined;
    try {
      const parsed = JSON.parse(this.elevationDecoder);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        ['r', 'g', 'b', 'offset'].every(k => k in parsed)
      ) {
        return parsed as ElevationDecoder;
      }
      warn(MSG_COMPONENT + 'Invalid elevationDecoder, expected JSON object with r/g/b/offset');
    } catch (error) {
      warn(MSG_COMPONENT + 'Failed to parse elevationDecoder JSON', error);
    }
    return undefined;
  }

  private getColorArray(): ColorTuple | undefined {
    if (!this.color) return undefined;
    const value = this.color.trim();

    if (!value) return undefined;

    // JSON-style array
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        const parsed = JSON.parse(value);
        if (
          Array.isArray(parsed) &&
          parsed.length === 3 &&
          parsed.every(item => typeof item === 'number')
        ) {
          return parsed as ColorTuple;
        }
      } catch (error) {
        warn(MSG_COMPONENT + 'Failed to parse color JSON array', error);
      }
    }

    // Comma separated numbers
    if (value.includes(',')) {
      const parts = value.split(',').map(part => parseFloat(part.trim()));
      if (parts.length === 3 && parts.every(num => !Number.isNaN(num))) {
        return parts as ColorTuple;
      }
    }

    // Hex value
    if (value.startsWith('#')) {
      const hex = value.replace('#', '');
      if (hex.length === 3 || hex.length === 6) {
        const normalized = hex.length === 3
          ? hex.split('').map(ch => ch + ch).join('')
          : hex;
        const r = parseInt(normalized.slice(0, 2), 16);
        const g = parseInt(normalized.slice(2, 4), 16);
        const b = parseInt(normalized.slice(4, 6), 16);
        if (![r, g, b].some(Number.isNaN)) {
          return [r, g, b];
        }
      }
    }

    warn(MSG_COMPONENT + `Unsupported color format: ${value}`);
    return undefined;
  }

  private createLayerConfig(): LayerConfig {
    const config: LayerConfig = {
      type: 'terrain',
      elevationData: this.elevationData,
      texture: this.texture,
      elevationDecoder: this.getElevationDecoder(),
      wireframe: this.wireframe,
      color: this.getColorArray(),
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      meshMaxError: this.meshMaxError,
      opacity: this.opacity,
      visible: this.visible,
      zIndex: this.zIndex,
    };

    return config;
  }

  render() {
    return <slot></slot>;
  }
}
