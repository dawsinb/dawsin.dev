function lerp(start: number, end: number, progress: number) {
  return start * (1 - progress) + end * progress;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export { lerp, clamp, randomRange };
