const config = require('../config.json');
const prettyJoin = require('../utils/prettyJoin');

const embed = (interaction) => {
  const { client, guild, channel } = interaction;
  const address = `${guild}-${channel}`;
  const game = client.games.get(address);

  const startingPlayer = game.currentPlayer();
  const nextPlayer = game.nextPlayer();
  
  const playing = prettyJoin(game.playing().map(player => `**${player.displayName}**`));

  const out = {
    color: config.embed_color,
    thumbnail: { url: interaction.user.displayAvatarURL() },

    author: {
      name: `The game of love is afoot!`,
      iconURL: config.bot_avatar_url
    },


    // title: `You're invited! :love_letter:`,
    description: `Players ${playing} have been dealt 1 card each.  The starting player will be ${startingPlayer.displayName}.
    
    Let the game of :love_letter: **Love Letters** begin!`,

    footer: {
      icon_url: startingPlayer.member.user.displayAvatarURL(),
      text: `Next up: ${nextPlayer.nickname}`
    }
  }

  return out;
}

module.exports = embed;
