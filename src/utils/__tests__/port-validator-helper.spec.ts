import { isEmptyPort } from 'src/js/validator/port-validator-helper';

describe('isEmptyPort', () => {
  test('should return true on empty ports', () => {
    expect(isEmptyPort('')).toBeTruthy();
    expect(isEmptyPort(undefined)).toBeTruthy();
    expect(isEmptyPort('0')).toBeTruthy();
    expect(isEmptyPort('auto-assign')).toBeTruthy();
    expect(isEmptyPort('Auto-Assign')).toBeTruthy();
  });

  test('should return false with a valid port number', () => {
    expect(isEmptyPort('1')).toBeFalsy();
    expect(isEmptyPort('-1')).toBeFalsy();
    expect(isEmptyPort('2000')).toBeFalsy();
    expect(isEmptyPort('21321321321')).toBeFalsy();
  });
});
