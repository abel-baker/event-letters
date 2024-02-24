const actionButtonsArray = require('../components/actionButtonsArray');
const { Cards } = require('../classes/Card');

const selectAction = {
  name: 'selectAction',
  async execute(interaction) {
    const { client, guild, channel, member } = interaction;
    const address = `${guild}-${channel}`;
    const game = client.games.get(address);

    const player = game.currentPlay.player;

    const [action, index] = interaction.customId.split('/').slice(1);
    console.log(`customId: ${interaction.customId}, values: ${interaction.values}`)

    // if action == reset, undo, not present... just redo the action array
    if (!action || action == 'reset') {

      await selectAndUpdate(
        interaction,
        player.hand, game, game.currentPlay,
        { card: null, player: null }
      );

      return;
    }

    // if card, 
    // 1) play cards that don't need a target
    // 2) play cards that need a target but we're in a head-to-head
    // 3) select cards that do need a target but don't have one
    if (action == 'card') {
      console.log(`action: ${action}, index: ${index}`);
      const card = player.hand[index];
      console.log(`card: ${card.name}`);

      game.currentPlay.selectedCard = card;

      if (!card.props.requires_target) {
        // send play event
        client.emit('playCardConditionsMet', interaction, game.currentPlay);

        return;
      }

      // // if card requires target & there is only one eligible target
      // if (card.props.requires_target && NUM_ELIGIBLE_TARGETS == 1) {
        // // send play event
        // client.emit('playCardConditionsMet', interaction, game.currentPlay);

        // return;
      // }

      if (card.props.requires_target) {
        await selectAndUpdate(
          interaction,
          player.hand, game, game.currentPlay,
          { card, player: null }
        );

        return;
      }
    }

    // if player,
    // 1) play cards that don't need a token (guard's target card)
    // 2) select cards & targets that do need a token but don't have one
    if (action == 'player') {
      console.log(`action: ${action}, index: ${index}`);
      const activePlayers = game.currentPlay.activePlayers;
      const card = game.currentPlay.selectedCard;
      const target = activePlayers[index];
      console.log(`target`, player.displayName);

      game.currentPlay.selectedPlayer = target;

      if (!card.props.requires_token) {
        client.emit('playCardConditionsMet', interaction, game.currentPlay);

        return;
      }

      if (card.props.requires_token) {
        await selectAndUpdate(
          interaction,
          player.hand, game, game.currentPlay,
          { card, player }
        );

        return;
      }
    }

    if (action == 'token') {
      const card = game.currentPlay.selectedCard;
      const target = game.currentPlay.selectedPlayer;
      const token = interaction.values[0];
      console.log(`target`, player => player.displayName);
      console.log(`token`, player => player.displayName);

      game.currentPlay.selectedToken = token;

      client.emit('playCardConditionsMet', interaction, game.currentPlay);

      return;
    }

  }
}

const selectAndUpdate = async (interaction, hand, game, currentPlay, selections) => {
  
  game.currentPlay.selectedCard = selections.card || null;
  game.currentPlay.selectedPlayer = selections.player || null;
  game.currentPlay.selectedToken = null;

  await interaction.update({
    components: actionButtonsArray(hand, game, currentPlay)
  });

  return;
} 

module.exports = selectAction;