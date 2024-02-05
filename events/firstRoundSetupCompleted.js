const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
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
      await player.lastInteraction.followUp({
        content: `mega informing you of your card(s): ${player.hand.map(card => card.name).join()}.  Turn index ${game.turnIndex}; you ${player == game.currentPlayer()? 'are' : 'are not'} the current player.`,
        ephemeral: true
      });
    })
    // Array.from(game.memberLastInteractions.values()).forEach(async interaction => {
    //   const player = game.memberIsPlaying(interaction.member);
    //   console.log(`initial player deal message`, player);

    //   await interaction.followUp({
    //     content: `informing you of your card(s): ${Array.from(player.hand).map(card => card.name).join()}.  Turn index ${game.turnIndex}; you ${player == game.currentPlayer()? 'are' : 'are not'} the current player.`,
    //     ephemeral: true
    //   });
    // });

    // Announce whose turn it is
    game.channel.sendTyping();
    await wait(2_000);

    const announceTurn = await game.channel.send(`:love_letter: The starting player is ${currentPlayer.member}`);
    game.currentPlay.announceTurn = announceTurn;

  
    await wait(400);
    
    // Now message the players about their cards
//     Array.from(game.memberLastInteractions.values()).forEach(async interaction => {
//       const player = game.memberIsPlaying(interaction.member);
//       const isCurrentPlayer = currentPlayer.member == interaction.member;

//       if (isCurrentPlayer) {
//         const button = drawButton({ customId: 'drawCard/firstRound', disabled: false });

//         const drawOffer = await interaction.followUp({
//           content: 
// `I dealt you a card: ${player.hand.map(card => card.name).join()}.  It is your turn—\
// draw your next card and play one of them from your hand.`,
//           ephemeral: true,
//           components: [new ActionRowBuilder().addComponents([button])]
//         });

//         game.currentPlay.drawOffer = drawOffer;
        

//         return;
//       }
//     });

    const player = game.currentPlayer();
    const button = drawButton({ customId: 'drawCard/firstRound', disabled: false });

    const drawOffer = await player.lastInteraction.followUp({
      content: 
`I dealt you a card: ${player.hand.map(card => card.name).join()}.  It is your turn—\
draw your next card and play one of them from your hand.`,
      ephemeral: true,
      components: [new ActionRowBuilder().addComponents([button])]
    });

    game.currentPlay.drawOffer = drawOffer;
  }
};

module.exports = onFirstRoundSetupCompleted;