import type { MapInitOptions } from './mapinitoptions';
import type { CssMode } from './cssmode';

export type ProviderOptions = {
  target: HTMLDivElement;
  shadowRoot?: ShadowRoot;
  mapInitOptions?: MapInitOptions;
  cssMode?: CssMode;
};
