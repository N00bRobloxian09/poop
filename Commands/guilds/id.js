const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const guildUtils = require("../../Utils/guildUtils.js");
const emojiUtils = require("../../Utils/emojiUtils.js");
const dateUtils = require("../../Utils/dateUtils.js");
const userUtils = require("../../Utils/userUtils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("guild")
    .setDescription("Gets a guild info")
    .addNumberOption(option =>
      option.setName('id')
        .setDescription('Guild ID')
        .setRequired(true)),
  execute: async (interaction, client) => {
    await interaction.deferReply();
    const data = await guildUtils.getGuild(interaction.options.getNumber("id"))
    if (data === undefined || data.length == 0) {
      return interaction.editReply({ content: `This guild doesn't exist` });
    }

    const created = await dateUtils.atomTimeToDisplayTime(data.CreatedAt)
    const userData = await userUtils.getUserData(data.CreatorID)

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(data.Name + ' ' + (data.IsVerified === true ? emojiUtils.checkmark : ''))
          .setDescription(data.Description === '' ? 'No description set.' : data.Description)
          .setColor("#ff5454")
          .setURL(`https://polytoria.com/guilds/${data.ID}`)
          .setThumbnail(data.Thumbnail)
          .addFields([
            {
              name: 'Creator',
              value: `[${userData.Username}](https://polytoria.com/user/${data.CreatorID})`,
              inline: true
            },
            {
              name: 'Members',
              value: data.Members.toLocaleString(),
              inline: true
            },
            {
              name: 'Created At',
              value: created,
              inline: true
            }
          ])
      ]
    });
  },
};