const { DEFAULT_SETTINGS, normalizeSettings, formatResult } = require('../src/settings');

describe('normalizeSettings', () => {
  test('returns DEFAULT_SETTINGS when given null/undefined/non-object', () => {
    expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
    expect(normalizeSettings('invalid')).toEqual(DEFAULT_SETTINGS);
  });

  test('preserves valid settings', () => {
    const input = {
      theme: 'dark',
      precision: 4,
      notation: 'scientific',
      defaultBase: '10',
      defaultExponent: '2',
    };
    expect(normalizeSettings(input)).toEqual(input);
  });

  test('falls back to default values for invalid fields', () => {
    const input = {
      theme: 'invalid-theme',
      precision: 99,
      notation: 'unknown',
      defaultBase: 5,
      defaultExponent: 3,
    };
    expect(normalizeSettings(input)).toEqual({
      theme: 'system',
      precision: 'auto',
      notation: 'standard',
      defaultBase: '5',
      defaultExponent: '3',
    });
  });
});

describe('formatResult', () => {
  test('formats number using standard notation and precision auto', () => {
    expect(formatResult(12.3456, { precision: 'auto', notation: 'standard' })).toBe('12.3456');
  });

  test('formats number with specific decimal precision', () => {
    expect(formatResult(12.3456, { precision: 2, notation: 'standard' })).toBe('12.35');
  });

  test('formats number in scientific notation', () => {
    expect(formatResult(1000, { precision: 'auto', notation: 'scientific' })).toBe('1e+3');
    expect(formatResult(1234.56, { precision: 2, notation: 'scientific' })).toBe('1.23e+3');
  });

  test('handles non-numeric inputs gracefully', () => {
    expect(formatResult(NaN)).toBe('NaN');
  });
});
