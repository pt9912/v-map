// src/testing/mocks/geostyler-mapbox-parser.ts
export default class MapboxParser {
  async readStyle(_content: string | object) {
    return {
      output: {
        name: 'Mock Mapbox Style',
        layers: [],
        _meta: { format: 'mapbox-gl' },
      },
    };
  }
}
