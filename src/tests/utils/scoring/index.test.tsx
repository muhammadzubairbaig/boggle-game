import { getWordScore } from "@/utils";

describe('scoring', () => {
  test('getWordScore returns correct score for word length', () => {
    expect(getWordScore('A')).toBe(0); // < 3 letters
    expect(getWordScore('CAT')).toBe(1); // 3 letters → 1 point
    expect(getWordScore('WORD')).toBe(2); // 4 letters → 2 points
    expect(getWordScore('HELLO')).toBe(3); // 5 letters → 3 points
    expect(getWordScore('PEOPLE')).toBe(5); // 6 letters → 5 points
    expect(getWordScore('LONGEST')).toBe(7); // 7 letters → 7 points
  });
});