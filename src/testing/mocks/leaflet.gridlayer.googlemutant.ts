// src/testing/mocks/leaflet.gridlayer.googlemutant.ts
const GridLayer = jest.fn().mockImplementation(() => ({
  addTo: jest.fn(),
  remove: jest.fn(),
  setOpacity: jest.fn(),
}));

export default GridLayer;
