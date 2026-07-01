const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { statements } = require('../../database');

const MEDALS = ['🥇', '🥈', '🥉'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Affiche le classement XP du serveur'),
  async execute(interaction) {
    const rows = statements.topUsers.all(interaction.guild.id, 10);

    if (rows.length === 0) {
      return interaction.reply('Personne n\'a encore gagné d\'XP sur ce serveur.');
    }

    const lines = rows.map((row, i) => {
      const medal = MEDALS[i] ?? `**${i + 1}.**`;
      return `${medal} ${row.username || `<@${row.user_id}>`} — niveau ${row.level} (${row.total_xp} XP)`;
    });

    const embed = new EmbedBuilder()
      .setColor(0xfee75c)
      .setTitle(`🏆 Classement de ${interaction.guild.name}`)
      .setDescription(lines.join('\n'));

    await interaction.reply({ embeds: [embed] });
  },
};
