const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { Card } = require('../classes/Card');
const { Deck } = require('../classes/Deck');
const drawButton = require('../components/drawButton');

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
`Your first card is ${firstCard.props.article} **${firstCard.name}**:

${Card.withEmoji(firstCard)}: ${firstCard.props.rules}`,
        ephemeral: true
      });
    });

    // Announce whose turn it is
    game.channel.sendTyping();
    await wait(2_000);

    const announceTurn = await game.channel.send(`:love_letter: The starting player is ${currentPlayer.member}`);
    game.currentPlay.announceTurn = announceTurn;

  
    await wait(400);
    
    // Now message the players about their cards
    const player = game.currentPlayer();
    const button = drawButton({ customId: 'drawCard/firstRound', disabled: false });

    const drawOffer = await player.lastInteraction.followUp({
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