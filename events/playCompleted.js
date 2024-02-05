const { ActionRowBuilder } = require('discord.js');
const { Deck } = require('../classes/Deck');
const drawButton = require('../components/drawButton');

const wait = require('node:timers/promises').setTimeout;

onPlayCompleted = {
  name: 'playCompleted',
  async execute(game) {
    console.log(`]> playCompleted event`);

    const currentPlayer = game.currentPlayer();
    game.currentPlay = {
      player: currentPlayer,
      startingHand: new Deck(currentPlayer.hand),
      hasDrawn: false
    };

    // Announce whose turn it is
    const announceTurn = await game.channel.send(`:love_letter: The next player is ${currentPlayer.member}`);
    game.currentPlay.announceTurn = announceTurn;

    await wait(400);

    // Message the player about their chance to draw
    button = drawButton({ customId: 'drawCard', disabled: false });

    const drawOffer = currentPlayer.lastInteraction.followUp({
      content: `Hey, spooky.  It's your turn, babe`,
      ephemeral: true,
      components: [new ActionRowBuilder().addComponents([button])]
    });

    game.currentPlay.drawOffer = drawOffer;

  }
};

module.exports = onPlayCompleted;