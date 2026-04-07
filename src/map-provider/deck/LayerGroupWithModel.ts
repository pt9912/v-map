// LayerGroupWithModel.ts
import type { Layer } from '@deck.gl/core';
import type { RenderableGroup } from './RenderableGroup';
import type { LayerModel } from './LayerModel';
import { log } from '../../utils/logger';

export type SyncMode = 'force-model' | 'respect-deck';

type LayerOverrides<L extends Layer> = Partial<L['props']> & {
  // ein paar häufige Props explizit, damit TS nicht meckert
  opacity?: number;
  visible?: boolean;
  zIndex?: number;
  data?: unknown;
  url?: string;
};

export class LayerGroupWithModel<L extends Layer = Layer>
  implements RenderableGroup<L>
{
  readonly id: string;
  private _visible = true;
  private _syncMode: SyncMode = 'force-model';
  private _models = new Map<string, LayerModel<L>>();
  private _instances = new Map<string, L>();
  private _recreateOnNextEmit = false;
  private _overrides = new Map<string, LayerOverrides<L>>(); // <<<< NEU
  private _dirty = true;
  private _cachedLayers: readonly L[] = [];
  private _basemap: string | null = null;

  constructor(opts: {
    id: string;
    visible?: boolean;
    syncMode?: SyncMode;
    models?: ReadonlyArray<LayerModel<L>>;
    basemap?: string | null;
  }) {
    this.id = opts.id;
    this._visible = opts.visible ?? true;
    this._syncMode = opts.syncMode ?? 'force-model';
    this._basemap = opts.basemap ?? null;
    (opts.models ?? []).forEach(m => this.addModel(m));
  }

  get visible() {
    return this._visible;
  }
  set visible(v: boolean) {
    if (this._visible === v) return;
    this._visible = v;
    if (!v) {
      this._instances.clear(); // finalisierte Instanzen verwerfen
      this._recreateOnNextEmit = true;
    }
    this._dirty = true;
  }
  get syncMode() {
    return this._syncMode;
  }
  set syncMode(m: SyncMode) {
    if (this._syncMode !== m) {
      this._syncMode = m;
      this._dirty = true;
    }
  }
  set basemap(b: string | null) {
    if (this._basemap === b) return;
    this._basemap = b;
    // Basemap-Änderung kann viele Modelle temporär entfernen
    this._instances.clear();
    this._recreateOnNextEmit = true;
    this._dirty = true;
  }
  get basemap() {
    return this._basemap;
  }
  isDirty(): boolean {
    return this._dirty;
  }

  addModel(model: LayerModel<L>) {
    if (!model?.id) throw new Error('LayerModel benötigt id');
    this._models.set(model.id, { ...model });
    this._dirty = true;
  }
  addModels(models: ReadonlyArray<LayerModel<L>>) {
    models.forEach(m => this.addModel(m));
  }
  getModel(id: string) {
    const m = this._models.get(id);
    return m ? { ...m } : undefined;
  }
  removeModel(id: string) {
    if (this._models.delete(id)) {
      this._instances.delete(id);
      this._overrides.delete(id);
      this._dirty = true;
    }
  }
  clear() {
    this._models.clear();
    this._instances.clear();
    this._overrides.clear();
    this._cachedLayers = [];
    this._dirty = true;
  }
  setModelEnabled(id: string, enabled: boolean) {
    const m = this._models.get(id);
    if (!m) throw new Error(`LayerModel "${id}" nicht gefunden`);
    if (m.enabled === enabled) return;
    m.enabled = enabled;
    if (!enabled) {
      this._instances.delete(id); // bei Disable die Instanz verwerfen
    }
    this._dirty = true;
  }
  replaceModel(model: LayerModel<L>) {
    const had = this._models.has(model.id);
    this._models.set(model.id, { ...model });
    this._dirty = this._dirty || !had;
  }

  setModelOverrides(id: string, overrides: LayerOverrides<L>): void {
    if (!this._models.has(id))
      throw new Error(`LayerModel "${id}" nicht gefunden`);
    const current = this._overrides.get(id) ?? {};
    this._overrides.set(id, { ...current, ...overrides });
    this._dirty = true;
  }

  clearModelOverrides(id: string): void {
    if (this._overrides.delete(id)) this._dirty = true;
  }

  getLayers(): readonly L[] {
    if (!this._dirty && this._cachedLayers.length) return this._cachedLayers;
    if (!this._visible) {
      this._cachedLayers = [];
      this._dirty = false;
      return this._cachedLayers;
    }

    const out: L[] = [];
    for (const [id, model] of this._models.entries()) {
      let effective = this._visible && model.enabled;
      if (this._basemap && model.elementId !== this._basemap) {
        effective = false;
      }
      if (!effective) {
        this._instances.delete(id);
        continue;
      }

      // Instanz frisch erzeugen, wenn keine da (oder nach clear)
      let inst = this._instances.get(id);
      if (!inst || this._recreateOnNextEmit) {
        log('deck - lgwm - getLayers - model.make()');
        const base = model.make(); // neue Instanz
        const cur = base.props.visible ?? true;
        inst = cur === true ? base : (base.clone({ visible: true }) as L);
        this._instances.set(id, inst);
      }

      // force-model: Sichtbarkeit durchsetzen
      if (this._syncMode === 'force-model') {
        const cur = inst.props.visible ?? true;
        if (cur !== effective) {
          inst = inst.clone({ visible: effective }) as L;
          this._instances.set(id, inst);
        }
      }

      // Overrides anwenden (nur klonen, wenn sich was ändert)
      const ov = this._overrides.get(id);
      if (ov && Object.keys(ov).length) {
        const needClone = Object.entries(ov).some(
          ([k, v]) => (inst!.props as unknown as Record<string, unknown>)[k] !== v,
        );
        if (needClone) {
          inst = inst.clone(ov) as L;
          this._instances.set(id, inst);
        }
      }

      // nur liefern, wenn Model enabled
      // if (model.enabled)
      out.push(inst);
    }
    this._recreateOnNextEmit = false;

    this._cachedLayers = out;
    this._dirty = false;
    return this._cachedLayers;
  }

  destroy(): void {
    this._instances.forEach(l =>
      (l as unknown as { finalize?: () => void }).finalize?.(),
    );
    this.clear();
  }
}
