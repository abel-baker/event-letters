const wait = require('node:timers/promises').setTimeout;
const { Card } = require('../classes/Card');
const playButtonsRow = require('../components/playButtons');


onDrawCard = {
  name: 'drawCard',
  async execute(interaction) {
    const { client, guild, channel, member } = interaction;
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
    
    // Remove draw button
    await interaction.update({
      components: []
    });

    // Show draw result to the player and include play buttons
    const cardRulesList = Array.from(player.hand).map(card => {
      return `${Card.withEmoji(card)}: ${card.props.rules}`
    }).join('\n');
    await interaction.followUp({
      content:
`You draw ${cardDrawn.props.article} **${cardDrawn.name}**.  \
You are now holding these cards:

${cardRulesList}`,
      ephemeral: true,
      components: [playButtonsRow(player.hand, true)]
    });

    game.memberLastInteractions.set(member, interaction);

  }
};

module.exports = onDrawCard;