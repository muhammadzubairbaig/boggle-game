import React, { useCallback, useEffect, useState } from 'react';
import { useGameReducer, useDictionary } from '@/hooks';
import { findPath } from '@/utils/board';
import { Position } from '@/constants/types';
import { Timer, GameControls, ScoreDisplay } from '@/features/game/components';
import BoardGrid from '@/features/game/components/board-grid';
import { BoardSize } from '@/constants';
import { getMinWordLength } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@/component/ui/spinner';

/**
 * Main Board component for the Boggle game.
 */
const Board: React.FC = () => {
  const [boardSize, setBoardSize] = React.useState<BoardSize>(4);
  const { dictionary, error, isLoading } = useDictionary();
  const {
    state,
    handleClick,
    handleClear,
    handleNewGame,
    handleEndGame,
    handleTimeUp,
    handleGameModeChange,
    handleBoardSizeChange,
  } = useGameReducer({ boardSize, dictionary });

  const handleBoardSizeChangeWrapper = useCallback(
    (size: BoardSize) => {
      setBoardSize(size);
      handleBoardSizeChange(size);
    },
    [handleBoardSizeChange]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (state.timeUp) return;
      if (e.key === 'Escape' || e.key === 'Backspace') {
        handleClear();
      } else if (e.key.match(/^[a-zA-Z]$/)) {
        const newWord = state.currentWord + e.key.toUpperCase();
        const path = findPath(newWord, state.board, boardSize);
        if (path) {
          handleClick(path[path.length - 1].row, path[path.length - 1].col);
        }
      }
    },
    [state, handleClick, handleClear, boardSize]
  );

  // Use React Query to compute possible words
  const { data: possibleWords = [] } = useQuery({
    queryKey: ['possibleWords', state.board, boardSize, dictionary],
    queryFn: async () => {
      if (!dictionary || dictionary.size === 0) return [];
      const minWordLength = getMinWordLength(boardSize);
      const validWords: string[] = [];
      const words = Array.from(dictionary);

      for (const word of words) {
        if (word.length < minWordLength) continue;
        const path = findPath(word.toUpperCase(), state.board, boardSize);
        if (path) {
          validWords.push(word.toUpperCase());
        }
      }

      return validWords.sort();
    },
    enabled: !isLoading && !!dictionary && dictionary.size > 0,
  });

  return (
    <div
      className="min-h-screen bg-radial-custom text-white flex flex-col items-center justify-center p-4 lg:p-6 font-sans focus:outline-none"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {isLoading ? <div className="text-white font-bold mt-4 flex items-center justify-center">
        <Spinner size="xl" />
      </div>
        : (<>
          {error && <div className="alert-error">{error}</div>}
          <div className="flex flex-col lg:flex-row w-full max-w-6xl justify-between items-start gap-6 lg:gap-10">
            <div className="order-1 lg:order-none m-auto lg:w-1/2">
              <GameControls
                gameMode={state.gameMode}
                boardSize={boardSize}
                onGameModeChange={handleGameModeChange}
                onBoardSizeChange={handleBoardSizeChangeWrapper}
                onNewGame={handleNewGame}
              />
            </div>
            <div className="order-2 lg:order-none m-auto lg:w-1/2">

              <div className="h-[50px]">
                {state.isRunning && (
                  <Timer onTimeUp={handleTimeUp} isRunning={state.isRunning} resetKey={state.resetKey} />
                )}
                <span className="alert-error">
                  {state.timeUp && (
                    <>
                      ⏰ Time's up! Your final score: {state.score}
                    </>
                  )
                  }

                </span>
              </div>
              <button onClick={handleEndGame} className="btn-bordered mb-4 text-sm lg:text-base">
                END GAME & SUBMIT SCORE
              </button>
              <div className="board-wrap">
                <div className="word-display">
                  {state.selectedPath.map((pos: Position, idx: number) => (
                    <div key={idx} className="word-wrap">
                      {state.board[pos.row][pos.col]}
                    </div>
                  ))}
                </div>
                <div className="game-wrap text-[var(--primary-text)] rounded-2xl shadow-lg p-4 lg:p-6 relative">
                  <div className="rounded-t-2xl" />
                  <BoardGrid
                    board={state.board}
                    selectedPath={state.selectedPath}
                    onTileClick={handleClick}
                    boardSize={boardSize}
                  />
                </div>
                <div className="p-2">
                  <button onClick={handleClear} className="btn-bordered-sm">
                    Clear
                  </button>
                  <ul className="word-list">
                    {state.submittedWords.map((word: string, idx: number) => (
                      <li key={idx} className="word-list-item">
                        {word}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="order-3 lg:order-none m-auto lg:w-1/2">
              <ScoreDisplay
                score={state.score}
                wordsFound={state.submittedWords.length}
                gameMode={state.gameMode}
                possibleWords={possibleWords}
              />
            </div>
          </div>
        </>)
      }

    </div>
  );
};

export default Board;