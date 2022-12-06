const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const catalogUtils = require("../../Utils/catalogUtils.js");
const emojiUtils = require("../../Utils/emojiUtils.js");
const dateUtils = require("../../Utils/dateUtils.js");
const userUtils = require("../../Utils/userUtils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("catalog")
    .setDescription("Gets an item info")
    .addNumberOption(option =>
      option.setName('id')
        .setDescription('Item ID')
        .setRequired(true)),
  execute: async (interaction, client) => {
    await interaction.deferReply();
    const data = await catalogUtils.getItem(interaction.options.getNumber("id"))
    if (data === undefined || data.length == 0) {
      return interaction.editReply({ content: `This ID doesn't exist` });
    }

    const created = await dateUtils.atomTimeToDisplayTime(data.CreatedAt)
    const creatorDisplay = await userUtils.getDisplayCreatorName(data.CreatorID, data.CreatorType)
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(data.Name)
          .setDescription(data.Description === '' ? 'No description set.' : data.Description)
          .setColor("#ff5454")
          .setURL(`https://polytoria.com/shop/${data.ID}`)
          .setThumbnail(data.Thumbnail)
          .addFields([
            {
              name: 'Creator',
              value: creatorDisplay,
              inline: true
            },
            {
              name: 'Type',
              value: data.Type,
              inline: true
            },
            {
              name: 'Price',
              value: (data.Currency === 'Bricks' ? emojiUtils.brick : emojiUtils.stud) + ' ' + data.Price.toString(),
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