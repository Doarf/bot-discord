const { Events, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    client.user.setActivity('/help', { type: ActivityType.Listening });
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
  },
};
