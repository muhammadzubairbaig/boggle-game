export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  board: string[][];
  selectedPath: Position[];
  currentWord: string;
  submittedWords: string[];
  score: number;
  isRunning: boolean;
  timeUp: boolean;
  gameMode: 'TIMED' | 'UNTIMED';
  resetKey: number;
}