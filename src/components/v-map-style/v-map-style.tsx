import {
  Component,
  Prop,
  Element,
  Event,
  EventEmitter,
  Watch,
  State,
  Method,
  h,
} from '@stencil/core';
import SLDParser from 'geostyler-sld-parser';
import MapboxParser from 'geostyler-mapbox-parser';
import QGISParser from 'geostyler-qgis-parser';
import LyrxParser from 'geostyler-lyrx-parser';
import { Style } from 'geostyler-style';

import { log } from '../../utils/logger';
import MSG from '../../utils/messages';

const MSG_COMPONENT = 'v-map-style';

export type StyleFormat =
  | 'sld'
  | 'mapbox-gl'
  | 'qgis'
  | 'lyrx'
  | 'cesium-3d-tiles';

export type Cesium3DTilesStyle = Record<string, unknown>;
export type ResolvedStyle = Style | Cesium3DTilesStyle;

export interface StyleConfig {
  format: StyleFormat;
  source: string;
  layerTargets?: string[];
}

@Component({
  tag: 'v-map-style',
  styleUrl: 'v-map-style.css',
  shadow: true,
})
export class VMapStyle {
  @Element() el!: HTMLElement;

  /**
   * The styling format to parse (currently supports 'sld').
   */
  @Prop({ reflect: true }) format: StyleFormat = 'sld';

  /**
   * The style source - can be a URL to fetch from or inline SLD/style content.
   */
  @Prop({ reflect: true }) src?: string;

  /**
   * Inline style content as string (alternative to src).
   */
  @Prop({ reflect: true }) content?: string;

  /**
   * Target layer IDs to apply this style to. If not specified, applies to all compatible layers.
   */
  @Prop({ reflect: true }) layerTargets?: string;

  /**
   * Whether to automatically apply the style when loaded.
   * @default true
   */
  @Prop({ reflect: true }) autoApply: boolean = true;

  /**
   * Fired when style is successfully parsed and ready to apply.
   */
  @Event() styleReady!: EventEmitter<ResolvedStyle>;

  /**
   * Fired when style parsing fails.
   */
  @Event() styleError!: EventEmitter<Error>;

  @State() private parsedStyle?: ResolvedStyle;
  @State() private isLoading: boolean = false;
  @State() private error?: Error;

  private sldParser = new SLDParser();
  private mapboxParser = new MapboxParser();
  private qgisParser = new QGISParser();
  private lyrxParser = new LyrxParser();

  async connectedCallback() {
    log(MSG_COMPONENT + ' - ' + MSG.COMPONENT_CONNECTED_CALLBACK);

    if (this.autoApply && (this.src || this.content)) {
      await this.loadAndParseStyle();
    }
  }

  @Watch('src')
  @Watch('content')
  @Watch('format')
  async onStyleSourceChanged() {
    if (this.autoApply && (this.src || this.content)) {
      await this.loadAndParseStyle();
    }
  }

