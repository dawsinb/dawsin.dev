/**
 * Utility functions to reuse common functionality
 * @module Utils
 * @mergeTarget
 */

/**
 * Linearlly interpolates between the given values.
 *
 * @param start the number to start from
 * @param end the number to progress to
 * @param progress the amount progressed as a number in the range `[0, 1]`
 * @returns
 * the result of a linear interpolation between `start` and `end` at the given `progress` percent.
 *
 * *To prevent an infinite loop in a recursive lerp if `start` is within 0.0001 of `end` it will return `end`*
 * @category Math
 */
function lerp(start: number, end: number, progress: number) {
  // jump to end if start is very close to prevent an inifinite loop in a recursive lerp
  if (start < end + 0.0001 && start > end - 0.0001) {
    return end;
  }
  // else execute regular lerp function
  else {
    return start * (1 - progress) + end * progress;
  }
}

/**
 * Clamps a value into a given range
 *
 * @param value the number to perform the clamp to
 * @param min the minimum value of the range
 * @param max the maximum value of the range
 * @returns `value` if it is within the range `[min, max]`;  `min` if `value < min`;  `max` if `value > max`
 * @category Math
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
 * @category Math
 */
function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export { lerp, clamp, randomRange };
