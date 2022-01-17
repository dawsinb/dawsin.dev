/**
 * Utility functions to re-use common functionality
 * @module Utils
 * @mergeTarget
 */

/**
 * Template string tag to enable code highlighting in glsl strings
 * @category Shader
 */
const glsl = (x: TemplateStringsArray) => x.toString();

export { glsl };
