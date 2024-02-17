const { ButtonBuilder, ButtonStyle } = require('discord.js');

const button = (options) => {

  const out = new ButtonBuilder()
    .setCustomId(options.id)
    .setLabel(options.label)
  ;

  out.setStyle(options.style || ButtonStyle.Secondary);

  if (options.emoji) out.setEmoji(options.emoji);
  if (options.disabled) out.setDisabled(true);

  return out;
}

module.exports = button;