/**
 * Gemeinsame API für alle Map‑Layer‑Components.
 */
export interface VMapLayer {
  /** Sichtbarkeit des Layers */
  visible: boolean;
  opacity: number;
  zIndex: number;

  isReady?(): boolean;
  //   /** Optionaler eindeutiger Identifier */
  //   id?: string;
}
