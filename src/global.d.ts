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

  entries<TDictionary>(
    o: TDictionary
  ): [string, GetDictionaryValue<TDictionary>][];
}