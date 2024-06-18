import { compile } from 'path-to-regexp';

const BasePaths = {
  files: '/api/files',
  todos: '/api/todos',
};

const withBase = (base: string, path: string) => base.concat(path);

// This is just a helper method, but maybe we want to add some default options.
export const APIPathWithArguments = <T extends object>(path: string, data: T): string => compile(path)(data);
/*
interface APIPathInterface {
  files: {
    add: string;
    delete: string;
    get: string;
    list: string;
    put: string;
  };
}*/

export const APIPath/*: APIPathInterface */= {
  files: {
    add: BasePaths.files,
    delete: withBase(BasePaths.files, '/:name'),
    get: withBase(BasePaths.files, '/:name'),
    list: BasePaths.files,
    put: withBase(BasePaths.files, '/:name'),
  },
  todos: {
    add: BasePaths.todos,
    delete: withBase(BasePaths.todos, '/:name'),
    get: withBase(BasePaths.todos, '/:name'),
    list: BasePaths.todos,
    put: withBase(BasePaths.todos, '/:name'),
  }
};
