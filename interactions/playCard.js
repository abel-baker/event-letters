const wait = require('node:timers/promises').setTimeout;
const { Cards } = require('../classes/Card');
const config = require('../config.json');

onPlayCard = {
  name: 'playCard',
  async execute(interaction) {
    const { client, guild, channel, member } = interaction;
    const address = `${guild}-${channel}`;
    const game = client.games.get(address);

    game.currentPlay.playAction = interaction;
    const player = game.currentPlay.player;

    // const options = interaction.customId.split('/').slice(1);
    // interaction.reply(`${interaction.member.displayName} has elected to play ${options[0]}`);

    // Verify some things: that it's the player's turn, that the player has the card
    const [cardName] = interaction.customId.split('/').slice(1);
    const card = Cards[cardName.toUpperCase()];

    // Remove the card from the player's inventory
    const cardPlayed = player.play(card)[0];
    game.currentPlay.cardPlayed = cardPlayed;
    
    // console.log(`card played`, cardPlayed);
    // console.log(`player's hand`, Array.from(player.hand).map(card => card.name));
    
    const nextMember = game.nextPlayer().member;

    // Make group announcement of the play
    const embed = {
      color: config.embed_color,

      author: {
        name: `${member.displayName} plays ${cardPlayed.props.article} ${cardPlayed.name}...`,
        iconURL: interaction.member.displayAvatarURL()
      },

      description: `but nothing happens (yet).`,

      footer: {
        text: `${nextMember.displayName} is up next`,
        iconURL:  nextMember.displayAvatarURL()
      }
    }
    const announcePlay = await channel.send({
      embeds: [embed]
    });
    game.currentPlay.announcePlay = announcePlay;

    // Remove play buttons
    await interaction.update({
      components: []
    });
    
    await wait(2_000);

    client.emit('playCompleted', game); // change this to regular // <-- what did that mean?
    
    game.memberLastInteractions.set(member, interaction);
  }
};

module.exports = onPlayCard;