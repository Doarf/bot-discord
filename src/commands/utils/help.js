const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('help').setDescription('Liste des commandes du bot'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle('📖 Commandes disponibles')
      .addFields(
        {
          name: '📊 Niveaux',
          value: '`/stats` — stats d\'un membre (niveau, XP, rang)\n`/leaderboard` — classement du serveur',
        },
        {
          name: '🎵 Musique',
          value: [
            '`/play <recherche ou lien>` — joue une musique YouTube',
            '`/skip` — passe à la piste suivante',
            '`/pause` / `/resume` — met en pause / reprend',
            '`/queue` — affiche la file d\'attente',
            '`/nowplaying` — piste en cours',
            '`/volume <0-100>` — règle le volume',
            '`/stop` — arrête tout et quitte le vocal',
          ].join('\n'),
        },
        { name: '🔧 Utilitaires', value: '`/ping` — latence du bot' },
      );

    await interaction.reply({ embeds: [embed] });
  },
};
