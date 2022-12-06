const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const userUtils = require("../../Utils/userUtils.js");
const emojiUtils = require("../../Utils/emojiUtils.js");
const stringUtils = require("../../Utils/stringUtils.js");
const dateUtils = require("../../Utils/dateUtils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lookup")
    .setDescription("Look up a user by their username")
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Username')
        .setRequired(true)),
  execute: async (interaction, client) => {
    await interaction.deferReply();
    const user = await userUtils.getUserDataByUsername(interaction.options.getString("username"))
    if (user.Success == false) {
      return interaction.editReply({ content: `User doesn't exist or is terminated` });
    }

    let badges = ' '
    const joinedDate = await dateUtils.atomTimeToDisplayTime(user.JoinedAt)
    const lastOnlineDate = await dateUtils.atomTimeToDisplayTime(user.LastSeenAt)


    if (user.Rank === 'ADMINISTRATOR') {
      badges += emojiUtils.polytoria + ' '
    }

    if (user.MembershipType !== 'NONE') {
      badges += emojiUtils.star + ' '
    }
    const ds = (user.Description == "" ? "No Description set" : user.Description)

    const csr = await stringUtils.capitalizeString(user.Rank)
    const csmt = await stringUtils.capitalizeString(user.MembershipType)

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(user.Username + badges)
          .setURL(`https://polytoria.com/user/${user.ID}`)
          .setDescription(ds)
          .setColor("#ff5454")
          .setThumbnail(`https://polytoria.com/assets/thumbnails/avatars/${user.AvatarHash}.png`)
          .addFields([
            {
              name: `User ID`,
              value: user.ID.toString(),
              inline: true,
            },
            {
              name: `Rank`,
              value: csr,
              inline: true,
            },
            {
              name: `Membership Type`,
              value: csmt,
              inline: true,
            },
            {
              name: `Profile Views`,
              value: user.ProfileViews.toLocaleString(),
              inline: true,
            },
            {
              name: `Item Sales`,
              value: user.ItemSales.toLocaleString(),
              inline: true,
            },
            {
              name: `Forum Posts`,
              value: user.ForumPosts.toLocaleString(),
              inline: true,
            },
            {
              name: `Trade Value`,
              value: user.TradeValue.toLocaleString(),
              inline: true,
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