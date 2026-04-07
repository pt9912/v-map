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
import {
  type StyleFormat,
  type Cesium3DTileStyle,
  type ResolvedStyle,
  StyleEvent,
} from '../../types/styling';
import { VMapEvents, type VMapErrorDetail } from '../../utils/events';

const MSG_COMPONENT = 'v-map-style';

@Component({
  tag: 'v-map-style',
  styleUrl: 'v-map-style.css',
  shadow: true,
})
export class VMapStyle {
  @Element() el!: HTMLElement;

  /**
   * The styling format to parse (supports 'sld', 'mapbox-gl', 'qgis', 'lyrx', 'cesium-3d-tiles').
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
  @Event() styleReady!: EventEmitter<StyleEvent>;

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
      const styleEvent: StyleEvent = {
        style,
        layerIds: this.getLayerTargets(),
      };
      this.styleReady.emit(styleEvent);

      log(MSG_COMPONENT + ' - Style successfully parsed', style);
      return style;
    } catch (error) {
      this.error = error as Error;
      this.styleError.emit(this.error);

      const errorType: VMapErrorDetail['type'] =
        isRemoteFetchFailure(this.error) ? 'network' : 'parse';
      this.el.dispatchEvent(new CustomEvent(VMapEvents.Error, {
        detail: {
          type: errorType,
          message: this.error.message,
          cause: this.error,
        } satisfies VMapErrorDetail,
        bubbles: true,
        composed: true,
      }));

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
      case 'geostyler':
        return this.parseGeoStyler(styleContent);
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
      throw new Error(`SLD parsing failed: ${error?.message || error}`);
    }
  }

  private async parseMapboxGL(mapboxContent: string): Promise<Style> {
    try {
      // Parse JSON if string
      const mapboxStyle =
        typeof mapboxContent === 'string'
          ? JSON.parse(mapboxContent)
          : mapboxContent;

      if (typeof mapboxStyle !== 'object' || mapboxStyle === null) {
        throw new Error('Parsed Mapbox GL style is not a valid object');
      }

      const { output: style } = await this.mapboxParser.readStyle(mapboxStyle);

      if (!style) {
        throw new Error('Failed to parse Mapbox GL Style - no style output');
      }

      return style;
    } catch (error) {
      throw new Error(
        `Mapbox GL Style parsing failed: ${error?.message || error}`,
      );
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
      throw new Error(`QGIS Style parsing failed: ${error?.message || error}`);
    }
  }

  private async parseLyrx(lyrxContent: string): Promise<Style> {
    try {
      // Parse JSON if string
      const lyrxStyle =
        typeof lyrxContent === 'string' ? JSON.parse(lyrxContent) : lyrxContent;

      if (typeof lyrxStyle !== 'object' || lyrxStyle === null) {
        throw new Error('Parsed LYRX style is not a valid object');
      }

      const { output: style } = await this.lyrxParser.readStyle(lyrxStyle);

      if (!style) {
        throw new Error(
          'Failed to parse LYRX (ArcGIS Pro) Style - no style output',
        );
      }

      return style;
    } catch (error) {
      throw new Error(
        `LYRX (ArcGIS Pro) Style parsing failed: ${error?.message || error}`,
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
  ): Promise<Cesium3DTileStyle> {
    try {
      const style = JSON.parse(jsonContent);

      if (typeof style !== 'object' || style === null) {
        throw new Error('Parsed Cesium 3D Tiles style is not a valid object');
      }

      return style as Cesium3DTileStyle;
    } catch (error) {
      throw new Error(
        `Cesium 3D Tiles style parsing failed: ${error?.message || error}`,
      );
    }
  }

  private async parseGeoStyler(jsonContent: string): Promise<Style> {
    try {
      const style = JSON.parse(jsonContent);

      if (typeof style !== 'object' || style === null) {
        throw new Error('Parsed GeoStyler style is not a valid object');
      }
      if (typeof style.name !== 'string' || !Array.isArray(style.rules)) {
        throw new Error('GeoStyler style must have "name" (string) and "rules" (array)');
      }

      return style as Style;
    } catch (error) {
      throw new Error(
        `GeoStyler style parsing failed: ${error?.message || error}`,
      );
    }
  }

  /**
   * Get the target layer IDs as array. async
   */
  @Method()
  async getLayerTargetIds(): Promise<string[]> {
    return this.getLayerTargets();
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

/**
 * Checks whether the error originated from a failed fetch() call
 * (e.g. "Failed to fetch style from ...") vs. a parse error.
 */
function isRemoteFetchFailure(error: Error): boolean {
  return error.message.startsWith('Failed to fetch style from');
}
