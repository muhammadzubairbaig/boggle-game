import { generateBoard, findPath } from '@/utils/board';

describe('boardUtils', () => {
  test('generateBoard creates a board of the correct size', () => {
    const board = generateBoard(4);
    expect(board).toHaveLength(4);
    expect(board[0]).toHaveLength(4);
    expect(board.every(row => row.every(letter => /^[A-Z]$/.test(letter)))).toBe(true);
  });

  test('findPath finds a valid path for a word', () => {
    const board = [
      ['D', 'U', 'D', 'P'],
      ['E', 'A', 'T', 'N'],
      ['E', 'M', 'F', 'R'],
      ['C', 'X', 'H', 'C'],
    ];
    const path = findPath('EAT', board, 4);
    expect(path).toEqual([
      { row: 1, col: 0 }, // E
      { row: 1, col: 1 }, // A
      { row: 1, col: 2 }, // T
    ]);
  });

  test('findPath returns null for an invalid word', () => {
    const board = [
      ['D', 'U', 'D', 'P'],
      ['E', 'A', 'T', 'N'],
      ['E', 'M', 'F', 'R'],
      ['C', 'X', 'H', 'C'],
    ];
    const path = findPath('ZXY', board, 4);
    expect(path).toBeNull();
  });
});