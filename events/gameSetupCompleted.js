const onGameSetupCompleted = {
  name: 'gameSetupCompleted',
  execute(game) {
    console.log(`]> gameSetupCompleted event, calling beginRound`);
    // game.channel.send(`:love_letter: Game setup complete.  Let's start the first round :)`);
    game.beginRound(true);
  }
};

module.exports = onGameSetupCompleted;