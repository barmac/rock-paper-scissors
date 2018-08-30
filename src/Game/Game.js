import Move, { MOVE_TYPE } from './Move/Move';

export const GAME_RESULT = Object.freeze({
  FIRST_PLAYER: 0,
  SECOND_PLAYER: 1,
  TIE: 2,
});

export default class Game {
  getResult() {
    if (!(
      this.firstPlayerMove &&
      this.secondPlayerMove
    )) {
      throw new Error('Not all players and moves are specified');
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
