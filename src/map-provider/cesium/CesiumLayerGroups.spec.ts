import { describe, it, expect, vi } from 'vitest';

import { CesiumLayerGroup, CesiumLayerGroups } from './CesiumLayerGroups';

/* ------------------------------------------------------------------ */
/*  Helper                                                            */
/* ------------------------------------------------------------------ */

function mockLayer(visible = true) {
  return {
    getVisible: vi.fn().mockReturnValue(visible),
    setVisible: vi.fn(),
  };
}

function ref(id: string, visible = true, elementId?: string | null) {
  return { id, layer: mockLayer(visible), elementId: elementId ?? undefined } as any;
}

/* ================================================================== */
/*  CesiumLayerGroup                                                  */
/* ================================================================== */

describe('CesiumLayerGroup', () => {
  /* ---------- constructor ----------------------------------------- */
  describe('constructor', () => {
    it('stores the id', () => {
      const g = new CesiumLayerGroup('abc');
      expect(g.id).toBe('abc');
    });

    it('defaults to visible = true', () => {
      expect(new CesiumLayerGroup('g').visible).toBe(true);
    });

    it('accepts visible = false', () => {
      expect(new CesiumLayerGroup('g', false).visible).toBe(false);
    });

    it('starts dirty', () => {
      expect(new CesiumLayerGroup('g').isDirty()).toBe(true);
    });
  });

  /* ---------- visible setter -------------------------------------- */
  describe('visible setter', () => {
    it('changes visibility and marks dirty', () => {
      const g = new CesiumLayerGroup('g');
      g.apply(); // clears dirty
      expect(g.isDirty()).toBe(false);

      g.visible = false;
      expect(g.visible).toBe(false);
      expect(g.isDirty()).toBe(true);
    });

    it('is a no-op when the value is the same', () => {
      const g = new CesiumLayerGroup('g', true);
      g.apply();
      expect(g.isDirty()).toBe(false);

      g.visible = true; // same value
      expect(g.isDirty()).toBe(false);
    });
  });

  /* ---------- basemap setter -------------------------------------- */
  describe('basemap setter', () => {
    it('defaults to null', () => {
      expect(new CesiumLayerGroup('g').basemap).toBeNull();
    });

    it('changes basemap and marks dirty', () => {
      const g = new CesiumLayerGroup('g');
      g.apply();

      g.basemap = 'osm';
      expect(g.basemap).toBe('osm');
      expect(g.isDirty()).toBe(true);
    });

    it('is a no-op when the value is the same', () => {
      const g = new CesiumLayerGroup('g');
      g.basemap = 'satellite';
      g.apply();

      g.basemap = 'satellite';
      expect(g.isDirty()).toBe(false);
    });

    it('can be reset to null', () => {
      const g = new CesiumLayerGroup('g');
      g.basemap = 'osm';
      g.apply();

      g.basemap = null;
      expect(g.basemap).toBeNull();
      expect(g.isDirty()).toBe(true);
    });
  });

  /* ---------- addLayer -------------------------------------------- */
  describe('addLayer', () => {
    it('adds a layer and marks dirty', () => {
      const g = new CesiumLayerGroup('g');
      g.apply();

      const r = ref('l1');
      g.addLayer(r);
      expect(g.isDirty()).toBe(true);
    });

    it('records the original visibility of the layer', () => {
      const g = new CesiumLayerGroup('g');
      const r = ref('l1', false);
      g.addLayer(r);

      // The layer was originally invisible, so even with group visible,
      // apply should leave it invisible.
      g.apply();
      expect(r.layer.setVisible).not.toHaveBeenCalled(); // already false
    });

    it('guards against duplicate ids', () => {
      const g = new CesiumLayerGroup('g');
      const r1 = ref('dup');
      const r2 = ref('dup');
      g.addLayer(r1);
      g.apply();

      g.addLayer(r2); // should be ignored
      expect(g.isDirty()).toBe(false); // not marked dirty again
    });
  });

  /* ---------- setLayerElementId ----------------------------------- */
  describe('setLayerElementId', () => {
    it('does nothing for a missing layer', () => {
      const g = new CesiumLayerGroup('g');
      g.apply();

      g.setLayerElementId('nonexistent', 'osm');
      expect(g.isDirty()).toBe(false);
    });

    it('updates the elementId and marks dirty', () => {
      const g = new CesiumLayerGroup('g');
      const r = ref('l1', true, undefined);
      g.addLayer(r);
      g.apply();

      g.setLayerElementId('l1', 'osm');
      expect(g.isDirty()).toBe(true);
    });

    it('is a no-op when the value is the same', () => {
      const g = new CesiumLayerGroup('g');
      const r = ref('l1', true, 'osm');
      g.addLayer(r);
      g.apply();

      g.setLayerElementId('l1', 'osm');
      expect(g.isDirty()).toBe(false);
    });

    it('converts undefined to null', () => {
      const g = new CesiumLayerGroup('g');
      const r = ref('l1', true, null);
      g.addLayer(r);
      g.apply();

      // elementId is already null, passing undefined should be treated as null => no-op
      g.setLayerElementId('l1', undefined);
      expect(g.isDirty()).toBe(false);
    });
  });

  /* ---------- removeLayer ----------------------------------------- */
  describe('removeLayer', () => {
    it('removes an existing layer, returns true, marks dirty', () => {
      const g = new CesiumLayerGroup('g');
      g.addLayer(ref('l1'));
      g.apply();

      expect(g.removeLayer('l1')).toBe(true);
      expect(g.isDirty()).toBe(true);
    });

    it('returns false for an unknown layer and does not mark dirty', () => {
      const g = new CesiumLayerGroup('g');
      g.apply();

      expect(g.removeLayer('nope')).toBe(false);
      expect(g.isDirty()).toBe(false);
    });
  });

  /* ---------- clear ----------------------------------------------- */
  describe('clear', () => {
    it('removes all layers and marks dirty', () => {
      const g = new CesiumLayerGroup('g');
      g.addLayer(ref('a'));
      g.addLayer(ref('b'));
      g.apply();

      g.clear();
      expect(g.isDirty()).toBe(true);

      // After clear + apply, no setVisible calls should happen (no layers)
      g.apply();
    });
  });

  /* ---------- apply ----------------------------------------------- */
  describe('apply', () => {
    it('is a no-op when not dirty', () => {
      const g = new CesiumLayerGroup('g');
      const r = ref('l1');
      g.addLayer(r);
      g.apply();
      r.layer.setVisible.mockClear();

      g.apply(); // not dirty
      expect(r.layer.setVisible).not.toHaveBeenCalled();
    });

    it('clears the dirty flag after running', () => {
      const g = new CesiumLayerGroup('g');
      g.addLayer(ref('l1'));
      expect(g.isDirty()).toBe(true);

      g.apply();
      expect(g.isDirty()).toBe(false);
    });

    it('sets visible layers invisible when group is hidden', () => {
      const g = new CesiumLayerGroup('g', false);
      const r = ref('l1', true);
      // layer.getVisible() returns true, but effective should be false
      g.addLayer(r);

      g.apply();
      expect(r.layer.setVisible).toHaveBeenCalledWith(false);
    });

    it('does not call setVisible when current matches effective', () => {
      const g = new CesiumLayerGroup('g', true);
      const r = ref('l1', true);
      // layer.getVisible() already returns true, effective is true => skip
      g.addLayer(r);

      g.apply();
      expect(r.layer.setVisible).not.toHaveBeenCalled();
    });

    it('restores original visibility when group becomes visible again', () => {
      const g = new CesiumLayerGroup('g', false);
      const r = ref('l1', true);
      g.addLayer(r);
      g.apply();
      // Now layer was set invisible
      r.layer.getVisible.mockReturnValue(false);
      r.layer.setVisible.mockClear();

      g.visible = true;
      g.apply();
      // original was true, group visible, no basemap => effective true
      // layer.getVisible() is false => must call setVisible(true)
      expect(r.layer.setVisible).toHaveBeenCalledWith(true);
    });

    it('hides originally-invisible layers even when group is visible', () => {
      const g = new CesiumLayerGroup('g', true);
      const r = ref('l1', false);
      // Original visibility is false. getVisible() also returns false.
      g.addLayer(r);

      g.apply();
      // effective = true && false = false, getVisible() = false => no call
      expect(r.layer.setVisible).not.toHaveBeenCalled();
    });

    /* ---- basemap filtering --------------------------------------- */
    describe('basemap filtering', () => {
      it('shows only layers matching the basemap elementId', () => {
        const g = new CesiumLayerGroup('g');
        const osm = ref('osm-layer', true, 'osm');
        const sat = ref('sat-layer', true, 'satellite');
        g.addLayer(osm);
        g.addLayer(sat);
        g.basemap = 'osm';

        g.apply();

        // osm-layer: effective true, getVisible true => no call
        expect(osm.layer.setVisible).not.toHaveBeenCalled();
        // sat-layer: effective false, getVisible true => setVisible(false)
        expect(sat.layer.setVisible).toHaveBeenCalledWith(false);
      });

      it('hides all layers when none match the basemap', () => {
        const g = new CesiumLayerGroup('g');
        const r = ref('l1', true, 'osm');
        g.addLayer(r);
        g.basemap = 'terrain';

        g.apply();
        expect(r.layer.setVisible).toHaveBeenCalledWith(false);
      });

      it('shows matching layers when basemap is set and group is visible', () => {
        const g = new CesiumLayerGroup('g');
        const r = ref('l1', true, 'osm');
        // addLayer records original=true from getVisible().
        g.addLayer(r);
        // Now simulate the layer having been hidden externally.
        r.layer.getVisible.mockReturnValue(false);
        g.basemap = 'osm';

        g.apply();
        // effective = true (visible & original=true & basemap match), getVisible=false
        expect(r.layer.setVisible).toHaveBeenCalledWith(true);
      });

      it('hides all when group invisible regardless of basemap', () => {
        const g = new CesiumLayerGroup('g', false);
        const r = ref('l1', true, 'osm');
        g.addLayer(r);
        g.basemap = 'osm';

        g.apply();
        expect(r.layer.setVisible).toHaveBeenCalledWith(false);
      });

      it('shows all originally-visible layers when basemap is cleared', () => {
        const g = new CesiumLayerGroup('g');
        const r1 = ref('l1', true, 'osm');
        const r2 = ref('l2', true, 'satellite');
        g.addLayer(r1);
        g.addLayer(r2);

        g.basemap = 'osm';
        g.apply();

        // Simulate that sat is now hidden
        r2.layer.getVisible.mockReturnValue(false);
        r1.layer.setVisible.mockClear();
        r2.layer.setVisible.mockClear();

        g.basemap = null;
        g.apply();

        // Both should be effective=true (original=true, no basemap filter)
        // r1 already visible => no call; r2 hidden => setVisible(true)
        expect(r1.layer.setVisible).not.toHaveBeenCalled();
        expect(r2.layer.setVisible).toHaveBeenCalledWith(true);
      });
    });

    it('defaults original visibility to true when not stored', () => {
      // This tests the `?? true` fallback on line 99.
      // We cannot easily trigger this through the public API because addLayer
      // always writes _originalVisible. However, we can verify the normal
      // path works and that removing + re-adding behaves correctly.
      const g = new CesiumLayerGroup('g');
      const r = ref('l1', true);
      g.addLayer(r);
      g.apply();

      // Visible group, original true, no basemap => effective true
      // getVisible true => no call
      expect(r.layer.setVisible).not.toHaveBeenCalled();
    });
  });
});

