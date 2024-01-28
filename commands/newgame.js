const config = require('../config.json');
const { Verify } = require('../utils/check');
const { SlashCommandBuilder } = require('discord.js');
const Game = require('../classes/Game');
const inviteEmbed = require('../components/invite/inviteEmbed');
const inviteButtons = require('../components/invite/inviteButtonsRow');

const slashNewGame = {
  data: new SlashCommandBuilder()
    .setName('newgame')
    .setDescription('Begin a new game of Love Letters.'),
  async execute(interaction) {
    const { client, guild, channel } = interaction;
    const address = `${guild}-${channel}`;

    // const ongoingGame = interaction.client.game;

    // TODO Confirm there is not already a game running elsewhere;
    // ephemeral reply to the interaction member to confirm

    const game = new Game(guild, channel);

    // set game to client map
    client.games.set(address, game);

    console.log(`Creating new Game from command`, interaction.id);

    game.join(interaction.member);

    game.origin = interaction.id;
    const newEmbed = inviteEmbed(interaction);
    const row = inviteButtons(interaction);

    await interaction.reply({
      components: [row],
      embeds: [newEmbed],
    });
  }
};

module.exports = slashNewGame;
