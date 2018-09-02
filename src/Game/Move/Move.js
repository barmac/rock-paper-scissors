export const MOVE_TYPE = Object.freeze({
  ROCK: 0,
  PAPER: 1,
  SCISSORS: 2,
});

export class Move {
  constructor(moveType) {
    this.type = moveType;
  }

  getType() {
    return this.type;
  }
}
