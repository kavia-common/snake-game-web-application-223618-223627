import { randomInt, choice } from './random';

test('randomInt returns integer within range', () => {
  for (let i = 0; i < 100; i++) {
    const v = randomInt(1, 3);
    expect(Number.isInteger(v)).toBe(true);
    expect(v).toBeGreaterThanOrEqual(1);
    expect(v).toBeLessThanOrEqual(3);
  }
});

test('choice returns element from array', () => {
  const arr = [1, 2, 3];
  const v = choice(arr);
  expect(arr.includes(v)).toBe(true);
});
