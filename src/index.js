require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Events } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// ---- Chargement des commandes ----
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
for (const folder of fs.readdirSync(commandsPath)) {
  const folderPath = path.join(commandsPath, folder);
  for (const file of fs.readdirSync(folderPath).filter((f) => f.endsWith('.js'))) {
    const command = require(path.join(folderPath, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }
}

// ---- Chargement des événements ----
const eventsPath = path.join(__dirname, 'events');
for (const file of fs.readdirSync(eventsPath).filter((f) => f.endsWith('.js'))) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// ---- Lecteur de musique ----
const player = new Player(client);

// Pas de messages automatiques : les erreurs sont uniquement journalisées en console
player.events.on('playerError', (queue, error) => {
  console.error('[Musique] Erreur de lecture :', error.message);
});

player.events.on('error', (queue, error) => {
  console.error('[Musique] Erreur de file :', error.message);
});

async function main() {
  await player.extractors.register(YoutubeiExtractor, {});
  await client.login(process.env.DISCORD_TOKEN);
}

main().catch((err) => {
  console.error('Échec du démarrage :', err);
  process.exit(1);
});
