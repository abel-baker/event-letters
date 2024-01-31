// Validation for the conditions to start a game should have already
// occurred by the time this event is emitted, i.e. in the button interaction
// to start playing (readyToBegin currently)

const onGameInitiated = {
  name: 'gameInitiated',
  execute(game) {
    console.log(`]> gameInitiated event, calling beginGame`);
    // game.channel.send(`:love_letter: Beginning game setup`);
    game.beginGame();
  }
};

module.exports = onGameInitiated;