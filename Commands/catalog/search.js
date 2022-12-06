const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const catalogUtils = require("../../Utils/catalogUtils.js");
const emojiUtils = require("../../Utils/emojiUtils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("catalog-search")
    .setDescription("Search for catalog items")
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Search query')
        .setRequired(true)),
  execute: async (interaction, client) => {
    await interaction.deferReply();
    const catalog = await catalogUtils.getCatalog(interaction.options.getString("query"))
    if (catalog === undefined || catalog.length == 0) {
      return interaction.editReply({ content: `Didn't find any items matching the search query` });
    }
    let cstring = ""
    let index = 1
    for (const item of catalog) {
      cstring += `\`${index}\` [${item.name}](https://polytoria.com/shop/${item.id}) ${item.is_limited === 1 ? emojiUtils.star : ''}\n`
      index++
    }


    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Search results for " + interaction.options.getString("query"))
          .setDescription(cstring)
          .setColor("#ff5454")
      ]
    });
  },
};