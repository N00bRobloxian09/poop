const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping!"),
  execute: async (interaction, client) => {
    return await interaction.reply({
      content: 'Pong! 🏓'
    });
  },
};