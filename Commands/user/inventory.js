const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js");
const userUtils = require("../../Utils/userUtils.js");
const uuid = require("uuid")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("View user's inventory")
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

    let currentPage = 1;
    let totalPages = 1;

    async function changePage() {
      const inventory = await userUtils.getInventory(user.ID, currentPage) //user.ID, currentPage
      let resultString = ''
      totalPages = inventory.Pages;
      if (inventory.Success == false) {
        return resultString + 'Failed to load items'
      }
      inventory.Inventory.forEach((item) => {
        resultString += `[${item.Name}](https://polytoria.com/shop/${item.ID})\n`
      })
      if (resultString == "") resultString = "No items to show"

      return resultString;
    }


    const inventoryData = await changePage()

    const randid = uuid.v4()

    const prev = new ButtonBuilder()
      .setCustomId("prev" + randid)
      .setEmoji("⬅️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true)

    const mid = new ButtonBuilder()
      .setCustomId("mid" + randid)
      .setLabel(`Page ${currentPage.toString()} of ${totalPages.toString()}`)
      .setStyle(ButtonStyle.Secondary)
    const nDis = currentPage >= totalPages ? true : false

    const next = new ButtonBuilder()
      .setCustomId("next" + randid)
      .setEmoji("➡️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(nDis)

    const buttonRow = new ActionRowBuilder().addComponents(prev, mid, next);


    const embed = new EmbedBuilder()
      .setTitle(user.Username + "'s Inventory.")
      .setURL(`https://polytoria.com/user/${user.ID}/inventory`)
      .setColor(`#ff5454`)
      .setThumbnail(`https://polytoria.com/assets/thumbnails/avatars/${user.AvatarHash}.png`)
      .setDescription(inventoryData)

    await interaction.editReply({ embeds: [embed], components: [buttonRow] }).then((m) => {
      const collector = m.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120000,
      })

      collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
          return
        }

        await i.deferUpdate();

        if (i.customId == "prev" + randid) {
          if (currentPage >= 0) currentPage--;
        } else if (i.customId == "next" + randid) {
          if (currentPage <= totalPages) currentPage++
        }

        if (currentPage >= totalPages) next.setDisabled(true);
        else next.setDisabled(false);

        if (currentPage <= 1) prev.setDisabled(true);
        else prev.setDisabled(false);

        mid.setLabel(`Page ${currentPage.toString()} of ${totalPages.toString()}`)

        const inventoryData = await changePage()
        embed.setDescription(inventoryData)

        const buttonRow = new ActionRowBuilder().addComponents(prev, mid, next);
        await interaction.editReply({ embeds: [embed], components: [buttonRow] });

        collector.resetTimer();
      })

      collector.on("end", async (i) => {
        await embed.editReply({
          embeds: [embed],
          components: [],
        })
      })
    });
  },
};