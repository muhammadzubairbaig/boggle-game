import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDictionary, useGameReducer } from '@/hooks';
import Board from '@/component/layout/board/board';

// Create a QueryClient instance for testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries in tests for faster failure
    },
  },
});

// Mock the hooks
jest.mock('@/hooks');

const mockDictionary = new Set(['eat', 'cxh']);
const mockBoard = [
  ['D', 'U', 'D', 'P'],
  ['E', 'A', 'T', 'N'],
  ['E', 'M', 'F', 'R'],
  ['C', 'X', 'H', 'C'],
];

const mockGameState = {
  state: {
    board: mockBoard,
    selectedPath: [],
    currentWord: '',
    submittedWords: [],
    score: 0,
    isRunning: false,
    timeUp: false,
    gameMode: 'UNTIMED' as const,
    resetKey: 0,
  },
  handleClick: jest.fn(),
  handleClear: jest.fn(),
  handleNewGame: jest.fn(),
  handleEndGame: jest.fn(),
  handleTimeUp: jest.fn(),
  handleGameModeChange: jest.fn(),
  handleBoardSizeChange: jest.fn(),
};

describe('Board Component', () => {
  beforeEach(() => {
    (useDictionary as jest.Mock).mockReturnValue({
      dictionary: mockDictionary,
      error: null,
      isLoading: false,
    });
    (useGameReducer as jest.Mock).mockReturnValue(mockGameState);
  });

  // Helper function to render the Board with QueryClientProvider
  const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  test('renders the board and controls', () => {
    renderWithQueryClient(<Board />);
    expect(screen.getByText('END GAME & SUBMIT SCORE')).toBeInTheDocument();
  });

  test('renders the 4x4 board by default', () => {
    renderWithQueryClient(<Board />);
    const tiles = screen.getAllByRole('button', { name: /Letter/ });
    expect(tiles).toHaveLength(16); // 4x4 board
    expect(tiles[0]).toHaveTextContent('D');
    expect(tiles[4]).toHaveTextContent('E');
  });

  test('displays dictionary error if present', () => {
    (useDictionary as jest.Mock).mockReturnValue({
      dictionary: new Set(),
      error: 'Dictionary unavailable. Words won’t be validated.',
      isLoading: false,
    });
    renderWithQueryClient(<Board />);
    expect(screen.getByText('Dictionary unavailable. Words won’t be validated.')).toBeInTheDocument();
  });

  test('allows selecting tiles by clicking', () => {
    renderWithQueryClient(<Board />);
    const tileE = screen.getByText('E', { selector: '[aria-label="Letter E at row 2, column 1"]' });
    fireEvent.click(tileE);
    expect(mockGameState.handleClick).toHaveBeenCalledWith(1, 0);
  });

  test('clears selection when clear button is clicked', () => {
    renderWithQueryClient(<Board />);
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    expect(mockGameState.handleClear).toHaveBeenCalled();
  });

  test('ends game when end game button is clicked', () => {
    renderWithQueryClient(<Board />);
    const endGameButton = screen.getByText('END GAME & SUBMIT SCORE');
    fireEvent.click(endGameButton);
    expect(mockGameState.handleEndGame).toHaveBeenCalled();
  });

  test('switches to 5x5 board when 5x5 button is clicked', () => {
    renderWithQueryClient(<Board />);
    const button5x5 = screen.getByText('5x5');
    fireEvent.click(button5x5);
    expect(mockGameState.handleBoardSizeChange).toHaveBeenCalledWith(5);
  });

  test('changes game mode to TIMED when TIMED button is clicked', () => {
    renderWithQueryClient(<Board />);
    const timedButton = screen.getByText('TIMED ⏳');
    fireEvent.click(timedButton);
    expect(mockGameState.handleGameModeChange).toHaveBeenCalledWith('TIMED');
  });
});