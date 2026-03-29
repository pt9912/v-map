import { describe, expect, it } from 'vitest';
import { isGeoStylerStyle } from './styling';

describe('isGeoStylerStyle', () => {
  it('returns true for a style-like object with a name and rules array', () => {
    expect(
      isGeoStylerStyle({
        name: 'Style',
        rules: [],
      }),
    ).toBe(true);
  });

  it('returns true for array-like rules', () => {
    expect(
      isGeoStylerStyle({
        name: 'Style',
        rules: { 0: { name: 'rule' }, length: 1 },
      }),
    ).toBe(true);
  });

  it('returns false for null and non-objects', () => {
    expect(isGeoStylerStyle(null)).toBe(false);
    expect(isGeoStylerStyle('style')).toBe(false);
    expect(isGeoStylerStyle(42)).toBe(false);
  });

  it('returns false when name is missing or not a string', () => {
    expect(isGeoStylerStyle({ rules: [] })).toBe(false);
    expect(
      isGeoStylerStyle({
        name: 123,
        rules: [],
      }),
    ).toBe(false);
  });

  it('returns false when rules are missing or not array-like', () => {
    expect(
      isGeoStylerStyle({
        name: 'Style',
      }),
    ).toBe(false);
    expect(
      isGeoStylerStyle({
        name: 'Style',
        rules: {},
      }),
    ).toBe(false);
  });
});
