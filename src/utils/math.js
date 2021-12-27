export function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}
