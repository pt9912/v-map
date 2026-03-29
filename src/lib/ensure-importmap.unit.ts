import { afterEach, describe, expect, it, vi } from 'vitest';
import { IMPORT_MAP_JSON } from './versions.gen';
import { ensureImportMap } from './ensure-importmap';

type FakeScript = {
  type: string;
  dataset: Record<string, string>;
  textContent: string | null;
};

function stubDocument(options?: {
  hasAnyImportMap?: boolean;
  hasVMapImportMap?: boolean;
}) {
  const appended: FakeScript[] = [];
  const fakeDocument = {
    querySelector: (selector: string) => {
      if (
        selector === 'script[type="importmap"]' &&
        options?.hasAnyImportMap
      ) {
        return {} as Element;
      }
      if (
        selector === 'script[type="importmap"][data-v-map]' &&
        options?.hasVMapImportMap
      ) {
        return {} as Element;
      }
      return null;
    },
    createElement: (_tagName: string) =>
      ({
        type: '',
        dataset: {},
        textContent: null,
      }) as FakeScript,
    head: {
      appendChild: (node: FakeScript) => {
        appended.push(node);
        return node;
      },
    },
  };

  vi.stubGlobal('document', fakeDocument);
  return appended;
}

describe('ensureImportMap unit', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('appends a v-map importmap when none exists', () => {
    const appended = stubDocument();

    ensureImportMap();

    expect(appended).toHaveLength(1);
    expect(appended[0]).toEqual({
      type: 'importmap',
      dataset: { vMap: 'true' },
      textContent: IMPORT_MAP_JSON,
    });
  });

  it('skips injection when another importmap exists and override is allowed', () => {
    const appended = stubDocument({ hasAnyImportMap: true });

    ensureImportMap();

    expect(appended).toHaveLength(0);
  });

  it('does not append a duplicate v-map importmap', () => {
    const appended = stubDocument({ hasVMapImportMap: true });

    ensureImportMap({ allowOverride: false });

    expect(appended).toHaveLength(0);
  });
});
