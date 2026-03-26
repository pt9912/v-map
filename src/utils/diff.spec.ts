import { diffLayers, diffRelevantFields, type NormalizedLayer } from './diff';

describe('diff utilities', () => {
  const baseLayer = (overrides: Partial<NormalizedLayer> = {}): NormalizedLayer => ({
    id: 'layer-1',
    type: 'wms',
    visible: true,
    opacity: 1,
    zIndex: 10,
    url: 'https://example.com/wms',
    layers: 'base',
    tiled: false,
    style: { color: 'red', width: 2 },
    data: { key: 'value' },
    ...overrides,
  });

  it('returns an empty patch for equivalent relevant fields', () => {
    const original = baseLayer({
      visible: true,
      opacity: '1',
      zIndex: '10',
      tiled: 'false',
      style: { width: 2, color: 'red' },
      data: { key: 'value' },
    });
    const next = baseLayer({
      visible: '1',
      opacity: 1,
      zIndex: 10,
      tiled: false,
      style: { color: 'red', width: 2 },
      data: { key: 'value' },
    });

    expect(diffRelevantFields(original, next)).toEqual({});
  });

  it('detects changes across all relevant fields', () => {
    const original = baseLayer();
    const next = baseLayer({
      type: 'xyz',
      visible: false,
      opacity: 0.5,
      zIndex: 25,
      url: 'https://example.com/tiles/{z}/{x}/{y}.png',
      layers: 'overlay',
      tiled: true,
      style: { color: 'blue' },
      data: { source: 'remote' },
    });

    expect(diffRelevantFields(original, next)).toEqual({
      type: { old: 'wms', new: 'xyz' },
      visible: { old: 'true', new: 'false' },
      opacity: { old: 1, new: 0.5 },
      zIndex: { old: 10, new: 25 },
      url: {
        old: 'https://example.com/wms',
        new: 'https://example.com/tiles/{z}/{x}/{y}.png',
      },
      layers: { old: 'base', new: 'overlay' },
      tiled: { old: 'false', new: 'true' },
      style: { old: { color: 'red', width: 2 }, new: { color: 'blue' } },
      data: { old: { key: 'value' }, new: { source: 'remote' } },
    });
  });

  it('tracks added, removed, updated, moved and unchanged layers', () => {
    const oldLayers: NormalizedLayer[] = [
      baseLayer({ id: 'a', type: 'osm' }),
      baseLayer({ id: 'b', type: 'wms', opacity: 0.7 }),
      baseLayer({ id: 'c', type: 'xyz' }),
    ];

    const newLayers: NormalizedLayer[] = [
      baseLayer({ id: 'b', type: 'wms', opacity: 0.9 }),
      baseLayer({ id: 'a', type: 'osm' }),
      baseLayer({ id: 'd', type: 'geojson' }),
    ];

    expect(diffLayers(oldLayers, newLayers)).toEqual({
      added: [baseLayer({ id: 'd', type: 'geojson' })],
      removed: [baseLayer({ id: 'c', type: 'xyz' })],
      updated: [
        {
          id: 'b',
          changes: {
            opacity: { old: 0.7, new: 0.9 },
          },
        },
      ],
      moved: [{ id: 'a', from: 0, to: 1 }],
      unchangedIds: ['a'],
    });
  });

  it('does not mark added layers as moved', () => {
    const oldLayers: NormalizedLayer[] = [baseLayer({ id: 'a' })];
    const newLayers: NormalizedLayer[] = [
      baseLayer({ id: 'b' }),
      baseLayer({ id: 'a' }),
    ];

    const result = diffLayers(oldLayers, newLayers);

    expect(result.added).toEqual([baseLayer({ id: 'b' })]);
    expect(result.moved).toEqual([]);
    expect(result.unchangedIds).toEqual(['a']);
  });
});
