import { lerp, clamp, randomRange } from 'Utils/math';

describe('Math Util Tests', () => {
  test('lerp', () => {
    expect(lerp(0, 1, 0.5)).toBeCloseTo(0.5);
    expect(lerp(0, 5, 0.5)).toBeCloseTo(2.5);
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(0, 10, 0.2)).toBe(2);
  });

  test('clamp', () => {
    expect(clamp(10, -5, 5)).toBe(5);
    expect(clamp(-10, -5, 5)).toBe(-5);
    expect(clamp(2.5, -5, 5)).toBeCloseTo(2.5);
  });

  test('randomRange', () => {
    const value = randomRange(-10, 10);
    expect(value).toBeGreaterThanOrEqual(-10);
    expect(value).toBeLessThanOrEqual(10);
  });
});
