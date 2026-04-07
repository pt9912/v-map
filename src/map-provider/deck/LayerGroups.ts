import type { Layer } from '@deck.gl/core';
import type { Deck, DeckProps } from '@deck.gl/core';
import type { RenderableGroup } from './RenderableGroup';

/** Kompatibel zu deck.gl Deck.setProps */
export interface DeckLike {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- deck.gl DeckProps uses generic ViewsT with no suitable narrow type
  setProps(props: Partial<DeckProps<any>>): void;
}

/** Duck-typing for groups that support the classic layer API */
interface ClassicLayerGroup {
  hasLayer(id: string): boolean;
  removeLayer(id: string): void;
}

/** Duck-typing for groups that support model-based enabled toggle */
interface ModelBasedGroup {
  setModelEnabled(modelId: string, enabled: boolean): void;
}

/* ============================================================================
 * LayerGroupsProps – Konfiguration für den LayerGroups-Store
 * ========================================================================== */
export interface LayerGroupsProps<
  L extends Layer = Layer,
  G extends RenderableGroup<L> = RenderableGroup<L>,
> {
  groups?: ReadonlyArray<G>;
}

/* ============================================================================
 * LayerGroups – Root-Store (arbeitet mit RenderableGroup: LayerGroup ODER LayerGroupWithModel)
 * ============================================================================
 */
export class LayerGroups<
  L extends Layer = Layer,
  G extends RenderableGroup<L> = RenderableGroup<L>,
