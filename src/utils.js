/**
 * Validates if a value is a valid finite number.
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is a number and finite, false otherwise.
 */
function isValidNumber(value) {
  return typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value);
}

module.exports = {
  isValidNumber,
};
