const inviteEmbed = require('../components/inviteEmbed');
const inviteButtons = require('../components/inviteButtons');

const replyToJoin = {
  name: 'replyToJoin',
  async execute(interaction) {
    const game = interaction.client.game;
    const success = game?.join(interaction.member);

    if (success) {
      const newEmbed = inviteEmbed(interaction);
      const newButtons = inviteButtons(game);
      
      await interaction.channel.send({ content: `:love_letter: **${interaction.member.displayName}** accepted the invite!` });
      await interaction.update({ embeds: [newEmbed], components: [newButtons] });
    } else {
      await interaction.reply({ content: `Unable to join; is there a game and are you already playing it?`, ephemeral: true });
    }
  }
}

module.exports = replyToJoin;