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
    await wait(1_000);
    // Array.from(game.players).forEach(async player => {
    //   await player.lastInteraction.followUp({
    //     content: `mega informing you of your card(s): ${player.hand.map(card => card.name).join()}.  Turn index ${game.turnIndex}; you ${player == game.currentPlayer()? 'are' : 'are not'} the current player.`,
    //     ephemeral: true
    //   });
    // })
    Array.from(game.memberLastInteractions.values()).forEach(async interaction => {
      const player = game.memberIsPlaying(interaction.member);
      await interaction.followUp({
        content: `informing you of your card(s): ${player.hand.map(card => card.name).join()}.  Turn index ${game.turnIndex}; you ${player == game.currentPlayer()? 'are' : 'are not'} the current player.`,
        ephemeral: true
      });
    });

    // Announce whose turn it is
    game.channel.sendTyping();
    await wait(2_000);

    const announceTurn = await game.channel.send(`:love_letter: The starting player is ${currentPlayer.member}`);
    game.currentPlay.announceTurn = announceTurn;


    await wait(2_000);
    
    // Now message the players about their cards
    // The current player's message should include buttons to draw for their turn
    // game.channel.send(`Informing`)
    Array.from(game.memberLastInteractions.values()).forEach(async interaction => {
      const player = game.memberIsPlaying(interaction.member);
      const isCurrentPlayer = currentPlayer.member == interaction.member;

      if (isCurrentPlayer) {
        const button = drawButton({ customId: 'await/firstRoundDraw' });
        //  = new ButtonBuilder()
        //   .setCustomId(`await/firstRoundDraw`)
        //   .setLabel(`Draw card`)
        //   .setStyle(ButtonStyle.Primary);

        const drawOffer = await interaction.followUp({
          content: 
`I dealt you a card: ${player.hand.map(card => card.name).join()}.  It is your turn—\
draw your next card and play one of them from your hand.`,
          ephemeral: true,
          components: [new ActionRowBuilder().addComponents([button])]
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
          const drawConfirmation = await drawOffer.awaitMessageComponent({
            filter: collectorFilter,
            time: 40_000
          });

          if (drawConfirmation.customId === 'await/firstRoundDraw') {
            game.currentPlay.drawInteraction = drawConfirmation;
            await drawConfirmation.update({ components: [] });
            await announceTurn.edit(`${announceTurn.content}.  ${currentPlayer.member} draws a card`);
            /* We did it
             - update the general message to say the player drew a card 
             - draw the card into the player's hand
             - give them their turn message with play buttons */
          }
        } catch (e) {
          await confirmation.reply({ content: `Confirmation not received`, components: [] });
        }

        return;
      }

      await interaction.followUp({
        content: `informing you of your card(s): ${player.hand.map(card => card.name).join()}.  Turn index ${game.turnIndex}; you ${game.currentPlayer().member == interaction.member? 'are' : 'are not'} the current player.`,
        ephemeral: true
      });
    });

  }
};

module.exports = onFirstRoundSetupCompleted;