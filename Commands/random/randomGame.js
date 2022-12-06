const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const userUtils = require('../../Utils/userUtils.js');
const randomUtils = require('../../Utils/randomUtils.js');
const dateUtils = require("../../Utils/dateUtils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random-game")
    .setDescription("Gets a random game"),
  execute: async (interaction, client) => {
    await interaction.deferReply();
    var resData;
    await randomUtils.randomGame().then((res) => {
      if (res === undefined || res.length == 0) {
        return interaction.editReply({ content: `Game not found... Please try again...` });
      }
      resData = res;
    });
    const creatorData = await userUtils.getUserData(resData.CreatorID)
    var creatorUsername;
    var creatorAvatar;
    if (creatorData.Success === false) {
      creatorUsername = "Deleted User " + resData.CreatorID
      creatorAvatar = "31fcfb72c8817425cabd389a9ad217e6"
    } else {
      creatorUsername = creatorData.Username
      creatorAvatar = creatorData.AvatarHash
    }
    const createdate = await dateUtils.atomTimeToDisplayTime(resData.CreatedAt)
    const updatedate = await dateUtils.atomTimeToDisplayTime(resData.UpdatedAt)
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(resData.Name)
          .setURL(`https://polytoria.com/games/${resData.ID}`)
          .setDescription(resData.Description == "" ? "No description" : resData.Description)
          .setColor("#ff5454")
          .setImage(`https://polytoria.com/assets/thumbnails/games/${resData.ID}.png`)
          .setThumbnail(`https://polytoria.com/assets/thumbnails/avatars/${creatorAvatar}.png`)
          .addFields([
            {
              name: `🗂 Creator ID 🗂`,
              value: '' + resData.CreatorID,
              inline: true,
            },
            {
              name: '👷 Creator Name 👷',
              value: creatorUsername,
              inline: true
            },
            {
              name: '🎉 Visits 🎉',
              value: resData.Visits.toLocaleString(),
              inline: true
            },
            {
              name: '🔼Likes🔼',
              value: resData.Likes.toLocaleString(),
              inline: true
            },
            {
              name: '🔽Dislikes🔽',
              value: resData.Dislikes.toLocaleString(),
              inline: true
            },
            {
              name: '🔥 Created At 🔥',
              value: createdate,
              inline: true
            },
            {
              name: '📦 Updated At 📦',
              value: updatedate,
              inline: true
            },
            {
              name: '🟢 Is Active 🟢',
              value: resData.IsActive.toLocaleString(),
              inline: true
            },
          ])
      ]
    });
  },
};