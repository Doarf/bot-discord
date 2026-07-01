const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('pause').setDescription('Met la musique en pause'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue?.currentTrack) {
      return interaction.reply({ content: '❌ Aucune musique en cours.', ephemeral: true });
    }

    queue.node.setPaused(true);
    await interaction.reply('⏸️ Musique en pause. Utilise `/resume` pour reprendre.');
  },
};
