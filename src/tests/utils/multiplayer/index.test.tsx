import { multiplayerScore } from '@/utils/scoring';

describe('multiplayerScore', () => {
  const examplePlayers = [
    ['am', 'bibble', 'loo', 'malarkey'],           // Player 1: 14 points
    ['nudiustertian', 'quire', 'widdershins'],     // Player 2: 27 points
    ['xertz', 'gardyloo', 'catty', 'fuzzle'],      // Player 3: 19 points
    ['bumfuzzle', 'wabbit', 'catty', 'am', 'loo'], // Player 4: 18 points
    ['bibble', 'loo', 'snickersnee', 'quire', 'am', 'malarkey'], // Player 5: 28 points
  ];
  
  test('calculates scores for multiple players correctly', () => {
    const scores = multiplayerScore(examplePlayers);
    expect(scores).toEqual([0, 24, 16, 14, 11]);
  });

  test('handles empty player lists', () => {
    const scores = multiplayerScore([]);
    expect(scores).toEqual([]);
  });

  test('handles players with no words', () => {
    const playersWithEmpty = [
      ['am', 'bibble'], // Player 1: 5 points
      [],               // Player 2: 0 points
      ['loo'],         // Player 3: 1 point
    ];
    const scores = multiplayerScore(playersWithEmpty);
    expect(scores).toEqual([5, 0, 1]);
  });

  test('handles invalid words (less than 3 letters)', () => {
    const playersWithInvalid = [
      ['am', 'a', ''],      // Player 1: 0 points (all invalid)
      ['loo', 'bibble'],    // Player 2: 6 points
      ['catty', 'x', 'ab'], // Player 3: 3 points (only 'catty' counts)
    ];
    const scores = multiplayerScore(playersWithInvalid);
    expect(scores).toEqual([0, 6, 3]);
  });
});