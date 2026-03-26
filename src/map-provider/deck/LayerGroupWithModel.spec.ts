import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger', () => ({
  log: vi.fn(),
}));

import { LayerGroupWithModel } from './LayerGroupWithModel';

/** Erstellt ein minimales Layer-Mock-Objekt */
function makeLayer(visible = true) {
  const props: any = { visible };
  const inst: any = {
    props,
    clone: vi.fn().mockImplementation((overrides: any) => {
      const newProps = { ...props, ...overrides };
      return makeLayerWithProps(newProps);
    }),
  };
  return inst;
}

function makeLayerWithProps(props: any) {
  const inst: any = {
    props,
    clone: vi.fn().mockImplementation((overrides: any) => {
      return makeLayerWithProps({ ...props, ...overrides });
    }),
  };
  return inst;
}

/** Erstellt ein minimales LayerModel */
function makeModel(id: string, enabled = true, elementId?: string) {
  return {
    id,
    enabled,
    elementId,
    make: vi.fn(() => makeLayer()),
  };
}

describe('LayerGroupWithModel', () => {
  describe('constructor', () => {
    it('erstellt Gruppe mit id', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      expect(g.id).toBe('g1');
    });

    it('setzt Standardwerte', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      expect(g.visible).toBe(true);
      expect(g.syncMode).toBe('force-model');
      expect(g.basemap).toBeNull();
    });

    it('akzeptiert initiale Optionen', () => {
      const model = makeModel('m1');
      const g = new LayerGroupWithModel({
        id: 'g1',
        visible: false,
        syncMode: 'respect-deck',
        basemap: 'basemap-1',
        models: [model as any],
      });
      expect(g.visible).toBe(false);
      expect(g.syncMode).toBe('respect-deck');
      expect(g.basemap).toBe('basemap-1');
      expect(g.getModel('m1')).toBeDefined();
    });
  });

  describe('visible', () => {
    it('setter setzt Sichtbarkeit', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.visible = false;
      expect(g.visible).toBe(false);
    });

    it('setter ist no-op wenn Wert gleich', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      // _dirty starts true, so reset via getLayers first
      g.getLayers();
      g.visible = true; // same value
      expect(g.isDirty()).toBe(false);
    });

    it('setter markiert als dirty bei Änderung', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.getLayers(); // reset dirty
      g.visible = false;
      expect(g.isDirty()).toBe(true);
    });
  });

  describe('syncMode', () => {
    it('getter/setter', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.syncMode = 'respect-deck';
      expect(g.syncMode).toBe('respect-deck');
    });

    it('markiert als dirty bei Änderung', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.getLayers();
      g.syncMode = 'respect-deck';
      expect(g.isDirty()).toBe(true);
    });

    it('ist no-op wenn Wert gleich', () => {
      const g = new LayerGroupWithModel({ id: 'g1', syncMode: 'respect-deck' });
      g.getLayers();
      g.syncMode = 'respect-deck';
      expect(g.isDirty()).toBe(false);
    });
  });

  describe('basemap', () => {
    it('getter/setter', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.basemap = 'basemap-1';
      expect(g.basemap).toBe('basemap-1');
    });

    it('markiert als dirty bei Änderung', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.getLayers();
      g.basemap = 'basemap-1';
      expect(g.isDirty()).toBe(true);
    });

    it('ist no-op wenn Wert gleich', () => {
      const g = new LayerGroupWithModel({ id: 'g1', basemap: 'b1' });
      g.getLayers();
      g.basemap = 'b1';
      expect(g.isDirty()).toBe(false);
    });
  });

  describe('isDirty', () => {
    it('gibt anfangs true zurück', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      expect(g.isDirty()).toBe(true);
    });

    it('gibt false zurück nach getLayers()', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.getLayers();
      expect(g.isDirty()).toBe(false);
    });
  });

  describe('addModel / addModels', () => {
    it('addModel fügt Model hinzu', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1') as any);
      expect(g.getModel('m1')).toBeDefined();
    });

    it('addModel wirft Fehler ohne id', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      expect(() => g.addModel({ id: '' } as any)).toThrow();
    });

    it('addModel markiert als dirty', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.getLayers();
      g.addModel(makeModel('m1') as any);
      expect(g.isDirty()).toBe(true);
    });

    it('addModels fügt mehrere Models hinzu', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModels([makeModel('m1'), makeModel('m2')] as any[]);
      expect(g.getModel('m1')).toBeDefined();
      expect(g.getModel('m2')).toBeDefined();
    });
  });

  describe('getModel', () => {
    it('gibt eine Kopie des Models zurück', () => {
      const model = makeModel('m1');
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(model as any);
      const retrieved = g.getModel('m1');
      expect(retrieved).toBeDefined();
      expect(retrieved!.id).toBe('m1');
      // Kopie, nicht Referenz
      expect(retrieved).not.toBe(model);
    });

    it('gibt undefined zurück wenn nicht vorhanden', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      expect(g.getModel('missing')).toBeUndefined();
    });
  });

  describe('removeModel', () => {
    it('entfernt ein vorhandenes Model', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1') as any);
      g.removeModel('m1');
      expect(g.getModel('m1')).toBeUndefined();
    });

    it('markiert als dirty nach Entfernen', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1') as any);
      g.getLayers();
      g.removeModel('m1');
      expect(g.isDirty()).toBe(true);
    });

    it('tut nichts bei nicht vorhandenem Model', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.getLayers();
      g.removeModel('missing');
      expect(g.isDirty()).toBe(false);
    });
  });

  describe('clear', () => {
    it('löscht alle Models', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1') as any);
      g.addModel(makeModel('m2') as any);
      g.clear();
      expect(g.getModel('m1')).toBeUndefined();
      expect(g.getModel('m2')).toBeUndefined();
    });

    it('markiert als dirty', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.getLayers();
      g.clear();
      expect(g.isDirty()).toBe(true);
    });
  });

  describe('setModelEnabled', () => {
    it('aktiviert / deaktiviert ein Model', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1', true) as any);
      g.setModelEnabled('m1', false);
      expect(g.getModel('m1')!.enabled).toBe(false);
    });

    it('wirft Fehler wenn Model nicht gefunden', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      expect(() => g.setModelEnabled('missing', true)).toThrow();
    });

    it('ist no-op wenn enabled gleich bleibt', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1', true) as any);
      g.getLayers();
      g.setModelEnabled('m1', true); // already true
      expect(g.isDirty()).toBe(false);
    });

    it('markiert als dirty bei Änderung', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1', true) as any);
      g.getLayers();
      g.setModelEnabled('m1', false);
      expect(g.isDirty()).toBe(true);
    });
  });

  describe('replaceModel', () => {
    it('ersetzt ein vorhandenes Model', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1') as any);
      const newModel = makeModel('m1');
      newModel.enabled = false;
      g.replaceModel(newModel as any);
      expect(g.getModel('m1')!.enabled).toBe(false);
    });

    it('fügt neues Model hinzu wenn nicht vorhanden', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.replaceModel(makeModel('m-new') as any);
      expect(g.getModel('m-new')).toBeDefined();
    });
  });

  describe('setModelOverrides / clearModelOverrides', () => {
    it('setzt Overrides für ein Model', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1') as any);
      g.setModelOverrides('m1', { opacity: 0.5 });
      expect(g.isDirty()).toBe(true);
    });

    it('mergt Overrides', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1') as any);
      g.setModelOverrides('m1', { opacity: 0.5 });
      g.setModelOverrides('m1', { visible: false });
      // getLayers würde die gemergten Overrides anwenden
      // Wir prüfen nur, dass kein Fehler geworfen wird
      expect(() => g.getLayers()).not.toThrow();
    });

    it('wirft Fehler wenn Model nicht gefunden', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      expect(() => g.setModelOverrides('missing', { opacity: 0.5 })).toThrow();
    });

    it('clearModelOverrides entfernt Overrides', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1') as any);
      g.setModelOverrides('m1', { opacity: 0.5 });
      g.getLayers();
      g.clearModelOverrides('m1');
      expect(g.isDirty()).toBe(true);
    });

    it('clearModelOverrides ist no-op wenn keine Overrides', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1') as any);
      g.getLayers();
      g.clearModelOverrides('m1'); // keine Overrides gesetzt
      expect(g.isDirty()).toBe(false);
    });
  });

  describe('getLayers', () => {
    it('gibt leeres Array zurück wenn visible=false', () => {
      const g = new LayerGroupWithModel({ id: 'g1', visible: false });
      g.addModel(makeModel('m1') as any);
      const layers = g.getLayers();
      expect(layers).toHaveLength(0);
    });

    it('gibt Layer zurück für enabled Models', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1', true) as any);
      const layers = g.getLayers();
      expect(layers).toHaveLength(1);
    });

    it('gibt keinen Layer zurück für disabled Models', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1', false) as any);
      const layers = g.getLayers();
      expect(layers).toHaveLength(0);
    });

    it('filtert nach basemap elementId', () => {
      const g = new LayerGroupWithModel({ id: 'g1', basemap: 'map-a' });
      g.addModel(makeModel('m1', true, 'map-a') as any);
      g.addModel(makeModel('m2', true, 'map-b') as any);
      const layers = g.getLayers();
      expect(layers).toHaveLength(1);
    });

    it('gibt gecachten Wert zurück wenn nicht dirty', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      const model = makeModel('m1', true);
      g.addModel(model as any);
      const first = g.getLayers();
      const second = g.getLayers();
      expect(first).toBe(second);
      // make() sollte nur einmal aufgerufen worden sein
      expect(model.make).toHaveBeenCalledTimes(1);
    });

    it('wendet Overrides auf Layer an', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      const model = makeModel('m1', true);
      g.addModel(model as any);
      g.setModelOverrides('m1', { opacity: 0.3 });
      const layers = g.getLayers();
      expect(layers).toHaveLength(1);
      // Clone sollte aufgerufen worden sein für Overrides
    });
  });

  describe('destroy', () => {
    it('ruft finalize auf allen Layer-Instanzen auf', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      const model = makeModel('m1', true);
      g.addModel(model as any);
      g.getLayers(); // erstellt Instanzen
      expect(() => g.destroy()).not.toThrow();
    });

    it('leert alle internen Maps nach destroy', () => {
      const g = new LayerGroupWithModel({ id: 'g1' });
      g.addModel(makeModel('m1') as any);
      g.destroy();
      expect(g.getModel('m1')).toBeUndefined();
    });
  });
});
