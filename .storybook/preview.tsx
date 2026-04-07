import { type Preview } from '@stencil/storybook-plugin';

import { defineCustomElements } from '../loader/index.js';

defineCustomElements();

export const parameters: Preview['parameters'] = {
  docs: {
    inlineStories: true,
    source: {
      excludeDecorators: true,
    },
  },
};

export const tags: Preview['tags'] = ['autodocs'];
