import React from 'react';
import { BoardSize, BOARD_SIZES } from '@/constants';

interface GameControlsProps {
  gameMode: 'TIMED' | 'UNTIMED';
  boardSize: BoardSize;
  onGameModeChange: (mode: 'TIMED' | 'UNTIMED') => void;
  onBoardSizeChange: (size: BoardSize) => void;
  onNewGame: () => void;
}

/**
 * Component to render game control buttons (board size, game mode, new game).
 * @param gameMode - Current game mode ('TIMED' or 'UNTIMED')
 * @param boardSize - Current board size
 * @param onGameModeChange - Callback to change game mode
 * @param onBoardSizeChange - Callback to change board size
 * @param onNewGame - Callback to start a new game
 */
export const GameControls: React.FC<GameControlsProps> = ({
  gameMode,
  boardSize,
  onGameModeChange,
  onBoardSizeChange,
  onNewGame,
}) => (
  <div className="space-y-6">
    <div>
      <p className="text-sm font-bold text-gray-400 mb-2">CURRENT GAME</p>
      <div className="flex justify-center gap-2">
        {BOARD_SIZES.map(size => (
          <button
            key={size}
            onClick={() => onBoardSizeChange(size)}
            className={`btn-bordered ${boardSize === size && 'bg-white text-[var(--primary-text)] font-bold'}`}
            aria-pressed={boardSize === size}
          >
            {`${size}x${size}`}
          </button>
        ))}
      </div>
    </div>
    <div>
      <div className="flex justify-center mb-2">
        <button
          onClick={() => onGameModeChange('UNTIMED')}
          className={`untimed ${gameMode === 'UNTIMED' ? 'active' : ''}`}
        >
          UNTIMED
        </button>
        <button
          onClick={() => onGameModeChange('TIMED')}
          className={`timed ${gameMode === 'TIMED' ? 'active' : ''}`}
        >
          TIMED ⏳
        </button>
      </div>
    </div>
    <button
      onClick={onNewGame}
      className="mt-4 px-6 py-2 border border-white rounded-full hover:bg-white hover:text-[var(--primary-text)] transition-all duration-200 font-semibold"
    >
      NEW GAME
    </button>
  </div>
);