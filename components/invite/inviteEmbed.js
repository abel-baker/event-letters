const config = require('../../config.json');
const footer = require('./inviteFooter');

const embed = (interaction) => {
  const { client, guild, channel } = interaction;
  const address = `${guild}-${channel}`;
  const game = client.games.get(address);

  const gameOpenString = `:love_letter: You're invited to play **Love Letters**!  Click the **Join** button to play along.`;
  const gameFullString = `:love_letter: You're invited to play **Love Letters**!  Click the **Join queue** button to play soon.`

  const groupSize = config.rules.min_group_size;
  const groupLimit = config.rules.max_group_size;

  // list displayed in invitation embed
  const memberPlayingList = [];
  for (let i = 0; i < groupLimit; i++) {
    const member = Array.from(game.playerQueue.keys())[i];
    if (member) {
      memberPlayingList.push(`:love_letter: **${member.displayName}**`);
    } else {
      memberPlayingList.push(`:love_letter: *open invitation*`);
    }
  }

  const out = {
    color: config.embed_color,
    thumbnail: { url: interaction.user.displayAvatarURL() },

    author: {
      name: `${interaction.member.displayName} wants to play!`,
      iconURL: interaction.user.displayAvatarURL()
    },

    description: `${gameOpenString}\n\n${memberPlayingList.join('\n')}`,

    footer: footer(game)
  }

  return out;
}

module.exports = embed;