const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const gameUtils = require("../../Utils/gameUtils.js");
const dateUtils = require("../../Utils/dateUtils.js");
const userUtils = require("../../Utils/userUtils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game")
    .setDescription("Gets a game info")
    .addNumberOption(option =>
      option.setName('id')
        .setDescription('Game ID')
        .setRequired(true)),
  execute: async (interaction, client) => {
    await interaction.deferReply();
    const data = await gameUtils.getGame(interaction.options.getNumber("id"))
    if (data === undefined || data.length == 0) {
      return interaction.editReply({ content: `This game doesn't exist` });
    }

    const created = await dateUtils.atomTimeToDisplayTime(data.CreatedAt)
    const updated = await dateUtils.atomTimeToDisplayTime(data.UpdatedAt)
    const userData = await userUtils.getUserData(data.CreatorID)

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(data.Name)
          .setDescription(data.Description === '' ? 'No description set.' : data.Description)
          .setColor("#ff5454")
          .setURL(`https://polytoria.com/games/${data.ID}`)
          .setImage(data.Thumbnail)
          .setThumbnail(`https://polytoria.com/assets/thumbnails/avatars/${userData.AvatarHash}.png`)
          .addFields([
            {
              name: 'Creator',
              value: `[${userData.Username != undefined ? userData.Username : "Deleted User "+data.CreatorID}](https://polytoria.com/user/${data.CreatorID})`,
              inline: true
            },
            {
              name: 'Visits',
              value: data.Visits.toLocaleString(),
              inline: true
            },
            {
              name: 'Likes',
              value: data.Likes.toLocaleString(),
              inline: true
            },
            {
              name: 'Dislikes',
              value: data.Dislikes.toLocaleString(),
              inline: true
            },
            {
              name: 'Created At',
              value: created,
              inline: true
            },
            {
              name: 'Updated At',
              value: updated,
              inline: true
            }
          ])
      ]
    });
  },
};