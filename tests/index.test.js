const { calculatePower } = require('../src/index');

describe('calculatePower', () => {
  test('calculates positive base and positive exponent correctly', () => {
    expect(calculatePower(2, 3)).toBe(8);
    expect(calculatePower(5, 2)).toBe(25);
    expect(calculatePower(10, 4)).toBe(10000);
  });

  test('calculates power with exponent 0', () => {
    expect(calculatePower(5, 0)).toBe(1);
    expect(calculatePower(0, 0)).toBe(1);
    expect(calculatePower(-5, 0)).toBe(1);
  });

  test('calculates negative base correctly', () => {
    expect(calculatePower(-2, 3)).toBe(-8);
    expect(calculatePower(-2, 4)).toBe(16);
  });

  test('calculates negative exponent correctly', () => {
    expect(calculatePower(2, -2)).toBe(0.25);
    expect(calculatePower(10, -1)).toBe(0.1);
  });

  test('calculates fractional exponents correctly', () => {
    expect(calculatePower(4, 0.5)).toBe(2);
    expect(calculatePower(27, 1 / 3)).toBeCloseTo(3);
  });

  test('throws TypeError when base is invalid', () => {
    expect(() => calculatePower('2', 3)).toThrow(TypeError);
    expect(() => calculatePower(null, 3)).toThrow(TypeError);
    expect(() => calculatePower(undefined, 3)).toThrow(TypeError);
    expect(() => calculatePower(NaN, 3)).toThrow(TypeError);
    expect(() => calculatePower(Infinity, 3)).toThrow(TypeError);
  });

  test('throws TypeError when exponent is invalid', () => {
    expect(() => calculatePower(2, '3')).toThrow(TypeError);
    expect(() => calculatePower(2, null)).toThrow(TypeError);
    expect(() => calculatePower(2, undefined)).toThrow(TypeError);
    expect(() => calculatePower(2, NaN)).toThrow(TypeError);
    expect(() => calculatePower(2, Infinity)).toThrow(TypeError);
  });
});
