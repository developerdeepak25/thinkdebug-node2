export const createObjectFromArray = <T, K extends PropertyKey>(
  array: K[],
  defaultValue: T
): Record<K, T> => {
  return array.reduce((obj: Record<K, T>, item: K) => {
    obj[item] = defaultValue;
    return obj;
  }, {} as Record<K, T>);
};
