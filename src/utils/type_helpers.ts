/**
 * Filter keys of a type by a type. To get just the number keys do:
 *
 * To get just the number keys do:
 *
 * ```ts
 * type YourObjectTypeNumberKeys = KeyOfType<YourObjectType, number>
 * ```
 */
export type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V ? P : never]: unknown;
};
