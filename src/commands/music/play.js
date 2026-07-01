const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Joue une musique YouTube (lien ou recherche)')
    .addStringOption((opt) =>
      opt.setName('musique').setDescription('Lien YouTube ou termes de recherche').setRequired(true),
    ),
  async execute(interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) {
      return interaction.reply({
        content: '❌ Tu dois être dans un salon vocal pour utiliser cette commande.',
        ephemeral: true,
      });
    }

    const query = interaction.options.getString('musique', true);
    await interaction.deferReply();

    const player = useMainPlayer();
    const { track } = await player.play(channel, query, {
      nodeOptions: {
        volume: 50,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 60_000,
        leaveOnEnd: true,
        leaveOnEndCooldown: 60_000,
      },
    });

    await interaction.editReply(`✅ **${track.title}** ajouté !`);
  },
};
