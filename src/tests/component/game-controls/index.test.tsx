import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameControls } from '@/features/game/components/game-controls';

describe('GameControls Component', () => {
  const mockProps = {
    gameMode: 'UNTIMED' as const,
    boardSize: 4 as 4, // Type assertion to ensure literal type
    onGameModeChange: jest.fn(),
    onBoardSizeChange: jest.fn(),
    onNewGame: jest.fn(),
  };

  test('renders board size buttons', () => {
    render(<GameControls {...mockProps} />);
    expect(screen.getByText('4x4')).toBeInTheDocument();
    expect(screen.getByText('5x5')).toBeInTheDocument();
  });

  test('renders game mode buttons', () => {
    render(<GameControls {...mockProps} />);
    expect(screen.getByText('UNTIMED')).toBeInTheDocument();
    expect(screen.getByText('TIMED ⏳')).toBeInTheDocument();
  });

  test('calls onBoardSizeChange when board size button is clicked', () => {
    render(<GameControls {...mockProps} />);
    const button5x5 = screen.getByText('5x5');
    fireEvent.click(button5x5);
    expect(mockProps.onBoardSizeChange).toHaveBeenCalledWith(5);
  });

  test('calls onGameModeChange when game mode button is clicked', () => {
    render(<GameControls {...mockProps} />);
    const timedButton = screen.getByText('TIMED ⏳');
    fireEvent.click(timedButton);
    expect(mockProps.onGameModeChange).toHaveBeenCalledWith('TIMED');
  });

  test('calls onNewGame when new game button is clicked', () => {
    render(<GameControls {...mockProps} />);
    const newGameButton = screen.getByText('NEW GAME');
    fireEvent.click(newGameButton);
    expect(mockProps.onNewGame).toHaveBeenCalled();
  });
});