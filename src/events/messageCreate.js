const { Events } = require('discord.js');
const { addXpForMessage } = require('../xp');

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    if (message.author.bot || !message.inGuild()) return;

    // Gain d'XP silencieux : les stats sont consultables via /stats
    addXpForMessage(message.guild.id, message.author.id, message.author.username);
  },
};
