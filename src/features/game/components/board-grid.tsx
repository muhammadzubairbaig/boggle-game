import React, { memo } from 'react';
import { Position } from '@/constants/types';

interface BoardGridProps {
  board: string[][];
  selectedPath: Position[];
  onTileClick: (row: number, col: number) => void;
  boardSize: number;
}

/**
 * Component to render the game board grid with connecting lines between selected tiles.
 * @param board - 2D array representing the game board
 * @param selectedPath - Array of selected tile positions
 * @param onTileClick - Callback for tile click events
 * @param boardSize - Size of the board (e.g., 4 for 4x4)
 */
const BoardGrid: React.FC<BoardGridProps> = ({
  board,
  selectedPath,
  onTileClick,
  boardSize,
}) => {

  const FIXED_TILE_SIZE = 48; 
  const FIXED_GAP = 8; 

  // Calculate the center positions of each tile in the selected path
  const getTileCenter = (pos: Position) => {
    const x = pos.col * (FIXED_TILE_SIZE + FIXED_GAP) + FIXED_TILE_SIZE / 2;
    const y = pos.row * (FIXED_TILE_SIZE + FIXED_GAP) + FIXED_TILE_SIZE / 2;
    return { x, y };
  };

  const getLinePoints = (startPos: Position, endPos: Position) => {
    const start = getTileCenter(startPos);
    const end = getTileCenter(endPos);

    const tileRadius = FIXED_TILE_SIZE / 2;
    const lineOffset = tileRadius - 4;

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) {
      return { startX: start.x, startY: start.y, endX: end.x, endY: end.y };
    }

    const offsetStartX = (dx / distance) * lineOffset;
    const offsetStartY = (dy / distance) * lineOffset;
    const offsetEndX = (dx / distance) * lineOffset;
    const offsetEndY = (dy / distance) * lineOffset;

    const startX = start.x + offsetStartX;
    const startY = start.y + offsetStartY;
    const endX = end.x - offsetEndX;
    const endY = end.y - offsetEndY;

    return { startX, startY, endX, endY };
  };

  
  const svgWidth = boardSize * FIXED_TILE_SIZE + (boardSize - 1) * FIXED_GAP;
  const svgHeight = boardSize * FIXED_TILE_SIZE + (boardSize - 1) * FIXED_GAP;

  return (
    <div className="relative">
      {/* Grid of tiles */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
        }}
        role="grid"
      >
        {board.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const isSelected = selectedPath.some(
              p => p.row === rowIndex && p.col === colIndex
            );
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => onTileClick(rowIndex, colIndex)}
                className={`w-12 h-12 text-xl font-extrabold rounded-full shadow-md flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[var(--primary-text)] text-white'
                    : 'bg-white text-[var(--primary-text)] hover:bg-gray-200'
                }`}
                aria-label={`Letter ${letter} at row ${rowIndex + 1}, column ${colIndex + 1}`}
              >
                {letter}
              </button>
            );
          })
        )}
      </div>

      {/* SVG for connecting lines */}
      {selectedPath.length > 1 && (
        <svg
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: `${svgWidth}px`,
            height: `${svgHeight}px`,
          }}
        >
          {selectedPath.slice(0, -1).map((pos, idx) => {
            const nextPos = selectedPath[idx + 1];
            const { startX, startY, endX, endY } = getLinePoints(pos, nextPos);
            return (
              <line
                key={`${pos.row}-${pos.col}-${nextPos.row}-${nextPos.col}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};

export default memo(BoardGrid);