// union of all types except undefined
type notUndefined = string | number | boolean | symbol | object;

// object dictionary for key - value pairs
interface Dictionary<T extends notUndefined = notUndefined> {
  [key: string]: T;
}
// augment default object constructor to be aware of dictionary
interface ObjectConstructor {
  values<TDictionary>(
    o: TDictionary extends Dictionary ? TDictionary : never
  ): TDictionary extends Dictionary<infer TElement> ? TElement[] : never;

  entries<TDictionary>(o: TDictionary): [string, GetDictionaryValue<TDictionary>][];
}

// re-export css properites for convience when using styled-props
type CssProperties = import('csstype').Properties;

// workaround for interpolated values having an ambiguous In type that is uneeded
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnimatedValue<T> = import('@react-spring/core').Interpolation<any, T>;

// workaround to add node/material type support to r3f gltf loader
type GLTF = import('three-stdlib').GLTF & {
  nodes: Record<string, import('three').Mesh>;
  materials: Record<string, import('three').Material>;
};
