const config = require('../config.json');
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

    const game = new Game(client, guild, channel);

    // set game to client map
    client.games.set(address, game);

    console.log(`Creating new Game from command`, interaction.id);

    const player = game.join(interaction);
    // player.setLastInteraction(interaction);
    // game.memberLastInteractions.set(interaction.member, interaction);
    // game.setLastInteraction(interaction, interaction.member);

    game.origin = interaction.id;
    const newEmbed = inviteEmbed(interaction);
    const row = inviteButtons(interaction);

    await interaction.reply({
      components: [row],
      embeds: [newEmbed],
    });

    const reply = await interaction.fetchReply();
    game.invitationMessage = reply;
  }
};

module.exports = slashNewGame;
