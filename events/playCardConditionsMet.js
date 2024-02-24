const config = require('../config.json');
const wait = require('node:timers/promises').setTimeout;
const { Cards } = require('../classes/Card');

onPlayCardConditionsMet = {
  name: 'playCardConditionsMet',
  async execute(interaction, play) {
    console.log(`]> playCardConditionsMet`);

    const { client, guild, channel, member } = interaction;
    const address = `${guild}-${channel}`;
    const game = client.games.get(address);

    const player = play.player;
    // const card = Cards[play.selectedCard.toUpperCase()];
    const card = play.selectedCard;
    const target = play.selectedPlayer || null;
    const token = play.selectedToken || null;

    // Remove the card from the player's inventory
    const cardPlayed = player.play(card)[0];
    play.cardPlayed = cardPlayed;

    // Advance to the next player
    const nextMember = game.nextPlayer().member;

    // Play message
    const message = target ?
      `${member.displayName} plays ${card.props.article} ${card.name} on ${target.displayName}`
      : `${member.displayName} plays ${card.props.article} ${card.name}`;


    // Make group announcement of the play
    const embed = {
      color: config.embed_color,

      author: {
        name: message,
        iconURL: member.displayAvatarURL()
      },

      description: `but nothing happens (yet).`,

      footer: {
        text: `${nextMember.displayName} is up next`,
        iconURL: nextMember.displayAvatarURL()
      }
    }

    const announcePlay = await channel.send({
      embeds: [embed]
    });
    play.announcePlay = announcePlay;

    // Remove action buttons from sender
    await interaction.update({
      components: []
    });

    await wait(2_000);

    client.emit('playCompleted', game);

    game.memberLastInteractions.set(member, interaction);
  }
};

module.exports = onPlayCardConditionsMet;