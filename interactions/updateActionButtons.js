const actionButtonsArray = require('../components/actionButtonsArray');
const { Cards } = require('../classes/Card');

const updateActionButtons = {
  name: 'updateActionButtons',
  async execute(interaction) {
    const { client, guild, channel, member } = interaction;
    const address = `${guild}-${channel}`;
    const game = client.games.get(address);

    const [cardName, playerIndex, tokenName] = interaction.customId.split('/').slice(1);
    const card = Cards[cardName?.toUpperCase()];
    const token = Cards[tokenName?.toUpperCase()]; // card selected as guard target

    game.currentPlay.selectedCard = card;
    game.currentPlay.selectedPlayer = [...game.players][playerIndex];
    game.currentPlay.selectedToken = token;

    await interaction.update({
      components: actionButtonsArray(game.memberIsPlaying(member).hand, game, game.currentPlay)
    });
  }
}

module.exports = updateActionButtons