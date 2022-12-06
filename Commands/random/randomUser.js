const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const randomUtils = require('../../Utils/randomUtils.js');
const dateUtils = require("../../Utils/dateUtils.js");
const stringUtils = require("../../Utils/stringUtils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random-user")
    .setDescription("Gets a random user"),
  execute: async (interaction, client) => {
    await interaction.deferReply();
    var resData;
    await randomUtils.randomUser().then((res) => {
      if (res === undefined || res.length == 0) {
        return interaction.editReply({ content: `User not found... Please try again...` });
      }
      resData = res;
    });
    const joinedDate = await dateUtils.atomTimeToDisplayTime(resData.JoinedAt)
    const lastOnlineDate = await dateUtils.atomTimeToDisplayTime(resData.LastSeenAt)
    const capitalizeRank = await stringUtils.capitalizeString(resData.Rank)
    const capitalizeMembership = await stringUtils.capitalizeString(resData.MembershipType)
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(resData.Username)
          .setURL(`https://polytoria.com/user/${resData.ID}`)
          .setDescription(resData.Description == "" ? "No Description" : resData.Description)
          .setColor("#ff5454")
          .setThumbnail(`https://polytoria.com/assets/thumbnails/avatars/${resData.AvatarHash}.png`)
          .addFields([
            {
              name: `User ID`,
              value: '' + resData.ID,
              inline: true,
            },
            {
              name: 'Rank',
              value: capitalizeRank,
              inline: true
            },
            {
              name: 'Membership Type',
              value: capitalizeMembership,
              inline: true
            },
            {
              name: 'Profile Views',
              value: resData.ProfileViews.toLocaleString(),
              inline: true
            },
            {
              name: 'Item Sales',
              value: resData.ItemSales.toLocaleString(),
              inline: true
            },
            {
              name: 'Forum Posts',
              value: resData.ForumPosts.toLocaleString(),
              inline: true
            },
            {
              name: 'Trade value',
              value: resData.TradeValue.toLocaleString(),
              inline: true
            },
            {
              name: 'Joined At',
              value: joinedDate,
              inline: true
            },
            {
              name: 'Last seen at',
              value: lastOnlineDate,
              inline: true
            }
          ])
      ]
    });
  },
};