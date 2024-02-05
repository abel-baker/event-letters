const wait = require('node:timers/promises').setTimeout;
const { Cards } = require('../classes/Card');

onPlayCard = {
  name: 'playCard',
  async execute(interaction) {
    const { client, guild, channel, member } = interaction;
    const address = `${guild}-${channel}`;
    const game = client.games.get(address);

    game.currentPlay.playAction = interaction;
    const player = game.currentPlay.player;

    // const options = interaction.customId.split('/').slice(1);
    // interaction.reply(`${interaction.member.displayName} has elected to play ${options[0]}`);

    // Verify some things: that it's the player's turn, that the player has the card
    const [cardName] = interaction.customId.split('/').slice(1);
    const card = Cards[cardName.toUpperCase()];

    // Remove the card from the player's inventory
    const cardPlayed = player.play(card)[0];
    game.currentPlay.cardPlayed = cardPlayed;
    
    // console.log(`card played`, cardPlayed);
    // console.log(`player's hand`, Array.from(player.hand).map(card => card.name));
    

    // Make group announcement of the play
    const announcePlay = await channel.send(`:love_letter: ${member} plays ${cardPlayed.name}`)
    game.currentPlay.announcePlay = announcePlay;

    // Remove play buttons
    await interaction.update({
      components: []
    });

    // Update group's announcement with results of the play
    await wait(400);
    announcePlay.edit(`${announcePlay.content}. This is what happens:`);

    
    await wait(4_000);

    // Advance turnIndex to the next player and emit round setup complete?
    game.advancePlayer();
    client.emit('playCompleted', game); // change this to regular
    
    game.memberLastInteractions.set(member, interaction);
  }
};

module.exports = onPlayCard;