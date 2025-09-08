/**
 * Gemeinsame API für alle Map‑Layer‑Components.
 */
export interface VMapLayer {
  /** Sichtbarkeit des Layers */
  visible: boolean;
  opacity: number;

  addToMap(mapElement: HTMLVMapElement): Promise<void>;

  isReady?(): boolean;
  //   /** Erneutes Rendern des Layers auslösen */
  //   refresh(): void;

  //   /** Optionaler eindeutiger Identifier */
  //   id?: string;
}
