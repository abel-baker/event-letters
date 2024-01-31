const wait = require('node:timers/promises').setTimeout;

onFirstRoundSetupCompleted = {
  name: 'firstRoundSetupCompleted',
  async execute(game) {
    console.log(`]> firstRoundSetupCompleted event`);

    game.channel.sendTyping();
    await wait(1_000);

    game.channel.send(`:love_letter: The starting player is ${game.currentPlayer().member}`);

    await wait(2_000);
    
    // Now message the players about their cards
    // The current player's message should include buttons to draw for their turn
    // game.channel.send(`Informing`)
    Array.from(game.memberLastInteractions.values()).forEach(async interaction => {
      const player = game.memberIsPlaying(interaction.member);
      await interaction.followUp({
        content: `informing you of your card(s): ${player.hand.map(card => card.name).join()}.  Turn index ${game.turnIndex}; you ${game.currentPlayer().member == interaction.member? 'are' : 'are not'} the current player.`,
        ephemeral: true
      });
    });

  }
};

module.exports = onFirstRoundSetupCompleted;