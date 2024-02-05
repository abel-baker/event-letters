const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const cardButton = require('./cardButton');

const buttonShowHand = new ButtonBuilder()
  .setCustomId('showHand')
  .setLabel('Show hand')
  .setStyle(ButtonStyle.Secondary)

const row = (hand, currentPlayer = false) => {
  const buttons = [];

  hand.forEach((card, index) => {
    const newButton = cardButton(card, index, currentPlayer);

    buttons.push(newButton);
  });
  

  return new ActionRowBuilder()
    .addComponents(buttons);
}

module.exports = row;