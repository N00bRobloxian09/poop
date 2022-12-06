const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js")
const emojiUtils = require('../../Utils/emojiUtils.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("studtobrick")
    .setDescription("Converts studs to bricks")
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('Amount of studs to convert')
        .setRequired(true)),
  execute: async (interaction, client) => {
    const studs = parseInt(interaction.options.getNumber("amount"))
    const bricks = Math.floor(studs / 15)
    const studRemoved = studs % 15

    const embed = new EmbedBuilder()
      .setTitle("Studs to Bricks Conversion")
      .setDescription(`**${studs} ${emojiUtils.stud} ↔️ ${bricks} ${emojiUtils.brick}**`)
      .setColor("#ff5454")
      .setFooter({
        text: studRemoved === 0 ? 'All good 👍 ' : `⚠ ${studRemoved} studs will be removed while converting.`
      });

    return interaction.reply({ embeds: [embed] });
  },
};