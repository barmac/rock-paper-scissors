import Game from './Game';

describe('Game', () => {
  it('should throw error if not every property is set', () => {
    const game = new Game();
    let thrownError;

    try {
      game.getResult();
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeDefined();
  });
});
