import { expect, it, describe } from 'vitest';

// Check equal arrays in any order
export function expectArraysEqual(arr1, arr2) {
  expect(arr1.length).toBe(arr2.length);
  expect(arr1).toEqual(expect.arrayContaining(arr2));
  expect(arr2).toEqual(expect.arrayContaining(arr1));
}

describe('expectArraysEqual', () => {
  describe('should pass', () => {
    it('sorted equal arrays', () => {
      expectArraysEqual([1, 2, 3], [1, 2, 3]);
    });

    it('unsorted equal arrays', () => {
      expectArraysEqual([3, 2, 1], [1, 2, 3]);
    });

    it('arrays with objects', () => {
      expectArraysEqual([{ a: 1 }, { b: 2 }], [{ b: 2 }, { a: 1 }]);
    });
  });

  describe('should fail', () => {
    it('unequal array lengths', () => {
      expect(() => expectArraysEqual([2, 3], [1, 2, 3])).throws(
        'expected 2 to be 3',
      );
    });

    it('unequal arrays', () => {
      expect(() => expectArraysEqual([2, 3, 4], [1, 2, 3])).throws(
        'expected [ 2, 3, 4 ] to deeply equal ArrayContaining [1, 2, 3]',
      );
    });
  });
});
