const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('resume').setDescription('Reprend la musique en pause'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue?.currentTrack) {
      return interaction.reply({ content: '❌ Aucune musique en cours.', ephemeral: true });
    }

    queue.node.setPaused(false);
    await interaction.reply('▶️ C\'est reparti !');
  },
};
