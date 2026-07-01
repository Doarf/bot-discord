const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { statements } = require('../../database');
const { xpForLevel } = require('../../xp');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Affiche les stats (niveau, XP, rang) d\'un membre du serveur')
    .addUserOption((opt) =>
      opt.setName('membre').setDescription('Le membre à consulter').setRequired(false),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('membre') ?? interaction.user;
    const row = statements.getUser.get(interaction.guild.id, user.id);

    if (!row) {
      return interaction.reply(`**${user.username}** n'a pas encore gagné d'XP sur ce serveur.`);
    }

    const { rank } = statements.rankOf.get(interaction.guild.id, row.total_xp);
    const needed = xpForLevel(row.level);
    const progress = Math.round((row.xp / needed) * 20);
    const bar = '█'.repeat(progress) + '░'.repeat(20 - progress);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
      .setTitle(`Rang #${rank}`)
      .addFields(
        { name: 'Niveau', value: `${row.level}`, inline: true },
        { name: 'XP total', value: `${row.total_xp}`, inline: true },
        { name: `Progression (${row.xp}/${needed} XP)`, value: `\`${bar}\`` },
      );

    await interaction.reply({ embeds: [embed] });
  },
};
