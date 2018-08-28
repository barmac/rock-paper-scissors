import Game, { GAME_RESULT } from './Game';
import { MOVE_TYPE } from './Move/Move';

const mockPlayerNames = ['PLAYER_ONE', 'PLAYER_TWO'];
const winnerLoserConfigurations = [
  [MOVE_TYPE.PAPER, MOVE_TYPE.ROCK],
  [MOVE_TYPE.ROCK, MOVE_TYPE.SCISSORS],
  [MOVE_TYPE.SCISSORS, MOVE_TYPE.PAPER],
]

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

    describe('First player wins', () => {
      winnerLoserConfigurations.forEach(configuration => {
        it('should return FIRST_PLAYER for each valid config', () => {
          game.assignMoveToFirstPlayer(configuration[0]);
          game.assignMoveToSecondPlayer(configuration[1]);

          const result = game.getResult();

          expect(result).toBe(GAME_RESULT.FIRST_PLAYER);
        });
      });
    });

    describe('Second player wins', () => {
      winnerLoserConfigurations.forEach(configuration => {
        it('should return SECOND_PLAYER for each valid config', () => {
          game.assignMoveToFirstPlayer(configuration[1]);
          game.assignMoveToSecondPlayer(configuration[0]);

          const result = game.getResult();

          expect(result).toBe(GAME_RESULT.SECOND_PLAYER);
        });
      });
    });
  });
});
