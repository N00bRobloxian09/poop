const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const userUtils = require('../../Utils/userUtils.js');
const randomUtils = require('../../Utils/randomUtils.js');
const dateUtils = require("../../Utils/dateUtils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random-guild")
    .setDescription("Gets a random guild"),
  execute: async (interaction, client) => {
    await interaction.deferReply();
    var resData;
    await randomUtils.randomGuild().then((res) => {
      if (res === undefined || res.length == 0) {
        return interaction.editReply({ content: `Guild not found... Please try again...` });
      }
      resData = res;
    });
    const creatorDisplay = await userUtils.getDisplayCreatorName(resData.CreatorID, "User")
    const creationDate = await dateUtils.atomTimeToDisplayTime(resData.CreatedAt)
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(resData.Name)
          .setURL(`https://polytoria.com/guilds/${resData.ID}`)
          .setDescription(resData.Description == "" ? "No description" : resData.Description)
          .setColor("#ff5454")
          .setThumbnail(resData.Thumbnail)
          .addFields([
            {
              name: `🗂 Creator ID 🗂`,
              value: '' + resData.ID,
              inline: true,
            },
            {
              name: '👷 Creator Name 👷',
              value: creatorDisplay,
              inline: true
            },
            {
              name: '🎉Members🎉',
              value: '' + resData.Members.toLocaleString(),
              inline: true
            },
            {
              name: '✅ Is Verified ✅',
              value: '' + resData.IsVerified.toLocaleString(),
              inline: true
            },
            {
              name: '🔥 Created At 🔥',
              value: creationDate,
              inline: true
            },
          ])
      ]
    });
  },
};