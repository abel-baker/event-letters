
onPlayCard = {
  name: 'playCard',
  async execute(interaction) {
    const options = interaction.customId.split('/').slice(1);
    interaction.reply(`${interaction.member.displayName} has elected to play ${options[0]}`)
  }
};

module.exports = onPlayCard;