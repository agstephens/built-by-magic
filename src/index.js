const { isValidNumber } = require('./utils');

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

module.exports = {
  calculatePower,
};
