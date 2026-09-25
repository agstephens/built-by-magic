const { isValidNumber } = require('./utils');
const {
  DEFAULT_SETTINGS,
  VALID_THEMES,
  VALID_PRECISION_OPTIONS,
  VALID_DEFAULT_TABS,
  validateSettings,
  formatNumberWithPrecision,
} = require('./settings');
const {
  generateAustenText,
  tokenizeText,
  buildNGramModel,
  fetchOrGetSourceText,
  clearCache,
} = require('./austenWriter');

/**
 * Calculates base raised to the power of exponent (base^exponent).
 * @param {number} base - The base number.
 * @param {number} exponent - The exponent number.
 * @returns {number} The result of base raised to exponent.
 * @throws {TypeError} If base or exponent is not a valid finite number.
 */
function calculatePower(base, exponent) {
  if (!isValidNumber(base)) {
    throw new TypeError('Base must be a valid finite number.');
  }
  if (!isValidNumber(exponent)) {
    throw new TypeError('Exponent must be a valid finite number.');
  }

  return Math.pow(base, exponent);
}

/**
 * Calculates the area of a circle with the given radius.
 * @param {number} radius - The radius of the circle.
 * @returns {number} The area of the circle.
 * @throws {TypeError|RangeError} If radius is not a valid finite number or is negative.
 */
function calculateCircleArea(radius) {
  if (!isValidNumber(radius)) {
    throw new TypeError('Radius must be a valid finite number.');
  }
  if (radius < 0) {
    throw new RangeError('Radius cannot be negative.');
  }

  return Math.PI * radius * radius;
}

module.exports = {
  calculatePower,
  calculateCircleArea,
  generateAustenText,
  tokenizeText,
  buildNGramModel,
  fetchOrGetSourceText,
  clearCache,
  DEFAULT_SETTINGS,
  VALID_THEMES,
  VALID_PRECISION_OPTIONS,
  VALID_DEFAULT_TABS,
  validateSettings,
  formatNumberWithPrecision,
};
