import type { CesiumNS, OlNS } from './namespaces';
declare global {
  // weil du per <script> lädst:
  var Cesium: CesiumNS | undefined; // globalThis.Cesium
  var ol: OlNS | undefined; // globalThis.ol (falls genutzt)
}
export {};
