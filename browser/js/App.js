(function() {
  const { Game, GAME_RESULT, MISSING_MOVE_ERROR, MOVE_TYPE } = document.GAME;

  const GAME_STAGE = {
    START_GAME: 'START_GAME',
    CHOOSE_MOVE: 'CHOOSE_MOVE',
    SHOW_RESULT: 'SHOW_RESULT',
  };
  const GAME_MODE = {
    PLAYER_VS_COMPUTER: 'PLAYER_VS_COMPUTER',
    COMPUTER_VS_COMPUTER: 'COMPUTER_VS_COMPUTER',
  };
  const COMPUTER_PLAYER = 'Computer';
  const HUMAN_PLAYER = 'Player';

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

  function App(rootElement) {
      this.rootElement = rootElement;
      this.startGame = this.startGame.bind(this);
  }

  App.prototype.init = function() {
    this.setState(defaultAppState);
  }

  App.prototype.startGame = function(mode) {
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

  App.prototype.setState = function(state) {
    const newState = {};

    for (const key in state) {
      if (state.hasOwnProperty(key)) {
        newState[key] = state[key];
      }
    }

    this.state = Object.assign({}, this.state, newState);
    this.render();
  }

  App.prototype.render = function() {
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

  App.prototype.renderStartGame = function() {
    this.rootElement.innerHTML = this.getStartGameTemplate();

    this.rootElement.querySelector(`[data-mode="${GAME_MODE.PLAYER_VS_COMPUTER}"]`)
      .addEventListener('click', () => this.startGame(GAME_MODE.PLAYER_VS_COMPUTER));

    this.rootElement.querySelector(`[data-mode="${GAME_MODE.COMPUTER_VS_COMPUTER}"]`)
      .addEventListener('click', () => this.startGame(GAME_MODE.COMPUTER_VS_COMPUTER));
  }

  App.prototype.getStartGameTemplate = function() {
    return `
      <nav class="game-options">
        <h2 class="game-options-header">Start new game</h2>
        <ul class="game-options-list">
          <li class="game-options-list-item">
            <button class="game-options-list-item-button" data-mode="${GAME_MODE.PLAYER_VS_COMPUTER}">Player vs Computer</button>
          </li>
          <li class="game-options-list-item">
            <button class="game-options-list-item-button" data-mode="${GAME_MODE.COMPUTER_VS_COMPUTER}">Computer vs Computer</button>
          </li>
        </ul>
      </nav>`;
  }

  App.prototype.renderChooseMove = function() {
    this.rootElement.innerHTML = this.getChooseMoveTemplate();
    this.rootElement.querySelector('.result-button')
      .addEventListener('click', () => this.showResult());

    if (this.state.mode === GAME_MODE.PLAYER_VS_COMPUTER) {
      Object.keys(MOVE_TYPE)
        .forEach(key => {
          this.rootElement.querySelector(`.players-player__first [data-move="${key}"]`)
            .addEventListener('click', () => this.assignFirstPlayerMove(MOVE_TYPE[key]));
        });
    }
  }

  App.prototype.getChooseMoveTemplate = function() {
    const hiddenMoveTemplate = this.getHiddenMoveTemplate();

    return `
      <section class="players">
        <div class="players-player__first">
          <h3>${this.state.firstPlayerName}</h3>
          ${this.state.mode === GAME_MODE.PLAYER_VS_COMPUTER ? this.getMoveListTemplate() : hiddenMoveTemplate}
        </div>
        <div class="players-player__second">
          <h3>${this.state.secondPlayerName}</h3>
          ${hiddenMoveTemplate}
        </div>
      </section>
      <section class="result">
        <h3 class="result-header">Result</h3>
        <button class="result-button">Get result</button>
      </section>`;
  }

  App.prototype.getHiddenMoveTemplate = function() {
    return '<button disabled class="players-player-move">?</button>';
  };

  App.prototype.getMoveListTemplate = function() {
    return `<div>${Object.keys(MOVE_TYPE)
      .map(key => `<button class="players-player-move ${this.state.firstPlayerMove === MOVE_TYPE[key] ? 'players-player-move__selected' : ''}" data-move="${key}">${key}</button>`)
      .join('')}</div>`;
  };

  App.prototype.showResult = function() {
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
  };

  App.prototype.assignMovesToComputerPlayers = function() {
    if (this.state.mode === GAME_MODE.COMPUTER_VS_COMPUTER) {
      this.assignFirstPlayerMove(this.getComputerPlayerMove());
    }

    this.assignSecondPlayerMove(this.getComputerPlayerMove());
  };

  App.prototype.getComputerPlayerMove = function() {
    const moveTypeKeys = Object.keys(MOVE_TYPE);
    const moveIndex = Math.floor(Math.random() * moveTypeKeys.length);
    const moveKey = moveTypeKeys[moveIndex];

    return MOVE_TYPE[moveKey];
  };

  App.prototype.assignFirstPlayerMove = function(move) {
    this.state.currentGame.assignMoveToFirstPlayer(move);
    this.setState({ firstPlayerMove: move });
  };

  App.prototype.assignSecondPlayerMove = function(move) {
    this.state.currentGame.assignMoveToSecondPlayer(move);
    this.setState({ secondPlayerMove: move });
  };

  App.prototype.renderShowResult = function() {
    this.rootElement.innerHTML = this.getShowResultTemplate();
    this.rootElement.querySelector('.play-again-button')
      .addEventListener('click', () => this.init());
  };

  App.prototype.getShowResultTemplate = function() {
    return `
      <section class="players">
        <div class="players-player__first">
          <h3>${this.state.firstPlayerName}</h3>
          <button disabled class="players-player-move ${this.state.result === GAME_RESULT.FIRST_PLAYER ? 'players-player-move__win' : ''}">${this.state.firstPlayerMove}</div>
        </div>
        <div class="players-player__second">
          <h3>${this.state.secondPlayerName}</h3>
          <button disabled class="players-player-move ${this.state.result === GAME_RESULT.SECOND_PLAYER ? 'players-player-move__win' : ''}">${this.state.secondPlayerMove}</div>
        </div>
      </section>
      <section class="result">
        <h3 class="result-header">Result</h3>
        <button disabled class="result-view">${this.state.result}</button>
      </section>
      <section class="play-again">
        <h3 class="play-again-header">Play again?</h3>
        <button class="play-again-button">Play again</button>
      </section>`;
  };

  const mainElement = document.getElementById('main');
  const app = new App(mainElement);

  app.init();
})();