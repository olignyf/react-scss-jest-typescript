import { compile } from 'path-to-regexp';

export type PathFunction<P> = (data: P) => string;

/**
 * This method compile a path with arguments.
 * @param path: The path for the route (with arguments if needed)
 * @param options: encoding options for the path compilation
 */
export function compileWithArgs<P extends object = {}>(path: string): PathFunction<P> {
  return compile(path);
}
