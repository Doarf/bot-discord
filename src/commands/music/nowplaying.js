const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Affiche la piste en cours de lecture'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue?.currentTrack) {
      return interaction.reply({ content: '❌ Aucune musique en cours.', flags: MessageFlags.Ephemeral });
    }

    const track = queue.currentTrack;
    const embed = new EmbedBuilder()
      .setColor(0x57f287)
      .setTitle('🎶 En cours de lecture')
      .setDescription(`**${track.title}**\npar ${track.author}`)
      .setThumbnail(track.thumbnail)
      .addFields({ name: 'Progression', value: queue.node.createProgressBar() ?? track.duration });

    await interaction.reply({ embeds: [embed] });
  },
};
