const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const randomUtils = require('../../Utils/randomUtils.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random-banner")
    .setDescription("Gets a random game banner"),
  execute: async (interaction, client) => {
    await interaction.reply({ embeds: [new EmbedBuilder().setTitle("Randomizing, Please wait...").setColor("#ff5454").setImage("https://c.tenor.com/Gcq7KQ6zaQEAAAAC/angry-birds-dice-jumpscare.gif")] });
    var title;
    var imageUrl;
    await randomUtils.randomGameBanner().then((res) => {
      if (res == 0) {
        title = "Randomizer has tried too many times. Please try again."
        imageUrl = "https://c.tenor.com/KOZLvzU0o4kAAAAC/no-results.gif"
      } else {
        title = "Randomized!"
        imageUrl = "https://polytoria.com/assets/thumbnails/games/banners/" + res + ".png"
      }
    })
    return await interaction.editReply({ embeds: [new EmbedBuilder().setTitle(title).setImage(imageUrl).setColor("#ff5454")] });
  },
};