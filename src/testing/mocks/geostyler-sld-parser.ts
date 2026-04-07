// src/testing/mocks/geostyler-sld-parser.ts
export default class SLDParser {
  async readStyle(_content: string) {
    return {
      output: {
        name: 'Mock SLD Style',
        rules: [],
        // Minimale geostyler-style-konforme Struktur
        _meta: { format: 'sld' },
      },
    };
  }
}
