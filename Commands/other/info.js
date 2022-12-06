const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Bot information"),
  execute: async (interaction, client) => {
    const embed = new EmbedBuilder()
      .setThumbnail('https://polytoria.com/assets/catalog/12659.png')
      .setColor('#fe5953')
      .setTitle('Polytoria Community Bot')
      .setURL('https://discord.com/api/oauth2/authorize?client_id=905979909049028649&permissions=414464724032&scope=bot')
      .addFields([
        {
          name: 'Version',
          value: `Running version ${process.env.npm_package_version}`,
          inline: false,
        },
        {
          name: 'Invite our Bot',
          value: 'Tap the title to invite our bot directly to your server!',
          inline: false,
        },
        {
          name: 'We are open-sourced!',
          value: 'https://github.com/Polytoria/Polytoria-Community-Bot',
          inline: false,
        },
        {
          name: 'Rewritten by',
          value: 'Shiggy, DevPixels, baggy, and more!',
          inline: false,
        }
        ])
        .setFooter({ text: 'Thanks to all collaborators of the project!'})

    return await interaction.reply({ embeds: [embed] })
  },
};