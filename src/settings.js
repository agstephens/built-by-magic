const DEFAULT_SETTINGS = Object.freeze({
  theme: 'system',
  precision: 'auto',
  notation: 'standard',
  defaultBase: '',
  defaultExponent: '',
});

/**
 * Validates and normalizes user settings against sensible defaults.
 * @param {Object} settings - Input settings object.
 * @returns {Object} Sanitized settings object.
 */
function normalizeSettings(settings) {
  if (!settings || typeof settings !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }

  const validThemes = ['light', 'dark', 'system'];
  const validNotations = ['standard', 'scientific'];

  const theme = validThemes.includes(settings.theme) ? settings.theme : DEFAULT_SETTINGS.theme;
  const notation = validNotations.includes(settings.notation) ? settings.notation : DEFAULT_SETTINGS.notation;

  let precision = DEFAULT_SETTINGS.precision;
  if (settings.precision !== undefined && settings.precision !== null && settings.precision !== 'auto') {
    const parsedPrec = parseInt(settings.precision, 10);
    if (!isNaN(parsedPrec) && parsedPrec >= 0 && parsedPrec <= 10) {
      precision = parsedPrec;
    }
  }

  const defaultBase = settings.defaultBase !== undefined && settings.defaultBase !== null ? String(settings.defaultBase) : DEFAULT_SETTINGS.defaultBase;
  const defaultExponent = settings.defaultExponent !== undefined && settings.defaultExponent !== null ? String(settings.defaultExponent) : DEFAULT_SETTINGS.defaultExponent;

  return {
    theme,
    precision,
    notation,
    defaultBase,
    defaultExponent,
  };
}

/**
 * Formats a numerical result based on settings options.
 * @param {number} value - The numerical calculation result.
 * @param {Object} settings - Settings object.
 * @returns {string} Formatted string representation.
 */
function formatResult(value, settings = {}) {
  if (typeof value !== 'number' || isNaN(value)) {
    return String(value);
  }

  const normalized = normalizeSettings(settings);

  let formatted = value;

  if (normalized.precision !== 'auto') {
    formatted = Number(value.toFixed(normalized.precision));
  }

  if (normalized.notation === 'scientific') {
    if (normalized.precision !== 'auto') {
      return value.toExponential(normalized.precision);
    }
    return value.toExponential();
  }

  return String(formatted);
}

module.exports = {
  DEFAULT_SETTINGS,
  normalizeSettings,
  formatResult,
};
