const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const userUtils = require("../../Utils/userUtils.js");
const emojiUtils = require("../../Utils/emojiUtils.js");
const progressBar = require('string-progressbar')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Get user's level")
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

    const levelData = await userUtils.getLevel(user.ID)
    let finall = levelData.final
    let progress = progressBar.splitBar(75, finall, 8, '▬', '🟢')[0]

    let description = `⭐${user.Username}'s Level is **${levelData.final} (${levelData.rank})** 🎉`
    description += `\n\n${emojiUtils.forum} Forum level is ${levelData.levels.forum}`
    description += `\n${emojiUtils.shop} Economy level is ${levelData.levels.economy}`
    description += `\n${emojiUtils.users} Fame level is ${levelData.levels.fame}`
    description += `\n\nNoob 🤓${progress} Pro 😎`



    if (user.Rank === 'ADMINISTRATOR') {
      badges += emojiUtils.polytoria + ' '
    }

    if (user.MembershipType !== 'NONE') {
      badges += emojiUtils.star + ' '
    }

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(user.Username + "'s Level")
          .setURL(`https://polytoria.com/user/${user.ID}`)
          .setDescription(description)
          .setColor("#ff5454")
          .setThumbnail(`https://polytoria.com/assets/thumbnails/avatars/${user.AvatarHash}.png`)
          .addFields([
            {
              name: `Forum Posts`,
              value: user.ForumPosts.toLocaleString(),
              inline: true,
            },
            {
              name: `Friend Count`,
              value: '~' + levelData.external.friendCountRounded.toLocaleString(),
              inline: true,
            },
            {
              name: `Account Age (Month)`,
              value: levelData.external.accountAgeMonth.toLocaleString(),
              inline: true,
            },
            {
              name: `Trade Value`,
              value: user.TradeValue.toLocaleString(),
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
          ])
      ]
    });
  },
};