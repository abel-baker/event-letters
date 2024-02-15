const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { Card } = require('../classes/Card');
const { Deck } = require('../classes/Deck');
const drawButton = require('../components/drawButton');
const config = require('../config.json');

const wait = require('node:timers/promises').setTimeout;

onFirstRoundSetupCompleted = {
  name: 'firstRoundSetupCompleted',
  async execute(game) {
    console.log(`]> firstRoundSetupCompleted event`);

    const currentPlayer = game.currentPlayer();
    game.currentPlay = { 
      player: currentPlayer,
      startingHand: new Deck(currentPlayer.hand),
      hasDrawn: false
    };

    // Deal cards, send ephemeral results to each player
    await wait(400);
    Array.from(game.players).forEach(async player => {
      const firstCard = player.hand[0];
      await player.lastInteraction.followUp({
        content: 
`Your first card is ${firstCard.props.article} ${Card.withEmoji(firstCard)}:

${Card.withEmoji(firstCard)}: ${firstCard.props.rules}`,
        ephemeral: true
      });
    });

    // Announce whose turn it is
    game.channel.sendTyping();
    await wait(2_000);

    const faceDownCard = `:blue_square::blue_circle: **??**`;
    const faceDownField = { name: `One card set aside face-down:`,
      value: faceDownCard };

    const faceUpCards = Array.from(game.faceup).map(card => `${Card.withEmoji(card)}`);
    const faceUpField = { name: `Three cards face-up:`,
      value: faceUpCards.join('\n') };

    const fields = [faceDownField];
    if (game.players.size === 2) fields.push(faceUpField);

    // fields.push({ name: `\u200b`, value: `\u200b` });

    const embed = {
      color: config.embed_color,

      fields,

      footer: {
        text: `${currentPlayer.displayName} is the starting player`,
        iconURL: currentPlayer.member.displayAvatarURL()
      }
    };

    
    const announceTurn = await game.channel.send({
      embeds: [embed]
    });
    game.currentPlay.announceTurn = announceTurn;
  
    await wait(400);
    
    // Now message the players about their cards
    const button = drawButton({ customId: 'drawCard/firstRound', disabled: false });

    const drawOffer = await currentPlayer.lastInteraction.followUp({
      content: 
`It's your turn! \
Draw your next card and play one from your hand.`,
      ephemeral: true,
      components: [new ActionRowBuilder().addComponents([button])]
    });

    game.currentPlay.drawOffer = drawOffer;
  }
};

module.exports = onFirstRoundSetupCompleted;