import { Position } from '../constants/types';

export const generateBoard = (size: number = 4): string[][] => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const board: string[][] = [];
  for (let i = 0; i < size; i++) {
    const row: string[] = [];
    for (let j = 0; j < size; j++) {
      row.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    board.push(row);
  }
  return board;
};

/**
 * Finds a valid path for a word on the board using DFS.
 * @param word - Word to find
 * @param board - 2D array representing the board
 * @param size - Size of the board
 * @returns Array of positions forming the path, or null if not found
 */
export const findPath = (word: string, board: string[][], size: number): Position[] | null => {
  const wordUpper = word.toUpperCase();
  const visited = new Set<string>();
  const path: Position[] = [];

  const dfs = (row: number, col: number, index: number): boolean => {
    if (index === wordUpper.length) return true;

    if (
      row < 0 ||
      row >= size ||
      col < 0 ||
      col >= size ||
      visited.has(`${row}-${col}`) ||
      board[row][col] !== wordUpper[index]
    ) {
      return false;
    }

    visited.add(`${row}-${col}`);
    path.push({ row, col });

    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1],  [1, 0],  [1, 1],
    ];

    for (const [dr, dc] of directions) {
      if (dfs(row + dr, col + dc, index + 1)) return true;
    }

    visited.delete(`${row}-${col}`);
    path.pop();
    return false;
  };

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (dfs(row, col, 0)) return path;
    }
  }

  return null;
};