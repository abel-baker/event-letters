const { Verify } = require('../utils/check');

const replyToBegin = {
  name: 'replyToBegin',
  async execute(interaction) {
    if (!Verify.GameExists(interaction.client)) {
      await interaction.reply({ content: `Doesn't look like there is a game afoot`, ephemeral: true });
      return;
    }

    const { client, guild, channel } = interaction;
    const address = `${guild}-${channel}`;
    const game = client.games.get(address);

    game.start();
  }
}

module.exports = replyToBegin;