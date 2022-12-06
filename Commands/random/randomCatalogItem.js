const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const randomUtils = require('../../Utils/randomUtils.js');
const userUtils = require("../../Utils/userUtils.js");
const dateUtils = require("../../Utils/dateUtils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random-item")
    .setDescription("Gets a random catalog item"),
  execute: async (interaction, client) => {
    await interaction.deferReply();
    var resData;
    await randomUtils.randomCatalogItem().then((res) => {
      if (res === undefined || res.length == 0) {
        return interaction.editReply({ content: `Catalog item not found... Please try again...` });
      }
      resData = res;
    });
    const creatorDisplay = await userUtils.getDisplayCreatorName(resData.CreatorID, resData.CreatorType)
    const dateConvert = await dateUtils.atomTimeToDisplayTime(resData.CreatedAt)
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(resData.Name)
          .setURL(`https://polytoria.com/shop/${resData.ID}`)
          .setColor("#ff5454")
          .setThumbnail(resData.Thumbnail)
          .addFields([
            {
              name: `👷 Creator Name 👷`,
              value: creatorDisplay,
              inline: true,
            },
            {
              name: `👕 Type 👕`,
              value: resData.Type,
              inline: true,
            },
            {
              name: `💰 Price 💰`,
              value: '' + resData.Price,
              inline: true,
            },
            {
              name: `💵 Currency 💵`,
              value: resData.Currency,
              inline: true,
            },
            {
              name: `🔥 Created At 🔥`,
              value: dateConvert,
              inline: true,
            },
          ])
      ]
    });
  },
};