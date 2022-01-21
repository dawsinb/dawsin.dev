/**
 * Globally available type definitions for convenience / fixes
 * @module Types
 * @mergeTarget
 */

/** union of all types except undefined */
type notUndefined = string | number | boolean | symbol | object;

/** Object dictionary for key - value pairs */
interface Dictionary<T extends notUndefined = notUndefined> {
  [key: string]: T;
}
/** Augment default object constructor to be aware of dictionary */
interface ObjectConstructor {
  values<TDictionary>(
    o: TDictionary extends Dictionary ? TDictionary : never
  ): TDictionary extends Dictionary<infer TElement> ? TElement[] : never;

  entries<TDictionary>(o: TDictionary): [string, GetDictionaryValue<TDictionary>][];
}

/** Re-export css properites for convience when using styled-props */
type CssProperties = import('csstype').Properties;

/** Workaround for interpolated values having an ambiguous In type that is uneeded */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnimatedValue<T> = import('@react-spring/core').Interpolation<any, T>;

/** Workaround to add node/material type support to r3f gltf loader */
type GLTF = import('three-stdlib').GLTF & {
  nodes: Record<string, import('three').Mesh>;
  materials: Record<string, import('three').Material>;
};

/** @ignore */
declare namespace JSX {
  interface IntrinsicElements {
    // in order to register custom shaders with typescript we have to add them to the JSX namespace
    distortionMaterial: ReactThreeFiber.Object3DNode<CustomMaterial, typeof CustomMaterial>;
    textureFader: ReactThreeFiber.Object3DNode<CustomMaterial, typeof CustomMaterial>;
  }
}
