const { ActionRowBuilder } = require('discord.js');
const { Deck } = require('../classes/Deck');
const drawButton = require('../components/drawButton');

const wait = require('node:timers/promises').setTimeout;

onPlayCompleted = {
  name: 'playCompleted',
  async execute(game) {
    console.log(`]> playCompleted event`);
    
    // Advance turnIndex to the next player and emit round setup complete?
    game.advancePlayer();

    const currentPlayer = game.currentPlayer();
    game.currentPlay = {
      player: currentPlayer,
      startingHand: new Deck(currentPlayer.hand),
      hasDrawn: false
    };

    // Announce whose turn it is
    // const announceTurn = await game.channel.send(`:love_letter: The next player is ${currentPlayer.member}`);
    // game.currentPlay.announceTurn = announceTurn;

    await wait(400);

    // Message the player about their chance to draw
    button = drawButton({ customId: 'drawCard', disabled: false });
    const card = currentPlayer.hand[0];

    const drawOffer = currentPlayer.lastInteraction.followUp({
      content: `It's your turn now.  Draw your next card and play one from your hand.  \
You are currently holding ${card.props.article} **${card.name}**.`,
      ephemeral: true,
      components: [new ActionRowBuilder().addComponents([button])]
    });

    game.currentPlay.drawOffer = drawOffer;

  }
};

module.exports = onPlayCompleted;