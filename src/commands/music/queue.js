const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('queue').setDescription('Affiche la file d\'attente'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue?.currentTrack) {
      return interaction.reply({ content: '❌ Aucune musique en cours.', ephemeral: true });
    }

    const tracks = queue.tracks.toArray();
    const upNext = tracks
      .slice(0, 10)
      .map((t, i) => `**${i + 1}.** ${t.title} (\`${t.duration}\`)`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setColor(0xeb459e)
      .setTitle('🎵 File d\'attente')
      .setDescription(
        `**En cours :** ${queue.currentTrack.title}\n\n` +
          (upNext || '*Rien d\'autre en attente.*') +
          (tracks.length > 10 ? `\n… et ${tracks.length - 10} autre(s) piste(s)` : ''),
      );

    await interaction.reply({ embeds: [embed] });
  },
};
