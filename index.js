require('dotenv').config({ path: '.env' });
const fs = require('node:fs');
const path = require('node:path');
const TOKEN = process.env.TOKEN;
const { Client, Collection, GatewayIntentBits, version } = require('discord.js');

console.log(version);

// Client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Read commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  client.commands.set(command.data.name, command);
}

// Read interactions
client.interactions = new Collection();
const interactionsPath = path.join(__dirname, 'interactions');
const interactionFiles = fs.readdirSync(interactionsPath).filter(file => file.endsWith('.js'));

for (const file of interactionFiles) {
  const interactionPath = path.join(interactionsPath, file);
  const interaction = require(interactionPath);

  client.interactions.set(interaction.name, (...args) => interaction.execute(...args));
}

// Read events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}


// Create Collection to find Games by their guild-channel address
client.games = new Collection();


// Login to Discord with client's token
client.login(TOKEN);
