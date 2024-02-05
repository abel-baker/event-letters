const replyToJoin = require('../interactions/replyToJoin');

const onInteractionCreate = {
  name: 'interactionCreate',
  async execute(interaction) {

    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (err) {
        console.error(err);
        await interaction.reply({ content: `There was an error executing command: ${command}`, ephemeral: true });
      }

      return;
    }

    if (interaction.isButton()) {

      try {
        // Process the button.
        const id = interaction.customId.split('/')[0];
        if (id == 'collector') return;
        
        const action = interaction.client.interactions.get(id);
        await action(interaction);
  
        return;
      } catch (err) {
        console.error(err);
        await interaction.reply({ content: `There was an error executing button press: ${interaction.customId}`, ephemeral: true });
      }

      return;
    }
  }
}

module.exports = onInteractionCreate;
