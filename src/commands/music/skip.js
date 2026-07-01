const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder().setName('skip').setDescription('Passe à la piste suivante'),
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);
    if (!queue?.currentTrack) {
      return interaction.reply({ content: '❌ Aucune musique en cours.', ephemeral: true });
    }

    const skipped = queue.currentTrack.title;
    queue.node.skip();
    await interaction.reply(`⏭️ **${skipped}** passée.`);
  },
};
