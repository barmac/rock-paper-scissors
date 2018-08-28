import Game, { GAME_RESULT } from './Game';
import { MOVE_TYPE } from './Move/Move';

const mockPlayerNames = ['PLAYER_ONE', 'PLAYER_TWO'];

describe('Game', () => {
  describe('Improper config', () => {
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

  describe('Game rules', () => {
    /**
     * @type {Game}
     */
    let game;

    beforeEach(() => {
      game = new Game();
      game.setFirstPlayer(mockPlayerNames[0]);
      game.setSecondPlayer(mockPlayerNames[1]);
    });

    describe('TIE', () => {
      Object.keys(MOVE_TYPE).forEach(moveTypeKey => {
        it(`should return TIE if the moves are of equal type: ${moveTypeKey}`, () => {
          game.assignMoveToFirstPlayer(MOVE_TYPE[moveTypeKey]);
          game.assignMoveToSecondPlayer(MOVE_TYPE[moveTypeKey]);

          const result = game.getResult();

          expect(result).toBe(GAME_RESULT.TIE);
        });
      });
    });
  });
});
