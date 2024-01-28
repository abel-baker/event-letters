const onStartGame = {
  name: 'startGame',
  execute(game) {
    console.log(`] startGame event, calling beginGame`);
    game.beginGame();
  }
};

module.exports = onStartGame;