// Mock for @mapbox/tiny-sdf to avoid ES module issues in Jest
export default class TinySDF {
  constructor() {}
  draw(_char: string) {
    return { data: new Uint8ClampedArray(0), width: 0, height: 0 };
  }
}
