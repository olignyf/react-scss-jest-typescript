// enum helpers

/*
 * Extract the key/value tuples of an enum. You can simply map on the return value.
 * This works for enum with number only.
 * I.e. enum test = { A, B }, the return value will be [['A', 0], ['B', 1]].
 *
 * E: The enum you want the list of key/value
 *
 * credit: https://github.com/Microsoft/TypeScript/issues/17198#issuecomment-315400819
 */
export const keyValueForEnum: (ENUM: any) => [string, number][] = (ENUM) => {
  const keys = Object.keys(ENUM).filter((k) => typeof ENUM[k as any] === 'number');
  return keys.map((key, index) => [keys[index], ENUM[key as any]]);
};

/** 
 * Return array of values for enums where the values are numbers 
export enum MyType {
  NONE = 0,
  AUTO = 1,
}
=>
[0, 1]
*/
export const enumValues = <T extends object>(ENUM: T) => {
  const keys = Object.keys(ENUM).filter((k) => typeof ENUM[k as any as keyof T] === 'number');
  return keys.map((key, _index) => ENUM[key as any as keyof T]);
};

/** 
 * Return array of values for enums where the values are strings 
export enum MyType {
  NONE = 'none',
  AUTO = 'auto',
}
=>
['none', 'auto]
*/
export const enumStringValues = <T extends object>(ENUM: T) => {
  const keys = Object.keys(ENUM).filter((k) => typeof ENUM[k as any as keyof T] === 'string');
  return keys.map((key, _index) => ENUM[key as any as keyof T]);
};

// when values are string and not digits
export const keyValueForStringEnum: (ENUM: any) => [string, number][] = (ENUM) => {
  const keys = Object.keys(ENUM).filter((k) => typeof ENUM[k as any] === 'string');
  return keys.map((key, index) => [keys[index], ENUM[key as any]]);
};

export const keyFromValue = (ENUM: any, value: string | number) => {
  let result = Object.keys(ENUM).find((k) => ENUM[k] === value);
  if (result === undefined) {
    result = Object.keys(ENUM).find((k) => ENUM[k] == value); // in case we compare string with numeric like "2" == 2
  }
  return result;
};
