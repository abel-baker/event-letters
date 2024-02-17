const { ButtonBuilder, ButtonStyle } = require('discord.js');
const button = require('./button');

const cardButton = (card, index = 0, currentPlayer = false) => {
  const buttonLabel = (currentPlayer? ' Play ' : ' ') + card.name.charAt(0).toUpperCase() + card.name.slice(1);
  // const newButton = new ButtonBuilder()
  //   .setCustomId(`playCard/${card.name}/${index}`)
  //   .setLabel(buttonLabel)
  //   .setEmoji(card.props.value_emoji)
  //   .setStyle(ButtonStyle.Primary)
  //   .setDisabled(!currentPlayer);

  const out = button({
    label: buttonLabel,
    id: `playCard/${card.name}/${index}`,
    emoji: card.props.value_emoji,
    style: ButtonStyle.Primary,
    disabled: !currentPlayer
  });

  // return newButton;
  return out;
}

module.exports = cardButton;