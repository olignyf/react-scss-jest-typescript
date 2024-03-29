import { isNilOrEmpty } from "./utils";

export const valueOrPath = (value?: string): string => (isNilOrEmpty(value) ? '${path}' : value as string);
