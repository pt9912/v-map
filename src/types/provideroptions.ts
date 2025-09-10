import type { MapInitOptions } from './mapinitoptions';
import type { CssMode } from './cssmode';

export type ProviderOptions = {
  target: HTMLElement;
  shadowRoot?: ShadowRoot;
  mapInitOptions?: MapInitOptions;
  cssMode?: CssMode;
};
