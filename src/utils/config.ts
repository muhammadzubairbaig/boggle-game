/**
 * Get the minimum word length based on board size.
 * @param boardSize - Size of the board (e.g., 4 for 4x4)
 * @returns Minimum word length for the given board size
 */
export const getMinWordLength = (boardSize: number): number => {
  return boardSize === 4 ? 3 : 4; // 3 for 4x4, 4 for 5x5
};
