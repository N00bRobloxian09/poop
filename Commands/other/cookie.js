const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cookie")
    .setDescription("Cookie!"),
  execute: async (interaction, client) => {
    return interaction.reply({
      content: '🍪'
    });
  },
};