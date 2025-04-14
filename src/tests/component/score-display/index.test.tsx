import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { ScoreDisplay } from '@/features/game/components/score-display';

describe('ScoreDisplay Component', () => {
  const defaultProps = {
    score: 10,
    wordsFound: 3,
    gameMode: 'TIMED' as const,
    possibleWords: [],
    loading: false,
  };

  test('renders the title "YOUR SCORES"', () => {
    render(<ScoreDisplay {...defaultProps} />);
    expect(screen.getByText('YOUR SCORES')).toBeInTheDocument();
  });

  test('displays the score correctly', () => {
    render(<ScoreDisplay {...defaultProps} />);
    const scoreSection = screen.getByText('Score (TIMED)').parentElement;
    if (scoreSection) {
      expect(within(scoreSection).getByText('10')).toBeInTheDocument();
    }
    expect(screen.getByText('Score (TIMED)')).toBeInTheDocument();
  });

  test('displays the number of words found correctly', () => {
    render(<ScoreDisplay {...defaultProps} />);
    const wordsFoundSection = screen.getByText('Words Found (TIMED)').parentElement;
    if (wordsFoundSection) {
      expect(within(wordsFoundSection).getByText('3')).toBeInTheDocument();
    }
    expect(screen.getByText('Words Found (TIMED)')).toBeInTheDocument();
  });

  test('displays the game mode as UNTIMED when specified', () => {
    render(<ScoreDisplay {...defaultProps} gameMode="UNTIMED" />);
    expect(screen.getByText('Score (UNTIMED)')).toBeInTheDocument();
    expect(screen.getByText('Words Found (UNTIMED)')).toBeInTheDocument();
  });

  test('applies correct styling to the container', () => {
    render(<ScoreDisplay {...defaultProps} />);
    const container = screen.getByText('YOUR SCORES').parentElement;
    expect(container).toHaveClass('bg-[#0f1f33]');
    expect(container).toHaveClass('rounded-xl');
    expect(container).toHaveClass('px-6');
    expect(container).toHaveClass('py-4');
    expect(container).toHaveClass('text-center');
    expect(container).toHaveClass('text-white');
    expect(container).toHaveClass('shadow-md');
  });

  test('renders zero score and words found correctly and toggles possible words visibility', () => {
    render(<ScoreDisplay score={0} wordsFound={0} gameMode="TIMED" possibleWords={[]}  />);

    // Check the score section
    const scoreSection = screen.getByText('Score (TIMED)').parentElement;
    if (scoreSection) {
      expect(within(scoreSection).getByText('0')).toBeInTheDocument();
    }

    // Check the words found section
    const wordsFoundSection = screen.getByText('Words Found (TIMED)').parentElement;
    if (wordsFoundSection) {
      expect(within(wordsFoundSection).getByText('0')).toBeInTheDocument();
    }

    // Verify labels
    expect(screen.getByText('Score (TIMED)')).toBeInTheDocument();
    expect(screen.getByText('Words Found (TIMED)')).toBeInTheDocument();

    // Verify possible words section is hidden by default
    expect(screen.queryByText(/Possible words on this board: 0/)).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    // Click the "Show Possible Words" button to reveal the section
    const toggleButton = screen.getByText('Show Possible Words');
    fireEvent.click(toggleButton);

    // Verify the button text changes to "Hide Possible Words"
    expect(screen.getByText('Hide Possible Words')).toBeInTheDocument();

    // Verify possible words section when empty
    expect(screen.getByText(/Possible words on this board: 0/)).toBeInTheDocument();
    const possibleWordsList = screen.getByRole('list');
    expect(possibleWordsList).toBeEmptyDOMElement();
  });

  test('toggles possible words visibility correctly', () => {
    render(<ScoreDisplay {...defaultProps} possibleWords={['cat', 'hat']}  />);

    // Initially, the possible words section should be hidden
    expect(screen.queryByText(/Possible words on this board: 2/)).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    // Click to show the possible words
    const toggleButton = screen.getByText('Show Possible Words');
    fireEvent.click(toggleButton);

    // Verify the possible words section is now visible
    expect(screen.getByText(/Possible words on this board: 2/)).toBeInTheDocument();
    const possibleWordsList = screen.getByRole('list');
    // Expect lowercase 'cat' and 'hat' because the DOM text is lowercase,
    // even though the CSS 'uppercase' class makes it visually uppercase
    expect(within(possibleWordsList).getByText('cat')).toBeInTheDocument();
    expect(within(possibleWordsList).getByText('hat')).toBeInTheDocument();

    // Click to hide the possible words again
    fireEvent.click(toggleButton);

    // Verify the section is hidden again
    expect(screen.queryByText(/Possible words on this board: 2/)).not.toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

});