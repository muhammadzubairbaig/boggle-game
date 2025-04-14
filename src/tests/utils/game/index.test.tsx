import { isAdjacent, isValidPath } from '@/utils/game';

describe('gameLogic', () => {
  test('isAdjacent returns true for adjacent positions', () => {
    expect(isAdjacent({ row: 1, col: 1 }, { row: 1, col: 2 })).toBe(true);
    expect(isAdjacent({ row: 1, col: 1 }, { row: 2, col: 2 })).toBe(true);
  });

  test('isAdjacent returns false for non-adjacent positions', () => {
    expect(isAdjacent({ row: 1, col: 1 }, { row: 1, col: 3 })).toBe(false);
    expect(isAdjacent({ row: 1, col: 1 }, { row: 1, col: 1 })).toBe(false);
  });

  test('isValidPath validates a correct path with word', () => {
    const board = [
      ['D', 'U', 'D', 'P'],
      ['E', 'A', 'T', 'N'],
      ['E', 'M', 'F', 'R'],
      ['C', 'X', 'H', 'C'],
    ];
    const path = [
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ];
    expect(isValidPath(path, 'EAT', board)).toBe(true);
  });

  test('isValidPath returns true for adjacency check with empty word', () => {
    const path = [
      { row: 1, col: 1 },
      { row: 1, col: 2 },
    ];
    expect(isValidPath(path, '')).toBe(true); 
  });

  test('isValidPath returns false for non-adjacent path', () => {
    const path = [
      { row: 1, col: 1 },
      { row: 1, col: 3 },
    ];
    expect(isValidPath(path, '')).toBe(false);
  });
});