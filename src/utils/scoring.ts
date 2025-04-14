/**
 * Calculates the score for a given word based on its length.
 * Scoring rules:
 * - Less than 3 letters: 0 points
 * - 3 letters: 1 point
 * - 4 letters: 2 points
 * - 5 letters: 3 points
 * - 6 letters: 5 points
 * - 7 or more letters: length points
 * @param word - The word to score
 * @returns The score for the word
 */
export const getWordScore = (word: string): number => {
  const length = word.length;
  if (length < 3) return 0;
  if (length === 3) return 1;
  if (length === 4) return 2;
  if (length === 5) return 3;
  if (length === 6) return 5;
  return length;
};

/**
 * Calculates the total score for a list of words.
 * @param words - Array of words to score.
 * @returns The total score.
 */
export function wordListScore(words: string[]): number {
  if (!words) return 0;
  return words.reduce((total, word) => total + getWordScore(word), 0);
}

/**
* Calculates scores for multiple players, scoring only unique words.
* @param playerWordLists - Array of word lists per player.
* @returns Array of scores per player.
*/
export function multiplayerScore(playerWordLists: string[][]): number[] {
  if (!playerWordLists || !playerWordLists.length) return [];

  // Count word frequency across players
  const wordFreq = new Map<string, number>();
  playerWordLists.forEach(words => {
    words.forEach(word => {
      if (word.length >= 3) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });
  });

  // Score unique words for each player
  return playerWordLists.map(words =>
    wordListScore(words.filter(word => wordFreq.get(word) === 1))
  );
}