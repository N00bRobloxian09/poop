const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js")
const emojiUtils = require('../../Utils/emojiUtils.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bricktostud")
    .setDescription("Converts bricks to studs")
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('Amount of bricks to convert')
        .setRequired(true)),
  execute: async (interaction, client) => {
    const bricks = parseInt(interaction.options.getNumber("amount"))
    const studs = bricks * 15

    const embed = new EmbedBuilder()
      .setTitle("Bricks to Studs Conversion")
      .setDescription(`**${bricks} ${emojiUtils.brick} ↔️ ${studs} ${emojiUtils.stud}**`)
      .setColor("#ff5454");

    return interaction.reply({ embeds: [embed] });
  },
};