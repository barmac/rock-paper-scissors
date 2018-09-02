export const MOVE_TYPE = Object.freeze({
  ROCK: 'Rock',
  PAPER: 'Paper',
  SCISSORS: 'Scissors',
});

export class Move {
  constructor(moveType) {
    this.type = moveType;
  }

  getType() {
    return this.type;
  }
}
