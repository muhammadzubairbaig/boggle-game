import { Position } from '../constants/types';

export const isAdjacent = (a: Position, b: Position): boolean => {
  const rowDiff = Math.abs(a.row - b.row);
  const colDiff = Math.abs(a.col - b.col);
  return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
};

/**
 * Validates a path on the board.
 * @param path - Array of positions forming the path
 * @param word - Word to validate against the path (empty string for adjacency check only)
 * @param board - Optional board to validate the word against
 * @returns True if the path is valid, false otherwise
 */
export const isValidPath = (path: Position[], word: string, board?: string[][]): boolean => {
  // Skip length check if word is empty (we're only checking adjacency)
  if (word.length > 0 && path.length !== word.length) return false;

  // Check adjacency between consecutive positions
  for (let i = 0; i < path.length - 1; i++) {
    if (!isAdjacent(path[i], path[i + 1])) return false;
  }

  // If board is provided, validate the word against the path
  if (board) {
    const pathWord = path.map(p => board[p.row][p.col].toLowerCase()).join('');
    return pathWord === word.toLowerCase();
  }

  return true; 
};