import React, { useState } from 'react';

interface ScoreDisplayProps {
  score: number;
  wordsFound: number;
  gameMode: 'TIMED' | 'UNTIMED';
  possibleWords: string[] | null; // Allow null for defensive programming
}

/**
 * ScoreDisplay component to show the player's score, number of words found,
 * game mode, and the list of possible words that can be formed on the board.
 *
 * @param score - The player's current score
 * @param wordsFound - The number of words the player has found
 * @param gameMode - The current game mode ('TIMED' or 'UNTIMED')
 * @param possibleWords - The list of possible words that can be formed on the board
 */
export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  wordsFound,
  gameMode,
  possibleWords,
}) => {
  const [isPossibleWordsVisible, setIsPossibleWordsVisible] = useState(false);

  // Toggle the visibility of the possible words list
  const togglePossibleWordsVisibility = () => {
    setIsPossibleWordsVisible((prev) => !prev);
  };

  return (
    <div>
      {/* Score and Words Found Section */}
      <div className="bg-[#0f1f33] rounded-xl px-6 py-4 text-center text-white shadow-md">
        <h2 className="text-sm text-gray-300 mb-4">YOUR SCORES</h2>
        <div className="space-y-4">
          <div>
            <span className="text-xl font-bold">{score}</span>
            <p className="text-sm text-gray-400">Score ({gameMode})</p>
          </div>
          <div>
            <span className="text-xl font-bold">{wordsFound}</span>
            <p className="text-sm text-gray-400">Words Found ({gameMode})</p>
          </div>
        </div>
      </div>

      {/* Possible Words Section */}
      <div className="mt-4 w-full max-w-md">
        <button
          className="bg-[#0f1f33] rounded-xl px-4 py-2 text-sm text-white shadow-md hover:bg-[#1a2b4d] transition duration-300"
          onClick={togglePossibleWordsVisibility}
          aria-expanded={!isPossibleWordsVisible}
          aria-controls="possible-words-list"
        >
          {isPossibleWordsVisible ? 'Hide Possible Words' : 'Show Possible Words'}
        </button>

        {isPossibleWordsVisible && (
          <div
            id="possible-words-list"
            className="bg-[#0f1f33] rounded-xl px-6 py-4 text-center text-white shadow-md mt-4 transition-opacity duration-300"
            role="region"
            aria-live="polite"
          >
            <div>
              <h3 className="text-md sm:text-lg font-semibold">
                Possible words on this board: {possibleWords && possibleWords.length}
              </h3>
              <ul
                className="p-2 text-gray-200 text-start space-y-1 max-h-40 overflow-y-auto"
                role="list"
              >
                {possibleWords && possibleWords.map((word, idx) => (
                  <li
                    key={idx}
                    className="text-xs sm:text-sm uppercase animate-fade-in text-white"
                    aria-label={`Possible word ${word}`}
                  >
                    {word}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};