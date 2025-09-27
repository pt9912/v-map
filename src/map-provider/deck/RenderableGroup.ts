import type { Layer } from '@deck.gl/core';

/**
 * Gemeinsames Interface, das sowohl von der klassischen LayerGroup als auch
 * von der modellbasierten LayerGroupWithModel implementiert wird.
 */
export interface RenderableGroup<L extends Layer = Layer> {
  readonly id: string;
  visible: boolean;
  /** true, wenn ein Rebuild der Ausgabe-Layer nötig ist */
  isDirty(): boolean;
  /**
   * Liefert die Deck-Layer zur Darstellung.
   * groups/LayerGroups reichen intern options weiter (falls benötigt).
   */
  getLayers(options?: { respectExternalChanges?: boolean }): readonly L[];
  /** Optionale Ressourcenfreigabe */
  destroy?(): void;
}
