import { getMinWordLength } from '@/utils';

describe('config', () => {
  test('getMinWordLength returns correct minimum word length', () => {
    expect(getMinWordLength(4)).toBe(3); // 4x4 board
    expect(getMinWordLength(5)).toBe(4); // 5x5 board
  });
});