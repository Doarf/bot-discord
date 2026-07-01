const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Règle le volume de la musique')
    .addIntegerOption((opt) =>
      opt
        .setName('niveau')
        .setDescription('Volume entre 0 et 100')
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(true),
    ),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue?.currentTrack) {
      return interaction.reply({ content: '❌ Aucune musique en cours.', ephemeral: true });
    }

    const volume = interaction.options.getInteger('niveau', true);
    queue.node.setVolume(volume);
    await interaction.reply(`🔊 Volume réglé sur **${volume}%**.`);
  },
};
