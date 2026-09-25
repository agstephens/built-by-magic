const { isValidNumber } = require('./utils');

const DEFAULT_SETTINGS = Object.freeze({
  theme: 'light',
  decimalPrecision: 'auto',
  defaultTab: 'exponent-tab',
});

const VALID_THEMES = ['light', 'dark', 'ocean', 'forest'];
const VALID_PRECISION_OPTIONS = ['auto', '0', '2', '4', '6'];
const VALID_DEFAULT_TABS = ['exponent-tab', 'colour-tab', 'circle-tab', 'austen-tab', 'settings-tab'];

/**
 * Validates and sanitizes settings object.
 * @param {Object} settings - Settings object to validate.
 * @returns {Object} Validated settings object with fallback defaults.
 */
function validateSettings(settings) {
  if (!settings || typeof settings !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }

  const theme = VALID_THEMES.includes(settings.theme) ? settings.theme : DEFAULT_SETTINGS.theme;
  const decimalPrecision = VALID_PRECISION_OPTIONS.includes(String(settings.decimalPrecision))
    ? String(settings.decimalPrecision)
    : DEFAULT_SETTINGS.decimalPrecision;
  const defaultTab = VALID_DEFAULT_TABS.includes(settings.defaultTab)
    ? settings.defaultTab
    : DEFAULT_SETTINGS.defaultTab;

  return {
    theme,
    decimalPrecision,
    defaultTab,
  };
}

/**
 * Formats a number based on specified precision option.
 * @param {number} num - The number to format.
 * @param {string|number} precision - Precision option ('auto', '0', '2', '4', '6').
 * @returns {string} Formatted number string.
 * @throws {TypeError} If num is not a valid number.
 */
function formatNumberWithPrecision(num, precision = 'auto') {
  if (!isValidNumber(num)) {
    throw new TypeError('Value must be a valid finite number.');
  }

  const precStr = String(precision);
  if (precStr === 'auto' || !VALID_PRECISION_OPTIONS.includes(precStr)) {
    return String(num);
  }

  const decimals = parseInt(precStr, 10);
  return Number(num.toFixed(decimals)).toString();
}

module.exports = {
  DEFAULT_SETTINGS,
  VALID_THEMES,
  VALID_PRECISION_OPTIONS,
  VALID_DEFAULT_TABS,
  validateSettings,
  formatNumberWithPrecision,
};
