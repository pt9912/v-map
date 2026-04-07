// src/testing/mocks/geostyler-lyrx-parser.ts
export default class LyrxParser {
  async readStyle(_content: string | object) {
    return {
      output: {
        name: 'Mock LYRX Style',
        layers: [],
        _meta: { format: 'lyrx' },
      },
    };
  }
}
