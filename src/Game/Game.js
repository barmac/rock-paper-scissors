import Move, { MOVE_TYPE } from './Move/Move';
import Player from './Player/Player';

export const GAME_RESULT = Object.freeze({
  PLAYER_ONE: 0,
  PLAYER_TWO: 1,
  TIE: 2,
});

export default class Game {
  getResult() {
    if (!(
      this.firstPlayer &&
      this.secondPlayer &&
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
        return secondMoveType === MOVE_TYPE.ROCK ? GAME_RESULT.PLAYER_ONE : GAME_RESULT.PLAYER_TWO;
      case MOVE_TYPE.ROCK:
        return secondMoveType === MOVE_TYPE.SCISSORS ? GAME_RESULT.PLAYER_ONE : GAME_RESULT.PLAYER_TWO;
      case MOVE_TYPE.SCISSORS:
        return secondMoveType === MOVE_TYPE.ROCK ? GAME_RESULT.PLAYER_ONE : GAME_RESULT.PLAYER_TWO;
      default:
        throw new Error('Unknown move');
    }
  }

  setFirstPlayer(name) {
    this.firstPlayer = new Player(name);
  }

  setSecondPlayer(name) {
    this.secondPlayer = new Player(name);
  }

  assignMoveToFirstPlayer(moveType) {
    this.firstPlayerMove = new Move(moveType);
  }

  assignMoveToSecondPlayer(moveType) {
    this.secondPlayerMove = new Move(moveType);
  }
}
