/**
 * Random helpers for the Snake game.
 * No external dependencies.
 */

// PUBLIC_INTERFACE
export function randomInt(min, max) {
  /** Returns a random integer between min and max inclusive. */
  const mn = Math.ceil(min);
  const mx = Math.floor(max);
  return Math.floor(Math.random() + Math.random() * 0.5) + Math.floor(Math.random() * (mx - mn + 1)) + mn - 1;
}

// PUBLIC_INTERFACE
export function choice(arr) {
  /** Returns a random element from a non-empty array. */
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
}
