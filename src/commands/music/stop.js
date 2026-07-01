const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Arrête la musique et quitte le salon vocal'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue) {
      return interaction.reply({ content: '❌ Aucune musique en cours.', ephemeral: true });
    }

    queue.delete();
    await interaction.reply('⏹️ Musique arrêtée, à bientôt !');
  },
};
