/**
 * Linearlly interpolates between the given values
 *
 * @param start the number to start from
 * @param end the number to progress to
 * @param progress the amount progressed as a number in the range [0, 1]
 * @returns the result of a linear interpolation between `start` and `end` at the given `progress` percent
 * @category Util
 */
function lerp(start: number, end: number, progress: number) {
  return start * (1 - progress) + end * progress;
}

/**
 * Clamps a value into a given range
 *
 * @param value the number to perform the clamp to
 * @param min the minimum value of the range
 * @param max the maximum value of the range
 * @returns `value` if it is within the range `[min, max]`;  `min` if `value < min`;  `max` if `value > max`
 * @category Util
 */
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generates a psuedo-random value within the given range
 *
 * @param min the minimum value of the range
 * @param progress the maximum value of the range
 * @returns a random value within the range `[min, max)`
 * @category Util
 */
function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export { lerp, clamp, randomRange };
