import React from 'react';
import { render, screen } from '@testing-library/react';
import BoardGrid from '@/features/game/components/board-grid';

describe('BoardGrid Component', () => {
  test('renders the board correctly', () => {
    const board = [
      ['A', 'B', 'C', 'D'],
      ['E', 'F', 'G', 'H'],
      ['I', 'J', 'K', 'L'],
      ['M', 'N', 'O', 'P'],
    ];
    render(
      <BoardGrid board={board} selectedPath={[]} onTileClick={jest.fn()} boardSize={4} />
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
  });

});