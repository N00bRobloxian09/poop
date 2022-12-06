const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const randomUtils = require('../../Utils/randomUtils.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("404-catalog")
    .setDescription("Searches for a deleted item in the catalog."),
  execute: async (interaction, client) => {
    await interaction.reply({ embeds: [new EmbedBuilder().setTitle("Randomizing, Please wait...").setColor("#ff5454").setImage("https://c.tenor.com/Gcq7KQ6zaQEAAAAC/angry-birds-dice-jumpscare.gif")] });
    var title;
    var imageUrl;
    await randomUtils.randomDeletedItem().then((res) => {
      if (res == 0) {
        title = "Randomizer has tried too many times. Please try again."
        imageUrl = "https://c.tenor.com/KOZLvzU0o4kAAAAC/no-results.gif"
      } else {
        title = "Randomized!"
        imageUrl = "https://polytoria.com/assets/thumbnails/catalog/" + res + ".png"
      }
    })
    return await interaction.editReply({ embeds: [new EmbedBuilder().setTitle(title).setImage(imageUrl).setColor("#ff5454")] });
  },
};