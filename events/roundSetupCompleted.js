onRoundSetupCompleted = {
  name: 'roundSetupCompleted',
  async execute(game) {
    console.log(`]> roundSetupCompleted event`);
    // console.log(`hands`, Array.from(game.players).map(player => player.hand));
    // console.log(`aside`, game.aside);
    // console.log(`faceup`, game.faceup);
    game.channel.send(`:love_letter: First round setup complete.  One card dealt to each player; one card set aside facedown; three cards set aside faceup in two-player games.`);

    // Now message the players about their cards
    // The current player's message should include buttons to draw for their turn
    // game.channel.send(`Informing`)
    Array.from(game.memberLastInteractions.values()).forEach(async interaction => {
      const player = game.memberIsPlaying(interaction.member);
      await interaction.followUp({
        content: `informing you of your card(s): ${player.hand.map(card => card.name).join()}.  Turn index ${game.turnIndex}; you ${game.currentPlayer().member == interaction.member? 'are' : 'are not'} the current player.`,
        ephemeral: true
      })
    });



  }
};

module.exports = onRoundSetupCompleted;