import { describe, expect, it } from 'vitest';
import {
  diffLayers,
  diffRelevantFields,
  type NormalizedLayer,
} from './diff';

function baseLayer(
  overrides: Partial<NormalizedLayer> = {},
): NormalizedLayer {
  return {
    id: 'layer-1',
    type: 'wms',
    visible: true,
    opacity: 1,
    zIndex: 10,
    url: 'https://example.com/wms',
    layers: 'base',
    tiled: 'false',
    style: { color: 'red', width: 2 },
    data: { key: 'value' },
    ...overrides,
  };
}

describe('diff unit', () => {
  it('treats normalized visible, opacity, zIndex and object order as unchanged', () => {
    const before = baseLayer({
      visible: true,
      opacity: '1',
      zIndex: '10',
      style: { width: 2, color: 'red' },
    });
    const after = baseLayer({
      visible: '1',
      opacity: 1,
      zIndex: 10,
      style: { color: 'red', width: 2 },
    });

    expect(diffRelevantFields(before, after)).toEqual({});
  });

  it('returns added, removed, updated and moved layers separately', () => {
    const oldLayers = [
      baseLayer({ id: 'a', type: 'osm' }),
      baseLayer({ id: 'b', opacity: 0.7 }),
      baseLayer({ id: 'c', type: 'xyz' }),
    ];
    const newLayers = [
      baseLayer({ id: 'b', opacity: 0.9 }),
      baseLayer({ id: 'a', type: 'osm' }),
      baseLayer({ id: 'd', type: 'geojson' }),
    ];

    const result = diffLayers(oldLayers, newLayers);

    expect(result.added).toEqual([baseLayer({ id: 'd', type: 'geojson' })]);
    expect(result.removed).toEqual([baseLayer({ id: 'c', type: 'xyz' })]);
    expect(result.updated).toEqual([
      {
        id: 'b',
        changes: {
          opacity: { old: 0.7, new: 0.9 },
        },
      },
    ]);
    expect(result.moved).toEqual([{ id: 'a', from: 0, to: 1 }]);
    expect(result.unchangedIds).toEqual(['a']);
  });
});
