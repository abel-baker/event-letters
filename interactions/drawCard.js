const { Card } = require('../classes/Card');
const config = require('../config.json');
const actionButtonsArray = require('../components/actionButtonsArray');

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
    // const announceTurn = game.currentPlay.announceTurn;
    // announceTurn.edit(`${announceTurn.content}.  ${player.displayName} draws a card.`);


    game.currentPlay.announceDraw = await game.channel.send({
      // content: `:love_letter: ${player.displayName}`,
      embeds: [
        {
          color: config.embed_color_draw,
          // thumbnail: { url: member.displayAvatarURL() },

          // description: `${player.displayName} draws a card.`,
          footer: {
            icon_url: member.displayAvatarURL(),
            text: `${player.displayName} draws a card.`
          }
        }
      ]
    });

    
    // Remove draw button
    await interaction.update({
      components: []
    });

    // const userSelect = new UserSelectMenuBuilder()
    //   .setCustomId('users')
    //   .setPlaceholder('Select a target player...');
    // const userSelectRow = new ActionRowBuilder().addComponents(userSelect);

    // Show draw result to the player and include play buttons
    const cardRulesList = Array.from(player.hand).map(card => {
      return `${Card.withEmoji(card)}: ${card.props.rules}`
    }).join('\n');

    const actionButtons = actionButtonsArray(player.hand, game, game.currentPlay);
    
    console.log(game.currentPlay.selectedCard, game.currentPlay.selectedPlayer, game.currentPlay.selectedToken);

    await interaction.followUp({
      content:
`You draw ${cardDrawn.props.article} **${cardDrawn.name}**.  \
You are now holding these cards:

${cardRulesList}`,

      ephemeral: true,
      // components: [playButtonsRow(player.hand, true)] // [ , userSelectRow]
      components: actionButtons
    });

    game.memberLastInteractions.set(member, interaction);

  }
};

module.exports = onDrawCard;