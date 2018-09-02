import { Move, MOVE_TYPE } from './Move';

export const MISSING_MOVE_ERROR = 'MISSING_MOVE_ERROR';

export const GAME_RESULT = Object.freeze({
  FIRST_PLAYER: 'First player wins',
  SECOND_PLAYER: 'Second player wins',
  TIE: 'Tie',
});

export default class Game {
  getResult() {
    if (!(
      this.firstPlayerMove &&
      this.secondPlayerMove
    )) {
      throw new Error(MISSING_MOVE_ERROR);
    }

    const [firstMoveType, secondMoveType] = [this.firstPlayerMove.getType(), this.secondPlayerMove.getType()];

    if (firstMoveType === secondMoveType) {
      return GAME_RESULT.TIE;
    }

    switch (firstMoveType) {
      case MOVE_TYPE.PAPER:
        return secondMoveType === MOVE_TYPE.ROCK ? GAME_RESULT.FIRST_PLAYER : GAME_RESULT.SECOND_PLAYER;
      case MOVE_TYPE.ROCK:
        return secondMoveType === MOVE_TYPE.SCISSORS ? GAME_RESULT.FIRST_PLAYER : GAME_RESULT.SECOND_PLAYER;
      case MOVE_TYPE.SCISSORS:
        return secondMoveType === MOVE_TYPE.PAPER ? GAME_RESULT.FIRST_PLAYER : GAME_RESULT.SECOND_PLAYER;
      default:
        throw new Error('Unknown move');
    }
  }

  assignMoveToFirstPlayer(moveType) {
    this.firstPlayerMove = new Move(moveType);
  }

  assignMoveToSecondPlayer(moveType) {
    this.secondPlayerMove = new Move(moveType);
  }
}
