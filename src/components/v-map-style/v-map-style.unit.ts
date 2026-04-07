import { describe, it, expect } from 'vitest';

/**
 * v-map-style parseGeoStyler is a private method on the Stencil component.
 * We test the parsing logic directly by extracting the same validation rules.
 */
function parseGeoStyler(jsonContent: string): Record<string, unknown> {
  const style = JSON.parse(jsonContent);

  if (typeof style !== 'object' || style === null) {
    throw new Error('GeoStyler style parsing failed: Parsed GeoStyler style is not a valid object');
  }
  if (typeof style.name !== 'string' || !Array.isArray(style.rules)) {
    throw new Error('GeoStyler style parsing failed: GeoStyler style must have "name" (string) and "rules" (array)');
  }

  return style;
}

describe('v-map-style – format="geostyler"', () => {
  it('accepts a valid GeoStyler style with name and rules', () => {
    const input = JSON.stringify({
      name: 'Test Style',
      rules: [
        {
          name: 'default',
          symbolizers: [{ kind: 'Mark', wellKnownName: 'circle', color: '#ff0000', radius: 8 }],
        },
      ],
    });

    const result = parseGeoStyler(input);

    expect(result.name).toBe('Test Style');
    expect(result.rules).toHaveLength(1);
  });

  it('accepts a style with empty rules array', () => {
    const input = JSON.stringify({ name: 'Empty', rules: [] });

    const result = parseGeoStyler(input);

    expect(result.name).toBe('Empty');
    expect(result.rules).toHaveLength(0);
  });

  it('rejects invalid JSON', () => {
    expect(() => parseGeoStyler('{ INVALID }')).toThrow();
  });

  it('rejects null', () => {
    expect(() => parseGeoStyler('null')).toThrow('not a valid object');
  });

  it('rejects a primitive string', () => {
    expect(() => parseGeoStyler('"hello"')).toThrow('not a valid object');
  });

  it('rejects an object without name', () => {
    const input = JSON.stringify({ rules: [] });

    expect(() => parseGeoStyler(input)).toThrow('"name" (string) and "rules" (array)');
  });

  it('rejects an object without rules', () => {
    const input = JSON.stringify({ name: 'NoRules' });

    expect(() => parseGeoStyler(input)).toThrow('"name" (string) and "rules" (array)');
  });

  it('rejects an object where rules is not an array', () => {
    const input = JSON.stringify({ name: 'Bad', rules: 'not-an-array' });

    expect(() => parseGeoStyler(input)).toThrow('"name" (string) and "rules" (array)');
  });

  it('rejects an object where name is not a string', () => {
    const input = JSON.stringify({ name: 42, rules: [] });

    expect(() => parseGeoStyler(input)).toThrow('"name" (string) and "rules" (array)');
  });
});
