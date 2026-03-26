import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LayerGroups } from './LayerGroups';

/** Minimale RenderableGroup-Implementierung für Tests */
function makeGroup(id: string, layers: any[] = []) {
  return {
    id,
    visible: true,
    isDirty: vi.fn(() => false),
    getLayers: vi.fn(() => layers),
    destroy: vi.fn(),
  };
}

describe('LayerGroups', () => {
  describe('constructor', () => {
    it('startet leer ohne props', () => {
      const store = new LayerGroups();
      expect(store.size).toBe(0);
    });

    it('nimmt initiale Gruppen an', () => {
      const g1 = makeGroup('g1');
      const g2 = makeGroup('g2');
      const store = new LayerGroups({ groups: [g1, g2] as any });
      expect(store.size).toBe(2);
    });

    it('ignoriert Duplikate in initialGroups', () => {
      const g1a = makeGroup('g1');
      const g1b = makeGroup('g1');
      const store = new LayerGroups({ groups: [g1a, g1b] as any });
      expect(store.size).toBe(1);
    });

    it('ignoriert Gruppen ohne id', () => {
      const store = new LayerGroups({ groups: [{ id: '', visible: true, isDirty: vi.fn(), getLayers: vi.fn(() => []) }] as any });
      expect(store.size).toBe(0);
    });
  });

  describe('size & groups', () => {
    it('gibt die korrekte Anzahl zurück', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('a') as any);
      store.addGroup(makeGroup('b') as any);
      expect(store.size).toBe(2);
    });

    it('groups gibt eine Kopie des Arrays zurück', () => {
      const g = makeGroup('a');
      const store = new LayerGroups();
      store.addGroup(g as any);
      const groups = store.groups;
      expect(groups).toHaveLength(1);
      // Kopie: Mutation ändert nicht den internen Store
      (groups as any[]).push(makeGroup('b'));
      expect(store.size).toBe(1);
    });
  });

  describe('getGroup / hasGroup', () => {
    let store: LayerGroups;
    beforeEach(() => {
      store = new LayerGroups();
      store.addGroup(makeGroup('x') as any);
    });

    it('getGroup gibt die Gruppe zurück wenn vorhanden', () => {
      expect(store.getGroup('x')).toBeDefined();
      expect(store.getGroup('x')!.id).toBe('x');
    });

    it('getGroup gibt undefined zurück wenn nicht vorhanden', () => {
      expect(store.getGroup('unknown')).toBeUndefined();
    });

    it('hasGroup gibt true zurück wenn vorhanden', () => {
      expect(store.hasGroup('x')).toBe(true);
    });

    it('hasGroup gibt false zurück wenn nicht vorhanden', () => {
      expect(store.hasGroup('missing')).toBe(false);
    });
  });

  describe('attachDeck / detachDeck / applyToDeck', () => {
    it('applyToDeck tut nichts ohne angehängtes Deck', () => {
      const store = new LayerGroups();
      expect(() => store.applyToDeck()).not.toThrow();
    });

    it('applyToDeck ruft deck.setProps mit sortierten Layern auf', () => {
      const mockDeck = { setProps: vi.fn() };
      const layerA = { props: { zIndex: 2 } };
      const layerB = { props: { zIndex: 1 } };
      const g = makeGroup('g1', [layerA, layerB]);
      g.isDirty.mockReturnValue(true);

      const store = new LayerGroups();
      store.addGroup(g as any);
      store.attachDeck(mockDeck as any);
      store.applyToDeck();

      expect(mockDeck.setProps).toHaveBeenCalledWith({
        layers: expect.arrayContaining([layerB, layerA]),
      });
      // layerB (zIndex 1) sollte vor layerA (zIndex 2) kommen
      const layers: any[] = mockDeck.setProps.mock.calls[0][0].layers;
      expect(layers[0]).toBe(layerB);
      expect(layers[1]).toBe(layerA);
    });

    it('detachDeck entfernt die Deck-Referenz', () => {
      const mockDeck = { setProps: vi.fn() };
      const store = new LayerGroups();
      store.attachDeck(mockDeck as any);
      store.detachDeck();
      store.applyToDeck();
      expect(mockDeck.setProps).not.toHaveBeenCalled();
    });
  });

  describe('addGroup / addGroups', () => {
    it('addGroup fügt eine neue Gruppe hinzu', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('g1') as any);
      expect(store.size).toBe(1);
    });

    it('addGroup ignoriert Duplikate (gleiche id)', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('g1') as any);
      store.addGroup(makeGroup('g1') as any);
      expect(store.size).toBe(1);
    });

    it('addGroup wirft Fehler ohne id', () => {
      const store = new LayerGroups();
      expect(() => store.addGroup({ id: '' } as any)).toThrow();
    });

    it('addGroups fügt mehrere Gruppen hinzu', () => {
      const store = new LayerGroups();
      store.addGroups([makeGroup('a'), makeGroup('b')] as any[]);
      expect(store.size).toBe(2);
    });
  });

  describe('removeGroup', () => {
    it('entfernt eine vorhandene Gruppe', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('g1') as any);
      store.removeGroup('g1');
      expect(store.size).toBe(0);
    });

    it('tut nichts bei nicht vorhandener Gruppe', () => {
      const store = new LayerGroups();
      expect(() => store.removeGroup('missing')).not.toThrow();
    });

    it('ruft destroy() auf wenn opts.destroy=true', () => {
      const g = makeGroup('g1');
      const store = new LayerGroups();
      store.addGroup(g as any);
      store.removeGroup('g1', { destroy: true });
      expect(g.destroy).toHaveBeenCalled();
    });

    it('ruft destroy() nicht auf ohne opts.destroy', () => {
      const g = makeGroup('g1');
      const store = new LayerGroups();
      store.addGroup(g as any);
      store.removeGroup('g1');
      expect(g.destroy).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('entfernt alle Gruppen', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('a') as any);
      store.addGroup(makeGroup('b') as any);
      store.clear();
      expect(store.size).toBe(0);
    });

    it('ruft destroy() auf allen Gruppen wenn opts.destroy=true', () => {
      const g1 = makeGroup('a');
      const g2 = makeGroup('b');
      const store = new LayerGroups();
      store.addGroup(g1 as any);
      store.addGroup(g2 as any);
      store.clear({ destroy: true });
      expect(g1.destroy).toHaveBeenCalled();
      expect(g2.destroy).toHaveBeenCalled();
    });
  });

  describe('replaceGroup', () => {
    it('ersetzt bestehende Gruppe an gleicher Position (keepPosition=true)', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('a') as any);
      store.addGroup(makeGroup('b') as any);
      const newG = makeGroup('a');
      store.replaceGroup(newG as any, true);
      expect(store.size).toBe(2);
      expect(store.getGroup('a')).toBe(newG);
      // Position: 'a' ist noch an Index 0
      expect(store.groups[0].id).toBe('a');
    });

    it('verschiebt ans Ende wenn keepPosition=false', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('a') as any);
      store.addGroup(makeGroup('b') as any);
      const newG = makeGroup('a');
      store.replaceGroup(newG as any, false);
      expect(store.groups[store.size - 1].id).toBe('a');
    });

    it('fügt neue Gruppe hinzu wenn nicht vorhanden', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('a') as any);
      store.replaceGroup(makeGroup('new') as any);
      expect(store.size).toBe(2);
    });
  });

  describe('moveGroup', () => {
    it('verschiebt eine Gruppe an eine neue Position', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('a') as any);
      store.addGroup(makeGroup('b') as any);
      store.addGroup(makeGroup('c') as any);
      store.moveGroup('a', 2);
      expect(store.groups[2].id).toBe('a');
    });

    it('clampst den Index auf gültige Grenzen', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('a') as any);
      store.addGroup(makeGroup('b') as any);
      store.moveGroup('a', 999);
      expect(store.groups[1].id).toBe('a');
    });

    it('tut nichts wenn Gruppe nicht existiert', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('a') as any);
      expect(() => store.moveGroup('missing', 0)).not.toThrow();
    });

    it('tut nichts wenn Index gleich aktuelle Position', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('a') as any);
      store.addGroup(makeGroup('b') as any);
      const before = store.groups.map(g => g.id);
      store.moveGroup('a', 0);
      expect(store.groups.map(g => g.id)).toEqual(before);
    });
  });

  describe('setGroupVisible', () => {
    it('setzt Sichtbarkeit und gibt true zurück bei Änderung', () => {
      const g = makeGroup('g1');
      const store = new LayerGroups();
      store.addGroup(g as any);
      store.attachDeck({ setProps: vi.fn() } as any);
      const changed = store.setGroupVisible('g1', false);
      expect(changed).toBe(true);
      expect(g.visible).toBe(false);
    });

    it('gibt false zurück wenn Sichtbarkeit unverändert', () => {
      const g = makeGroup('g1');
      g.visible = true;
      const store = new LayerGroups();
      store.addGroup(g as any);
      const changed = store.setGroupVisible('g1', true);
      expect(changed).toBe(false);
    });

    it('wirft Fehler wenn Gruppe nicht gefunden', () => {
      const store = new LayerGroups();
      expect(() => store.setGroupVisible('missing', true)).toThrow();
    });
  });

  describe('removeLayer', () => {
    it('entfernt Layer aus Gruppe mit hasLayer/removeLayer API', () => {
      const removeLayerFn = vi.fn();
      const g = {
        id: 'g1',
        visible: true,
        isDirty: vi.fn(() => false),
        getLayers: vi.fn(() => []),
        destroy: vi.fn(),
        hasLayer: vi.fn(() => true),
        removeLayer: removeLayerFn,
      };
      const store = new LayerGroups();
      store.addGroup(g as any);
      store.attachDeck({ setProps: vi.fn() } as any);
      const removed = store.removeLayer('layer-1');
      expect(removed).toBe(true);
      expect(removeLayerFn).toHaveBeenCalledWith('layer-1');
    });

    it('gibt false zurück wenn Layer nicht gefunden', () => {
      const g = {
        id: 'g1',
        visible: true,
        isDirty: vi.fn(() => false),
        getLayers: vi.fn(() => []),
        destroy: vi.fn(),
        hasLayer: vi.fn(() => false),
        removeLayer: vi.fn(),
      };
      const store = new LayerGroups();
      store.addGroup(g as any);
      const removed = store.removeLayer('missing');
      expect(removed).toBe(false);
    });

    it('gibt false zurück für Gruppen ohne Layer-API', () => {
      const g = makeGroup('g1');
      const store = new LayerGroups();
      store.addGroup(g as any);
      const removed = store.removeLayer('layer-1');
      expect(removed).toBe(false);
    });
  });

  describe('setModelEnabled', () => {
    it('delegiert an Gruppe mit setModelEnabled-Methode', () => {
      const setModelEnabledFn = vi.fn();
      const g = {
        id: 'g1',
        visible: true,
        isDirty: vi.fn(() => false),
        getLayers: vi.fn(() => []),
        destroy: vi.fn(),
        setModelEnabled: setModelEnabledFn,
      };
      const store = new LayerGroups();
      store.addGroup(g as any);
      store.attachDeck({ setProps: vi.fn() } as any);
      store.setModelEnabled('g1', 'model-1', true);
      expect(setModelEnabledFn).toHaveBeenCalledWith('model-1', true);
    });

    it('wirft Fehler wenn Gruppe nicht gefunden', () => {
      const store = new LayerGroups();
      expect(() => store.setModelEnabled('missing', 'model-1', true)).toThrow();
    });
  });

  describe('getLayers', () => {
    it('sammelt Layer aus allen Gruppen', () => {
      const layerA = { props: {} };
      const layerB = { props: {} };
      const g1 = makeGroup('g1', [layerA]);
      const g2 = makeGroup('g2', [layerB]);
      g1.isDirty.mockReturnValue(true);

      const store = new LayerGroups();
      store.addGroup(g1 as any);
      store.addGroup(g2 as any);
      const layers = store.getLayers();
      expect(layers).toContain(layerA);
      expect(layers).toContain(layerB);
    });

    it('gibt gecachten Wert zurück wenn nicht dirty', () => {
      const layer = { props: {} };
      const g = makeGroup('g1', [layer]);
      g.isDirty.mockReturnValue(false);

      const store = new LayerGroups();
      store.addGroup(g as any);

      // Erstes getLayers → füllt Cache
      store.getLayers();
      g.getLayers.mockClear();

      // Internes _dirty ist jetzt false → sollte Cache zurückgeben
      store.getLayers();
      // getLayers der Gruppe sollte beim zweiten Aufruf nicht nochmal aufgerufen werden
      expect(g.getLayers).not.toHaveBeenCalled();
    });

    it('markDirty erzwingt neues Berechnen', () => {
      const layer = { props: {} };
      const g = makeGroup('g1', [layer]);
      g.isDirty.mockReturnValue(false);

      const store = new LayerGroups();
      store.addGroup(g as any);
      store.getLayers(); // füllt Cache
      g.getLayers.mockClear();

      store.markDirty();
      store.getLayers();
      expect(g.getLayers).toHaveBeenCalled();
    });
  });

  describe('withUpdate', () => {
    it('führt die übergebene Funktion aus', () => {
      const store = new LayerGroups();
      const fn = vi.fn();
      store.withUpdate(fn);
      expect(fn).toHaveBeenCalledWith(store);
    });
  });

  describe('destroy', () => {
    it('leert alle Gruppen', () => {
      const store = new LayerGroups();
      store.addGroup(makeGroup('a') as any);
      store.destroy();
      expect(store.size).toBe(0);
    });

    it('ruft destroy() auf Gruppen auf wenn destroyGroups=true', () => {
      const g = makeGroup('a');
      const store = new LayerGroups();
      store.addGroup(g as any);
      store.destroy({ destroyGroups: true });
      expect(g.destroy).toHaveBeenCalled();
    });
  });
});
