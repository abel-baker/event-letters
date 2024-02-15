const wait = require('node:timers/promises').setTimeout;
const prettyJoin = require('../utils/prettyJoin');

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

    // deactivate the invitation ["This game of Love Letters has begun!"]
    game.invitationMessage.edit({ components: [] });
    
    game.memberLastInteractions.set(interaction.member, interaction);
    
    await interaction.reply({
       content: 
`:love_letter: Let's play a game of **Love Letters**!
       
I will deal one card to each player.  On your turn, draw another card \
and then play one of the two you are holding.  The goal is to hold the \
highest value card at the end of the round, or to be the only one left \
playing after everyone else is eliminated!

I'll set one card aside face-down for the round.  This card usually \
won't be used.  In a two-player game, three more cards are laid \
face-up to shorten the round.`
    });
    
    // game.beginGame();
    client.emit('gameInitiated', game);
  }
}

module.exports = replyToBegin;