import { useReducer, useCallback } from 'react';
import { generateBoard } from '../utils/board';
import { getWordScore } from '../utils/scoring';
import { isValidPath } from '../utils/game';
import { GameState, Position } from '@/constants/types';
import { getMinWordLength } from '@/utils/config';

// Action types
type GameAction =
  | { type: 'SET_BOARD'; payload: string[][] }
  | { type: 'SET_SELECTED_PATH'; payload: Position[] }
  | { type: 'SET_CURRENT_WORD'; payload: string }
  | { type: 'SUBMIT_WORD'; payload: { word: string; score: number } }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_SCORE'; payload: number }
  | { type: 'SET_RUNNING'; payload: boolean }
  | { type: 'SET_TIME_UP'; payload: boolean }
  | { type: 'SET_GAME_MODE'; payload: 'TIMED' | 'UNTIMED' }
  | { type: 'INCREMENT_RESET_KEY' }
  | { type: 'RESET_GAME'; payload: { boardSize: number; gameMode: 'TIMED' | 'UNTIMED' } };

// Initial state
const getInitialState = (boardSize: number): GameState => ({
  board: generateBoard(boardSize),
  selectedPath: [],
  currentWord: '',
  submittedWords: [],
  score: 0,
  isRunning: false,
  timeUp: false,
  gameMode: 'UNTIMED',
  resetKey: 0,
});

// Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_BOARD':
      return { ...state, board: action.payload };
    case 'SET_SELECTED_PATH':
      return { ...state, selectedPath: action.payload };
    case 'SET_CURRENT_WORD':
      return { ...state, currentWord: action.payload };
    case 'SUBMIT_WORD':
      return {
        ...state,
        submittedWords: [...state.submittedWords, action.payload.word],
        score: state.score + action.payload.score,
        currentWord: '',
        selectedPath: [],
      };
    case 'CLEAR_SELECTION':
      return { ...state, currentWord: '', selectedPath: [] };
    case 'SET_SCORE':
      return { ...state, score: action.payload };
    case 'SET_RUNNING':
      return { ...state, isRunning: action.payload };
    case 'SET_TIME_UP':
      return { ...state, timeUp: action.payload };
    case 'SET_GAME_MODE':
      return { ...state, gameMode: action.payload };
    case 'INCREMENT_RESET_KEY':
      return { ...state, resetKey: state.resetKey + 1 };
    case 'RESET_GAME':
      return {
        ...getInitialState(action.payload.boardSize),
        gameMode: action.payload.gameMode,
        isRunning: action.payload.gameMode === 'TIMED',
      };
    default:
      return state;
  }
};

interface UseGameReducerProps {
  boardSize: number;
  dictionary: Set<string>;
}

/**
 * Custom hook to manage game state using useReducer.
 * @param boardSize - Size of the game board (e.g., 4 for 4x4, 5 for 5x5)
 * @param dictionary - Set of valid words for validation
 * @returns Game state and action dispatchers
 */
export const useGameReducer = ({ boardSize, dictionary }: UseGameReducerProps) => {
  const [state, dispatch] = useReducer(gameReducer, boardSize, getInitialState);
  const minWordLength = getMinWordLength(boardSize);

  const handleClick = useCallback(
    (row: number, col: number) => {
      if (state.timeUp) return;

      const pos: Position = { row, col };
      // Prevent selecting the same tile again
      if (state.selectedPath.some(p => p.row === pos.row && p.col === pos.col)) return;

      // Check adjacency only if there's a previous position
      const last = state.selectedPath.length > 0 ? state.selectedPath[state.selectedPath.length - 1] : null;
      if (last && !isValidPath([last, pos], '')) return;

      const newPath = [...state.selectedPath, pos];
      const newWord =
        state.selectedPath.length === 0
          ? state.board[row][col]
          : state.currentWord + state.board[row][col];

      // Dispatch the updates
      dispatch({ type: 'SET_SELECTED_PATH', payload: newPath });
      dispatch({ type: 'SET_CURRENT_WORD', payload: newWord });

      const lowerWord = newWord.toLowerCase();
      if (
        newWord.length >= minWordLength &&
        dictionary.has(lowerWord) &&
        !state.submittedWords.includes(lowerWord) &&
        isValidPath(newPath, newWord, state.board)
      ) {
        const score = getWordScore(newWord);
        dispatch({ type: 'SUBMIT_WORD', payload: { word: lowerWord, score } });
      }
    },
    [state, dictionary, minWordLength]
  );

  const handleClear = useCallback(() => {
    dispatch({ type: 'CLEAR_SELECTION' });
  }, []);

  const handleNewGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME', payload: { boardSize, gameMode: state.gameMode } });
    if (state.gameMode === 'TIMED') {
      dispatch({ type: 'INCREMENT_RESET_KEY' });
    }
  }, [boardSize, state.gameMode]);

  const handleEndGame = useCallback(() => {
    dispatch({ type: 'SET_RUNNING', payload: false });
    dispatch({ type: 'SET_TIME_UP', payload: true });
  }, [state.score]);

  const handleTimeUp = useCallback(() => {
    dispatch({ type: 'SET_RUNNING', payload: false });
    dispatch({ type: 'SET_TIME_UP', payload: true });
  }, [state.score]);

  const handleGameModeChange = useCallback((mode: 'TIMED' | 'UNTIMED') => {
    dispatch({ type: 'SET_GAME_MODE', payload: mode });
    dispatch({ type: 'SET_RUNNING', payload: mode === 'TIMED' });
    dispatch({ type: 'SET_TIME_UP', payload: false });
  }, []);

  const handleBoardSizeChange = useCallback((size: number) => {
    dispatch({ type: 'RESET_GAME', payload: { boardSize: size, gameMode: state.gameMode } });
    if (state.gameMode === 'TIMED') {
      dispatch({ type: 'INCREMENT_RESET_KEY' });
    }
  }, [state.gameMode]);

  return {
    state,
    handleClick,
    handleClear,
    handleNewGame,
    handleEndGame,
    handleTimeUp,
    handleGameModeChange,
    handleBoardSizeChange,
  };
};