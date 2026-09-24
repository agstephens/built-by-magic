const {
  DEFAULT_SETTINGS,
  VALID_THEMES,
  VALID_PRECISION_OPTIONS,
  VALID_DEFAULT_TABS,
  validateSettings,
  formatNumberWithPrecision,
} = require('../src/index');

describe('Settings Utilities', () => {
  describe('DEFAULT_SETTINGS', () => {
    test('contains expected default options', () => {
      expect(DEFAULT_SETTINGS).toEqual({
        theme: 'light',
        decimalPrecision: 'auto',
        defaultTab: 'exponent-tab',
      });
    });
  });

  describe('validateSettings', () => {
    test('returns defaults when input is null, undefined, or non-object', () => {
      expect(validateSettings(null)).toEqual(DEFAULT_SETTINGS);
      expect(validateSettings(undefined)).toEqual(DEFAULT_SETTINGS);
      expect(validateSettings('invalid')).toEqual(DEFAULT_SETTINGS);
      expect(validateSettings(123)).toEqual(DEFAULT_SETTINGS);
    });

    test('preserves valid settings', () => {
      const input = {
        theme: 'dark',
        decimalPrecision: '2',
        defaultTab: 'circle-tab',
      };
      expect(validateSettings(input)).toEqual(input);
    });

    test('falls back to defaults for individual invalid properties', () => {
      const input = {
        theme: 'invalid-theme',
        decimalPrecision: '99',
        defaultTab: 'unknown-tab',
      };
      expect(validateSettings(input)).toEqual(DEFAULT_SETTINGS);
    });

    test('allows ocean and forest themes', () => {
      expect(validateSettings({ theme: 'ocean' }).theme).toBe('ocean');
      expect(validateSettings({ theme: 'forest' }).theme).toBe('forest');
    });
  });

  describe('formatNumberWithPrecision', () => {
    test('returns original stringified number when precision is auto', () => {
      expect(formatNumberWithPrecision(12.3456, 'auto')).toBe('12.3456');
    });

    test('formats decimals according to precision options', () => {
      expect(formatNumberWithPrecision(12.3456, '0')).toBe('12');
      expect(formatNumberWithPrecision(12.3456, '2')).toBe('12.35');
      expect(formatNumberWithPrecision(12.3456, '4')).toBe('12.3456');
      expect(formatNumberWithPrecision(12, '2')).toBe('12');
    });

    test('throws TypeError if input is not a valid finite number', () => {
      expect(() => formatNumberWithPrecision('12')).toThrow(TypeError);
      expect(() => formatNumberWithPrecision(NaN)).toThrow(TypeError);
      expect(() => formatNumberWithPrecision(Infinity)).toThrow(TypeError);
    });
  });
});
