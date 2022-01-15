// these type declarations are only used for testing, they are not accessible in source code

// override read only properties to be manually editable for testing
type MutableReadonly<T> = { -readonly [P in keyof T]-?: T[P] };
