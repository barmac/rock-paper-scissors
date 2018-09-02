import Game, { MISSING_MOVE_ERROR, MOVE_TYPE } from '../Game';

const GAME_MODE = {
  PLAYER_VS_COMPUTER: 'PLAYER_VS_COMPUTER',
  COMPUTER_VS_COMPUTER: 'COMPUTER_VS_COMPUTER',
};

const COMPUTER_PLAYER = 'Computer';
const HUMAN_PLAYER = 'Player';

const GAME_STAGE = {
  START_GAME: 'START_GAME',
  CHOOSE_MOVE: 'CHOOSE_MOVE',
  SHOW_RESULT: 'SHOW_RESULT',
};

const defaultAppState = {
  currentGame: null,
  mode: null,
  stage: GAME_STAGE.START_GAME,
  firstPlayerName: null,
  firstPlayerMove: null,
  secondPlayerName: null,
  secondPlayerMove: null,
  result: null,
};

export class App {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.startGame = this.startGame.bind(this);
  }

  init() {
    this.setState(defaultAppState);
  }

  startGame(mode) {
    const currentGame = new Game();

    const firstPlayerName = mode === GAME_MODE.PLAYER_VS_COMPUTER ? HUMAN_PLAYER : COMPUTER_PLAYER;
    const secondPlayerName = COMPUTER_PLAYER;

    this.setState({
      currentGame,
      mode,
      firstPlayerName,
      secondPlayerName,
      stage: GAME_STAGE.CHOOSE_MOVE,
    });
  }

  setState(state) {
    const newState = {};

    for (const key in state) {
      if (state.hasOwnProperty(key)) {
        newState[key] = state[key];
      }
    }

    this.state = Object.assign({}, this.state, newState);
    this.render();
  }

  render() {
    switch (this.state.stage) {
      case GAME_STAGE.START_GAME:
        this.renderStartGame();
        break;
      case GAME_STAGE.CHOOSE_MOVE:
        this.renderChooseMove();
        break;
      case GAME_STAGE.SHOW_RESULT:
        this.renderShowResult();
        break;
      default:
        throw new Error('Unknown stage');
    }
  }

  renderStartGame() {
    this.rootElement.innerHTML = this.getStartGameTemplate();

    this.rootElement.querySelector(`[data-mode="${GAME_MODE.PLAYER_VS_COMPUTER}"]`)
      .addEventListener('click', () => this.startGame(GAME_MODE.PLAYER_VS_COMPUTER));

    this.rootElement.querySelector(`[data-mode="${GAME_MODE.COMPUTER_VS_COMPUTER}"]`)
      .addEventListener('click', () => this.startGame(GAME_MODE.COMPUTER_VS_COMPUTER));
  }

  getStartGameTemplate() {
    return `
      <nav>
        <h2>Start new game</h2>
        <ul>
          <li>
            <button data-mode="${GAME_MODE.PLAYER_VS_COMPUTER}">Player vs Computer</button>
          </li>
          <li>
            <button data-mode="${GAME_MODE.COMPUTER_VS_COMPUTER}">Computer vs Computer</button>
          </li>
        </ul>
      </nav>`;
  }

  renderChooseMove() {
    this.rootElement.innerHTML = this.getChooseMoveTemplate();
    this.rootElement.querySelector('[data-result-button]')
      .addEventListener('click', () => this.showResult());

    if (this.state.mode === GAME_MODE.PLAYER_VS_COMPUTER) {
      Object.keys(MOVE_TYPE)
        .forEach(key => {
          this.rootElement.querySelector(`[data-first-player] [data-move="${key}"]`)
            .addEventListener('click', () => this.assignFirstPlayerMove(MOVE_TYPE[key]));
        });
    }
  }

  getChooseMoveTemplate() {
    const hiddenMoveTemplate = this.getHiddenMoveTemplate();

    return `
      <section>
        <div data-first-player>
          <h3>${this.state.firstPlayerName}</h3>
          <div data-move-list>${this.state.mode === GAME_MODE.PLAYER_VS_COMPUTER ? this.getMoveListTemplate() : hiddenMoveTemplate}</div>
        </div>
        <div data-second-player>
          <h3>${this.state.secondPlayerName}</h3>
          <div data-move-list>${hiddenMoveTemplate}</div>
        </div>
      </section>
      <section data-result>
        <button data-result-button>Get result</button>
      </section>`;
  }

  getHiddenMoveTemplate() {
    return '<button disabled>?</button>';
  }

  getMoveListTemplate() {
    return Object.keys(MOVE_TYPE)
      .map(key => `<button data-move="${key}">${key}</button>`)
      .join('');
  }

  showResult() {
    this.assignMovesToComputerPlayers();

    try {
      const result = this.state.currentGame.getResult();

      this.setState({
        result,
        stage: GAME_STAGE.SHOW_RESULT,
      });
    } catch (error) {
      if (error.message === MISSING_MOVE_ERROR) {
        alert('Select your move first');
      } else {
        console.error(error);
      }
    }
  }

  assignMovesToComputerPlayers() {
    if (this.state.mode === GAME_MODE.COMPUTER_VS_COMPUTER) {
      this.assignFirstPlayerMove(this.getComputerPlayerMove());
    }

    this.assignSecondPlayerMove(this.getComputerPlayerMove());
  }

  getComputerPlayerMove() {
    const moveTypeKeys = Object.keys(MOVE_TYPE);
    const moveIndex = Math.floor(Math.random() * moveTypeKeys.length);
    const moveKey = moveTypeKeys[moveIndex];

    return MOVE_TYPE[moveKey];
  }

  assignFirstPlayerMove(move) {
    this.state.currentGame.assignMoveToFirstPlayer(move);
    this.setState({ firstPlayerMove: move });
  }
  assignSecondPlayerMove(move) {
    this.state.currentGame.assignMoveToSecondPlayer(move);
    this.setState({ secondPlayerMove: move });
  }

  renderShowResult() {
    this.rootElement.innerHTML = this.getShowResultTemplate();
    this.rootElement.querySelector('[data-play-again]')
      .addEventListener('click', () => this.init());
  }

  getShowResultTemplate() {
    return `
      <section>
        <div>
          <h3>${this.state.firstPlayerName}</h3>
          <div>${this.state.firstPlayerMove}</div>
        </div>
        <div>
          <h3>${this.state.secondPlayerName}</h3>
          <div>${this.state.secondPlayerMove}</div>
        </div>
      </section>
      <section data-result>
        <h3>${this.state.result}</h3>
      </section>
      <section>
        <button data-play-again>Play again</button>
      </section>`;
  }
}
