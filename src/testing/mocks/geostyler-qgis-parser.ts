// src/testing/mocks/geostyler-qgis-parser.ts
export default class QGISParser {
  async readStyle(_content: string) {
    return {
      output: {
        name: 'Mock QGIS Style',
        rules: [],
        _meta: { format: 'qgis' },
      },
    };
  }
}