> {
  private _groups: G[] = [];

  private _dirty = true;
  private _cachedLayers: readonly L[] = [];
  private _deck: DeckLike | null = null;

  constructor(props: LayerGroupsProps<L, G> = {}) {
    if (props.groups?.length) {
      const seen = new Set<string>();
      for (const g of props.groups) {
        if (!g?.id || seen.has(g.id)) continue;
        seen.add(g.id);
        this._groups.push(g);
      }
      this._dirty = true;
    }
  }

  /* ------------------------------- Abfragen ------------------------------- */

  get size(): number {
    return this._groups.length;
  }
  get groups(): readonly G[] {
    return [...this._groups];
  }
  getGroup(id: string): G | undefined {
    return this._groups.find(g => g.id === id);
  }
  hasGroup(id: string): boolean {
    return this._groups.some(g => g.id === id);
  }

  /* ------------------------------ Deck-Bindung ----------------------------- */

  attachDeck(deck: Deck | DeckLike): void {
    this._deck = deck;
  }
  detachDeck(): void {
    this._deck = null;
  }

  applyToDeck(options: { respectExternalChanges?: boolean } = {}): void {
    if (!this._deck) return;
    const updated = this.getLayers(options);

    // --- Sortierung nach zIndex ---
    const sorted = [...updated].sort((a, b) => {
      const aZ = ((a.props as unknown as Record<string, unknown>).zIndex as number) ?? 0;
      const bZ = ((b.props as unknown as Record<string, unknown>).zIndex as number) ?? 0;
      return aZ - bZ;
    });

    this._deck.setProps({ layers: sorted });
  }

  /* ------------------------------ Mutationen ------------------------------ */

  addGroup(group: G): void {
    if (!group?.id) throw new Error('LayerGroup benötigt eine eindeutige id');
    if (this.hasGroup(group.id)) return;
    this._groups.push(group);
    this._dirty = true;
  }

  addGroups(groups: ReadonlyArray<G>): void {
    groups.forEach(g => this.addGroup(g));
  }

  removeGroup(id: string, opts?: { destroy?: boolean }): void {
    const idx = this._groups.findIndex(g => g.id === id);
    if (idx < 0) return;
    const [g] = this._groups.splice(idx, 1);
    if (opts?.destroy) g.destroy?.();
    this._dirty = true;
  }

  clear(opts?: { destroy?: boolean }): void {
    if (opts?.destroy) this._groups.forEach(g => g.destroy?.());
    this._groups = [];
    this._dirty = true;
  }

  replaceGroup(group: G, keepPosition = true): void {
    const idx = this._groups.findIndex(g => g.id === group.id);
    if (idx < 0) {
      this._groups.push(group);
    } else {
      if (keepPosition) {
        this._groups[idx] = group;
      } else {
        this._groups.splice(idx, 1);
        this._groups.push(group);
      }
    }
    this._dirty = true;
  }

  moveGroup(id: string, toIndex: number): void {
    const from = this._groups.findIndex(g => g.id === id);
    if (from < 0) return;
    const clamped = Math.max(0, Math.min(this._groups.length - 1, toIndex));
    if (from === clamped) return;
    const [g] = this._groups.splice(from, 1);
    this._groups.splice(clamped, 0, g);
    this._dirty = true;
  }

  setGroupVisible(
    id: string,
    visible: boolean,
    opts: { respectExternalChanges?: boolean } = {},
  ): boolean {
    const g = this.getGroup(id);
    if (!g) throw new Error(`LayerGroup mit id "${id}" nicht gefunden`);
    if (g.visible === visible) return false;

    g.visible = visible;
    this._dirty = true;
    this.applyToDeck({ respectExternalChanges: opts.respectExternalChanges });
    return true;
  }

  /**
   * Entfernt einen Layer mit gegebener ID aus allen Gruppen, die
   * klassische LayerGroup **unterstützen**. Bei modellbasierten Gruppen
   * suchst du nach Model-ID und nutzt removeModel().
   */
  removeLayer(
    layerId: string,
    opts: { removeFromAll?: boolean; respectExternalChanges?: boolean } = {},
  ): boolean {
    let removed = false;

    for (const g of this._groups) {
      // nur wenn Gruppe die klassische Layer-API hat
      const candidate = g as unknown as Partial<ClassicLayerGroup>;

      if (typeof candidate.hasLayer === 'function' && typeof candidate.removeLayer === 'function') {
        if (candidate.hasLayer(layerId)) {
          candidate.removeLayer(layerId);
          removed = true;
          if (!opts.removeFromAll) break;
        }
      }
    }

    if (removed) {
      this._dirty = true;
      this.applyToDeck({ respectExternalChanges: opts.respectExternalChanges });
    }
    return removed;
  }

  /**
   * Convenience: Für modellbasierte Gruppen – LayerModel enabled togglen.
   * No-Op für klassische LayerGroup.
   */
  setModelEnabled(
    groupId: string,
    modelId: string,
    enabled: boolean,
    opts: { apply?: boolean } = { apply: true },
  ): void {
    const g = this.getGroup(groupId);
    if (!g) throw new Error(`Gruppe "${groupId}" nicht gefunden`);

    // Prüfen, ob g modellbasiert ist (has setModelEnabled)
    const candidate = g as unknown as Partial<ModelBasedGroup>;
    if (typeof candidate.setModelEnabled === 'function') {
      candidate.setModelEnabled(modelId, enabled);
      this._dirty = true;
      if (opts.apply) this.applyToDeck();
    }
  }

  withUpdate(fn: (store: this) => void): void {
    this._dirty = true;
    fn(this);
  }

  /* ---------------------------- Flattening/Output --------------------------- */

  getLayers(options: { respectExternalChanges?: boolean } = {}): readonly L[] {
    // Auch Gruppen-Dirty berücksichtigen
    const anyGroupDirty = this._groups.some(g => g.isDirty());
    if (!this._dirty && !anyGroupDirty) {
      return this._cachedLayers;
    }

    const out: L[] = [];
    for (const group of this._groups) {
      const layers = group.getLayers(options);
      if (layers.length) out.push(...layers);
    }

    this._cachedLayers = out;
    this._dirty = false;
    return this._cachedLayers;
  }

  markDirty(): void {
    this._dirty = true;
  }

  destroy(opts?: { destroyGroups?: boolean }): void {
    if (opts?.destroyGroups) this._groups.forEach(g => g.destroy?.());
    this._groups = [];
    this._cachedLayers = [];
    this._dirty = true;
  }
}
