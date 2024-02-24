const { ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const { Cards } = require('../classes/Card');
const button = require('./button');
const config = require('../config.json');

const array = (hand, game, currentPlay) => {
  const out = [];

  // Primary action buttons (card buttons)
  const primaryButtons = [];
  const selectedCard = currentPlay?.selectedCard;

  hand.forEach((card, index) => {
    // label depends on: name, whether the card needs a target, whether the card is selected
    // [#] Play Name( on)(...)
    // i.e. [4] Play Handmaid
    //      [5] Play Prince...
    //      [5] Play Prince on...
    let label = ` Play ${card.name.charAt(0).toUpperCase() + card.name.slice(1)}`;
    if (card.name == selectedCard?.name) label = label + ' on';
    if (card.props.requires_target) label = label + '...';

    // id depends on: what parameters are needed to complete a play action, if there's a 
    //   card selected
    // playCard(/cardName(/targetIndex(/targetCardName)))

    //// Nothing selected
    // [4] Play Handmaid  playCard/handmaid
    // [5] Play Prince...  playCard/prince

    //// Card selected
    // [4] Play Handmaid  playCard/handmaid
    // [5] Play Prince on...  (deselect the selected card OR just repeat playCard/prince)
    //    [ a handsome cat ]  playCard/prince/1  (player index 1)
    //    [ look buddy, ]  playCard/prince/2

    ////// (technically this applies to the next row)
    //// Card & target selected (needed for guard)
    // [1] Play Guard...  playCard/guard

    // [1] Play Guard on...  playCard/guard or reset/deselect
    //    [ a handsome cat ]  playCard/guard/1
    //    [ look buddy, ]  playCard/guard/2

    // [1] Play Guard on...  playCard/guard or reset/deselect
    //    [ a handsome cat ]  playCard/guard/1 (grey, not selected)
    //    [ look buddy, ]  reset/deselect ie playCard/guard (green, selected)
    //       [v| Accuse look buddy, of holding... ]
    //       [v| 8 Princess ]  playCard/guard/1/princess

    // so as far as primary action is concerned, it looks like only the selected status
    // matters for id:
    // - if it's selected, clicking the button again resets/deselects it and just displays
    //   the default set of buttons
    // - if it's not selected, playCard/cardName boom done

    // console.log(game.currentPlay.selectedCard?.name, game.currentPlay.selectedPlayer, game.currentPlay.selectedToken?.name);

    // const id = card.props.requires_target ?
    //   card == selectedCard ? `playCard/${card.name}`
    //     : `updateActionButtons/${card.name}`
    //   : `playCard/${card.name}`;

    // const calcId = () => {
    //   if (card.props.requires_target) {

    //     if (card.name == selectedCard?.name) {
    //       return `selectAction/card`;
    //     } else {
    //       return `selectAction/card/${card.name}`;
    //     }

    //   } else {
    //     return `playCard/${card.name}`;
    //   }
    // }

    const id = `selectAction/card/${index}`;


    // color depends on: princess?, whether card is selected, whether ANOTHER card is selected
    // [8] Play Princess (red always)

    // [1] Play Guard... (blue: nothing selected)
    // [5] Play Prince...

    // [1] Play Guard... (grey: other button selected)
    // [5] Play Prince on... (green: selected)
    //    [ a handsome cat ] [ & look buddy, ] (blue) (blue with handmaid emoji)
    const style = card.name == 'princess' ? ButtonStyle.Danger
    : selectedCard ?
      card == selectedCard ?
        ButtonStyle.Success
        : ButtonStyle.Secondary
      : ButtonStyle.Primary
    ;

    // enabled depends on: countess in the hand, card can/'t be played with countess
    // [7] Play Countess (enabled)
    // [5] Play Prince (disabled)

    // [7] Play Countess (enabled)
    // [3] Play Baron... (enabled)
    const enabled = card.props.plays_nice ? true
    : hand.includes(Cards['COUNTESS']) ? false
      : true
    ;

    console.log(`Making button ${id} ${label}`);

    const newButton = button({
      label, id, style,
      emoji: card.props.value_emoji,
      disabled: !enabled,
    });

    primaryButtons.push(newButton);
  });

  out.push(new ActionRowBuilder().addComponents(primaryButtons));


  // Secondary action buttons (target buttons)
  if (selectedCard && selectedCard.props.requires_target) {
    const secondaryButtons = [];
    const activePlayers = Array.from(game.players).filter(player => !player.eliminated);
    // store active players for retrieval by selectAction and playCard
    game.currentPlay.activePlayers = activePlayers;
    
    activePlayers.forEach((player) => {
      const label = player.displayName;
      // const id = `playCard/${selectedCard.name}/${Array.from(game.players).indexOf(player)}`;
      const id = `selectAction/player/${activePlayers.indexOf(player)}`;

      const emoji = player.handmaided ? Cards['HANDMAID'].props.emoji : null;
      const enabled = player != currentPlay.player;

      console.log(`Making button ${id} ${label}`);

      const playerButton = button({
        label, id, emoji,
        style: ButtonStyle.Primary,
        disabled: !enabled
      });

      secondaryButtons.push(playerButton);
    });

    out.push(new ActionRowBuilder().addComponents(secondaryButtons));
  }


  // Tertiary item select (card select) // Only if guard selected AND player selected
  const selectedPlayer = currentPlay?.selectedPlayer;
  if (selectedPlayer && selectedCard.props.requires_token) {
    const cardSelectList = [];

    for (const card in config.cards) {
      const name = config.cards[card].name;
      const rules = config.cards[card].rules;
      const emoji = config.cards[card].emoji;
      const value_emoji = config.cards[card].value_emoji;

      if (config.cards[card].name == 'guard') {
        console.log(`Skipping guard option`);
        continue;
      };

      console.log(`Adding option ${name} ${rules}`);

      cardSelectList.push(new StringSelectMenuOptionBuilder()
        .setLabel(`${name.charAt(0).toUpperCase() + name.slice(1)}`)
        .setEmoji(`${value_emoji}`)
        .setValue(`${name}`)
        // .setDescription(`${rules}`)
      );
    }

    const cardSelect = new StringSelectMenuBuilder()
      .setCustomId(`selectAction/token`)
      .setPlaceholder(`Accuse ${selectedPlayer.displayName} of holding...`)
      .addOptions(cardSelectList);

    out.push(new ActionRowBuilder().addComponents(cardSelect));
  }


  return out;
};

module.exports = array;