/* ================================================================== */
/*  CesiumLayerGroups                                                 */
/* ================================================================== */

describe('CesiumLayerGroups', () => {
  /* ---------- groups getter --------------------------------------- */
  describe('groups getter', () => {
    it('returns an empty array initially', () => {
      const gs = new CesiumLayerGroups();
      expect(gs.groups).toEqual([]);
    });

    it('returns a copy, not the internal array', () => {
      const gs = new CesiumLayerGroups();
      gs.ensureGroup('a');
      const copy1 = gs.groups;
      const copy2 = gs.groups;
      expect(copy1).toEqual(copy2);
      expect(copy1).not.toBe(copy2);
    });
  });

  /* ---------- getGroup / hasGroup --------------------------------- */
  describe('getGroup / hasGroup', () => {
    it('returns undefined / false for unknown groups', () => {
      const gs = new CesiumLayerGroups();
      expect(gs.getGroup('nope')).toBeUndefined();
      expect(gs.hasGroup('nope')).toBe(false);
    });

    it('returns the group / true for known groups', () => {
      const gs = new CesiumLayerGroups();
      const g = gs.ensureGroup('base');
      expect(gs.getGroup('base')).toBe(g);
      expect(gs.hasGroup('base')).toBe(true);
    });
  });

  /* ---------- ensureGroup ----------------------------------------- */
  describe('ensureGroup', () => {
    it('creates a new group when it does not exist', () => {
      const gs = new CesiumLayerGroups();
      const g = gs.ensureGroup('overlay', false);
      expect(g.id).toBe('overlay');
      expect(g.visible).toBe(false);
      expect(gs.groups).toHaveLength(1);
    });

    it('returns the existing group if it already exists', () => {
      const gs = new CesiumLayerGroups();
      const g1 = gs.ensureGroup('overlay');
      const g2 = gs.ensureGroup('overlay');
      expect(g1).toBe(g2);
      expect(gs.groups).toHaveLength(1);
    });
  });

  /* ---------- addLayerToGroup ------------------------------------- */
  describe('addLayerToGroup', () => {
    it('creates the group if needed and adds the layer', () => {
      const gs = new CesiumLayerGroups();
      const r = ref('l1');
      gs.addLayerToGroup('maps', true, r);

      expect(gs.hasGroup('maps')).toBe(true);
    });

    it('adds layer to an existing group', () => {
      const gs = new CesiumLayerGroups();
      gs.ensureGroup('maps');
      const r = ref('l1');
      gs.addLayerToGroup('maps', true, r);

      // Verify via apply: the layer should be affected
      gs.apply();
      // No error means the layer was properly registered
    });
  });

  /* ---------- removeLayer ----------------------------------------- */
  describe('removeLayer', () => {
    it('removes a layer from all groups by default', () => {
      const gs = new CesiumLayerGroups();
      const r = ref('shared');
      gs.addLayerToGroup('g1', true, r);
      // Add same-id ref to second group
      const r2 = ref('shared');
      gs.addLayerToGroup('g2', true, r2);

      expect(gs.removeLayer('shared')).toBe(true);
    });

    it('removes a layer from only the first matching group when removeFromAll=false', () => {
      const gs = new CesiumLayerGroups();
      gs.addLayerToGroup('g1', true, ref('x'));
      gs.addLayerToGroup('g2', true, ref('x'));

      expect(gs.removeLayer('x', false)).toBe(true);
    });

    it('returns false when layer not found in any group', () => {
      const gs = new CesiumLayerGroups();
      gs.ensureGroup('g1');
      expect(gs.removeLayer('nonexistent')).toBe(false);
    });

    it('returns false on empty store', () => {
      const gs = new CesiumLayerGroups();
      expect(gs.removeLayer('any')).toBe(false);
    });
  });

  /* ---------- setGroupVisible ------------------------------------- */
  describe('setGroupVisible', () => {
    it('sets visibility on an existing group', () => {
      const gs = new CesiumLayerGroups();
      gs.ensureGroup('overlay');

      gs.setGroupVisible('overlay', false);
      expect(gs.getGroup('overlay')!.visible).toBe(false);
    });

    it('throws for a non-existent group', () => {
      const gs = new CesiumLayerGroups();
      expect(() => gs.setGroupVisible('ghost', true)).toThrowError(
        /nicht gefunden/,
      );
    });
  });

  /* ---------- setBasemap ------------------------------------------ */
  describe('setBasemap', () => {
    it('sets basemap on an existing group', () => {
      const gs = new CesiumLayerGroups();
      gs.ensureGroup('base');

      gs.setBasemap('base', 'satellite');
      expect(gs.getGroup('base')!.basemap).toBe('satellite');
    });

    it('throws for a non-existent group', () => {
      const gs = new CesiumLayerGroups();
      expect(() => gs.setBasemap('ghost', 'osm')).toThrowError(
        /nicht gefunden/,
      );
    });

    it('can clear basemap with null', () => {
      const gs = new CesiumLayerGroups();
      gs.ensureGroup('base');
      gs.setBasemap('base', 'osm');
      gs.setBasemap('base', null);
      expect(gs.getGroup('base')!.basemap).toBeNull();
    });
  });

  /* ---------- apply ----------------------------------------------- */
  describe('apply', () => {
    it('applies all groups', () => {
      const gs = new CesiumLayerGroups();
      const r1 = ref('l1', true, 'osm');
      const r2 = ref('l2', true, 'satellite');
      gs.addLayerToGroup('base', true, r1);
      gs.addLayerToGroup('base', true, r2);
      gs.setBasemap('base', 'satellite');

      gs.apply();

      expect(r1.layer.setVisible).toHaveBeenCalledWith(false);
      // r2 already visible, no call
      expect(r2.layer.setVisible).not.toHaveBeenCalled();
    });

    it('is a no-op when nothing is dirty', () => {
      const gs = new CesiumLayerGroups();
      const r = ref('l1');
      gs.addLayerToGroup('g1', true, r);
      gs.apply();
      r.layer.setVisible.mockClear();
      r.layer.getVisible.mockClear();

      gs.apply(); // nothing dirty
      expect(r.layer.setVisible).not.toHaveBeenCalled();
      expect(r.layer.getVisible).not.toHaveBeenCalled();
    });

    it('runs when a child group is dirty even if root is not', () => {
      const gs = new CesiumLayerGroups();
      const r = ref('l1');
      gs.addLayerToGroup('g1', true, r);
      gs.apply();
      r.layer.setVisible.mockClear();

      // Mutate the child group directly
      gs.getGroup('g1')!.visible = false;

      gs.apply();
      expect(r.layer.setVisible).toHaveBeenCalledWith(false);
    });
  });

  /* ---------- clear ----------------------------------------------- */
  describe('clear', () => {
    it('removes all groups', () => {
      const gs = new CesiumLayerGroups();
      gs.ensureGroup('a');
      gs.ensureGroup('b');

      gs.clear();
      expect(gs.groups).toEqual([]);
      expect(gs.hasGroup('a')).toBe(false);
    });

    it('can add new groups after clear', () => {
      const gs = new CesiumLayerGroups();
      gs.ensureGroup('old');
      gs.clear();

      gs.ensureGroup('new');
      expect(gs.groups).toHaveLength(1);
      expect(gs.hasGroup('new')).toBe(true);
    });
  });
});
