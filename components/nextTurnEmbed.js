const config = require('../config.json');

const embed = (interaction) => {
  const { client, guild, channel } = interaction;
  const address = `${guild}-${channel}`;
  const game = client.games.get(address);
  
  const [currentMember, currentPlayer] = game.currentPlayer();
  const nextMember = game.nextPlayer();

  const out = {
    color: config.embed_color,
    thumbnail: { url: currentMember.displayAvatarURL() },

    author: {
      name: `${currentMember.nickname}'s turn`,
      iconURL: config.bot_avatar_url
    },

    description: `${currentMember}, draw a card and play one from your hand.`,

    footer: {
      icon_url: nextMember.user.displayAvatarURL(),
      text: `Next up: ${nextMember.nickname}`
    }
  }

  return out;
}

module.exports = embed;