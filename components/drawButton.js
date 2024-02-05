const { ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

const button = (options) => {
    const out = new ButtonBuilder()
      .setCustomId(options.customId || 'draw')
      .setLabel(options.label || 'Draw card')
      .setStyle(options.style || ButtonStyle.Primary)
      .setDisabled(options.disabled || false);

    if (options.emoji) out.setEmoji(options.emoji);

    return out;
};

module.exports = button;