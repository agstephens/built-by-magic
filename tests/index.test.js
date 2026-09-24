const { calculatePower, calculateCircleArea } = require('../src/index');

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

describe('calculateCircleArea', () => {
  test('calculates circle area correctly for positive radius', () => {
    expect(calculateCircleArea(1)).toBeCloseTo(Math.PI);
    expect(calculateCircleArea(5)).toBeCloseTo(Math.PI * 25);
    expect(calculateCircleArea(2.5)).toBeCloseTo(Math.PI * 6.25);
  });

  test('calculates area as 0 when radius is 0', () => {
    expect(calculateCircleArea(0)).toBe(0);
  });

  test('throws RangeError when radius is negative', () => {
    expect(() => calculateCircleArea(-1)).toThrow(RangeError);
    expect(() => calculateCircleArea(-5.5)).toThrow(RangeError);
  });

  test('throws TypeError when radius is invalid', () => {
    expect(() => calculateCircleArea('5')).toThrow(TypeError);
    expect(() => calculateCircleArea(null)).toThrow(TypeError);
    expect(() => calculateCircleArea(undefined)).toThrow(TypeError);
    expect(() => calculateCircleArea(NaN)).toThrow(TypeError);
    expect(() => calculateCircleArea(Infinity)).toThrow(TypeError);
  });
});
