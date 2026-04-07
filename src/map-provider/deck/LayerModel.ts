import type { Layer } from '@deck.gl/core';

export interface LayerModel<L extends Layer = Layer> {
  id: string;
  elementId: string;
  enabled: boolean; // dein Model-"visible"
  make: () => L; // erzeugt eine (neue) Deck-Instanz
  meta?: Record<string, unknown>;
}
