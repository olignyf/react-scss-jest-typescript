import { compileWithArgs } from 'src/js/helper/path-to-regexp-helper';

describe('compileWithArgs', () => {
  test('path with argument is properly resolved', () => {
    const path = 'path/to/:argument/test';
    const argument = { argument: 'test' };
    expect(compileWithArgs(path)(argument)).toEqual('path/to/test/test');
  });

  test('path with multiple arguments is properly resolved', () => {
    const path = 'path/to/:firstArgument/:secondArgument/test';
    const argument = { firstArgument: 'first', secondArgument: 'second' };
    expect(compileWithArgs(path)(argument)).toEqual('path/to/first/second/test');
  });

  test('path with no argument is properly resolved', () => {
    const path = 'path/to/test';
    const argument = { firstArgument: 'first', secondArgument: 'second' };
    expect(compileWithArgs(path)(argument)).toEqual('path/to/test');
  });

  test('path with multiple arguments and other arguments is properly resolved', () => {
    const path = 'path/to/:firstArgument/:secondArgument/test';
    const argument = {
      firstArgument: 'first',
      secondArgument: 'second',
      firstUselessArgument: 'useless',
      secondUselessArgument: 'useless',
    };
    expect(compileWithArgs(path)(argument)).toEqual('path/to/first/second/test');
  });

  test('path with invalid argument returns the path unresolved', () => {
    const path = 'path/to/:argument/test';
    const argument = { invalidArgument: 'test' };
    expect(() => {
      compileWithArgs(path)(argument);
    }).toThrow(new TypeError('Expected "argument" to be defined'));
  });

  test('URI encode path with + sign in argument', () => {
    const path = 'path/to/:argument/test';
    const argument = { argument: 'test+uri+encode' };
    expect(() => {
      compileWithArgs(path)(argument);
    }).toEqual('path/to/test+uri+encode/test');
  });
});
