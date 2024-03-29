import { isEvenNumber } from 'src/js/validator/number-validator-helper';

describe('isEvenNumber', () => {
  test('should return true on even numbers', () => {
    expect(isEvenNumber(0)).toBeTruthy();
    expect(isEvenNumber(2)).toBeTruthy();
    expect(isEvenNumber(12)).toBeTruthy();
    expect(isEvenNumber(-24)).toBeTruthy();
  });

  test('should return false with an odd number', () => {
    expect(isEvenNumber(1)).toBeFalsy();
    expect(isEvenNumber(3)).toBeFalsy();
    expect(isEvenNumber(-15)).toBeFalsy();
    expect(isEvenNumber(undefined)).toBeFalsy();
  });
});
