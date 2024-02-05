const wait = require('node:timers/promises').setTimeout;

onDrawCard = {
  name: 'drawCard',
  async execute(interaction) {
    const { client, guild, channel } = interaction;
    const address = `${guild}-${channel}`;
    const game = client.games.get(address);

    game.currentPlay.drawAction = interaction;
    const player = game.currentPlay.player;

    // Draw a card into the player's hand
    const cardDrawn = game.deal(player)[0];
    game.currentPlay.drawResult = { card: cardDrawn };
    
    // Update group's announcement of starting player
    const announceTurn = game.currentPlay.announceTurn;
    announceTurn.edit(`${announceTurn.content}.  ${player.displayName} draws a card.`);

    // Update player's ephemeral draw offer (maybe: remove the message \
    // and give them a new one)
    
    await interaction.update({
      components: []
    });

    await interaction.followUp({
      content: 
`You draw a card. Your hand now has these cards: \
${player.hand.map(card => card.name).join()}.  Go ahead and play one.`,
      ephemeral: true
    });

    console.log(`what happened this turn: ${player.displayName} drew a card--${cardDrawn.name}`);

  }
};

module.exports = onDrawCard;