// Mock for @npm9912/s-gml to avoid ES module issues in Jest
export class GmlParser {
  parse(_gmlString: string) {
    return {
      type: 'FeatureCollection',
      features: [],
    };
  }
}

export default { GmlParser };
