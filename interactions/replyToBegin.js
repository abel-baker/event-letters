const wait = require('node:timers/promises').setTimeout;

const replyToBegin = {
  name: 'replyToBegin',
  async execute(interaction) {
    // if (!Verify.GameExists(interaction.client)) {
    //   await interaction.reply({ content: `Doesn't look like there is a game afoot`, ephemeral: true });
    //   return;
    // }

    const { client, guild, channel } = interaction;
    const address = `${guild}-${channel}`;

    /* Verify game has been added to client.games already,
      i.e. this interaction came from a current invitation */
    if (!client.games.has(address)) {
      await interaction.reply({ 
        content: `There was a problem starting a new game: there is no current game ready.  Try /newgame`, 
        ephemeral: true })
      return;
    }

    const game = client.games.get(address);

    // defer reply
    // deactivate the invitation ["This game of Love Letters has begun!"]
    game.invitationMessage.edit({ components: [] });
    
    game.memberLastInteractions.set(interaction.member, interaction);
    console.log(game.memberLastInteractions);
    
    await interaction.deferReply();
    await wait(1_000);
    await interaction.editReply({ content: `:love_letter: Let's begin!` });
    
    // game.beginGame();
    client.emit('gameInitiated', game);
  }
}

module.exports = replyToBegin;