  /**
   * Load and parse the style from src or content.
   */
  async loadAndParseStyle(): Promise<ResolvedStyle | undefined> {
    this.isLoading = true;
    this.error = undefined;

    try {
      let styleContent: string;

      if (this.src) {
        // Fetch style from URL
        const response = await fetch(this.src);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch style from ${this.src}: ${response.statusText}`,
          );
        }
        styleContent = await response.text();
      } else if (this.content) {
        // Use inline content
        styleContent = this.content;
      } else {
        throw new Error('Either src or content must be provided');
      }

      // Parse based on format
      const style = await this.parseStyle(styleContent);

      this.parsedStyle = style;
      this.styleReady.emit(style);

      log(MSG_COMPONENT + ' - Style successfully parsed', style);
      return style;
    } catch (error) {
      this.error = error as Error;
      this.styleError.emit(this.error);
      console.error(MSG_COMPONENT + ' - Style parsing failed:', error);
      return undefined;
    } finally {
      this.isLoading = false;
    }
  }

  private async parseStyle(styleContent: string): Promise<ResolvedStyle> {
    switch (this.format) {
      case 'sld':
        return this.parseSLD(styleContent);
      case 'mapbox-gl':
        return this.parseMapboxGL(styleContent);
      case 'qgis':
        return this.parseQGIS(styleContent);
      case 'lyrx':
        return this.parseLyrx(styleContent);
      case 'cesium-3d-tiles':
        return this.parseCesium3DTiles(styleContent);
      default:
        throw new Error(`Unsupported style format: ${this.format}`);
    }
  }

  private async parseSLD(sldContent: string): Promise<Style> {
    try {
      const { output: style } = await this.sldParser.readStyle(sldContent);

      if (!style) {
        throw new Error('Failed to parse SLD - no style output');
      }

      return style;
    } catch (error) {
      throw new Error(`SLD parsing failed: ${error.message}`);
    }
  }

  private async parseMapboxGL(mapboxContent: string): Promise<Style> {
    try {
      // Parse JSON if string
      const mapboxStyle =
        typeof mapboxContent === 'string'
          ? JSON.parse(mapboxContent)
          : mapboxContent;

      const { output: style } = await this.mapboxParser.readStyle(mapboxStyle);

      if (!style) {
        throw new Error('Failed to parse Mapbox GL Style - no style output');
      }

      return style;
    } catch (error) {
      throw new Error(`Mapbox GL Style parsing failed: ${error.message}`);
    }
  }

  private async parseQGIS(qgisContent: string): Promise<Style> {
    try {
      const { output: style } = await this.qgisParser.readStyle(qgisContent);

      if (!style) {
        throw new Error('Failed to parse QGIS Style - no style output');
      }

      return style;
    } catch (error) {
      throw new Error(`QGIS Style parsing failed: ${error.message}`);
    }
  }

  private async parseLyrx(lyrxContent: string): Promise<Style> {
    try {
      // Parse JSON if string
      const lyrxStyle =
        typeof lyrxContent === 'string' ? JSON.parse(lyrxContent) : lyrxContent;

      const { output: style } = await this.lyrxParser.readStyle(lyrxStyle);

      if (!style) {
        throw new Error(
          'Failed to parse LYRX (ArcGIS Pro) Style - no style output',
        );
      }

      return style;
    } catch (error) {
      throw new Error(
        `LYRX (ArcGIS Pro) Style parsing failed: ${error.message}`,
      );
    }
  }

  /**
   * Get the currently parsed style.
   */
  @Method()
  async getStyle(): Promise<ResolvedStyle | undefined> {
    return this.parsedStyle;
  }

  private async parseCesium3DTiles(
    jsonContent: string,
  ): Promise<Cesium3DTilesStyle> {
    try {
      const style = JSON.parse(jsonContent);
      if (typeof style !== 'object' || style === null) {
        throw new Error('Parsed Cesium style is not an object');
      }
      return style as Cesium3DTilesStyle;
    } catch (error) {
      throw new Error(`Cesium 3D Tiles style parsing failed: ${error.message}`);
    }
  }

  /**
   * Get the target layer IDs as array.
   */
  getLayerTargets(): string[] {
    if (!this.layerTargets) return [];
    return this.layerTargets.split(',').map(id => id.trim());
  }

  /**
   * Check if style is loading.
   */
  isStyleLoading(): boolean {
    return this.isLoading;
  }

  /**
   * Get any parsing error.
   */
  getError(): Error | undefined {
    return this.error;
  }

  render() {
    return (
      <div class="style-container">
        {this.isLoading && <div class="loading">Loading style...</div>}
        {this.error && (
          <div class="error">Style Error: {this.error.message}</div>
        )}
        {this.parsedStyle && (
          <div class="success">
            Style loaded ({this.format.toUpperCase()})
            {this.getLayerTargets().length > 0 && (
              <div class="targets">
                Targets: {this.getLayerTargets().join(', ')}
              </div>
            )}
          </div>
        )}
        <slot></slot>
      </div>
    );
  }
}
