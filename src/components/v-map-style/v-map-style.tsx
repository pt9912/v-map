import { Component, Prop, Element, Event, EventEmitter, Watch, State, h } from '@stencil/core';
import SLDParser from 'geostyler-sld-parser';
import { Style } from 'geostyler-style';

import { log } from '../../utils/logger';
import MSG from '../../utils/messages';

const MSG_COMPONENT = 'v-map-style';

export type StyleFormat = 'sld' | 'mapbox-gl' | 'cartocss' | 'slyr';

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
  @Event() styleReady!: EventEmitter<Style>;

  /**
   * Fired when style parsing fails.
   */
  @Event() styleError!: EventEmitter<Error>;

  @State() private parsedStyle?: Style;
  @State() private isLoading: boolean = false;
  @State() private error?: Error;

  private sldParser = new SLDParser();

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
  async loadAndParseStyle(): Promise<Style | undefined> {
    this.isLoading = true;
    this.error = undefined;

    try {
      let styleContent: string;

      if (this.src) {
        // Fetch style from URL
        const response = await fetch(this.src);
        if (!response.ok) {
          throw new Error(`Failed to fetch style from ${this.src}: ${response.statusText}`);
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

  private async parseStyle(styleContent: string): Promise<Style> {
    switch (this.format) {
      case 'sld':
        return this.parseSLD(styleContent);
      case 'mapbox-gl':
        // TODO: Implement Mapbox GL Style parser
        throw new Error('Mapbox GL Style format not yet implemented');
      case 'cartocss':
        // TODO: Implement CartoCSS parser
        throw new Error('CartoCSS format not yet implemented');
      case 'slyr':
        // TODO: Implement SLYR parser
        throw new Error('SLYR format not yet implemented');
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

  /**
   * Get the currently parsed style.
   */
  getStyle(): Style | undefined {
    return this.parsedStyle;
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
        {this.isLoading && (
          <div class="loading">Loading style...</div>
        )}
        {this.error && (
          <div class="error">
            Style Error: {this.error.message}
          </div>
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