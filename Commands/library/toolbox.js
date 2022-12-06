const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js");
const libraryUtils = require("../../Utils/libraryUtils.js");
const uuid = require("uuid")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("toolbox")
    .setDescription("Look up items in toolbox")
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Search query')
        .setRequired(true)),
  execute: async (interaction, client) => {
    await interaction.deferReply();
    let currentPage = 0;
    let totalPages = 0;

    async function changePage() {
      const inventory = await libraryUtils.getToolbox(interaction.options.getString("query"), currentPage) //user.ID, currentPage
      let resultString = ''
      totalPages = inventory.Pages;
      if (inventory.Pages == 0) {
        return resultString + 'Failed to load items'
      }
      inventory.Items.forEach((item) => {
        resultString += `[${item.Name}](https://polytoria.com/library/${item.ID})\n`
      })
      if (resultString == "") resultString = "No items to show"

      return resultString;
    }


    const toolboxData = await changePage()

    const randid = uuid.v4()

    const prev = new ButtonBuilder()
      .setCustomId("prev" + randid)
      .setEmoji("⬅️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true)

    const mid = new ButtonBuilder()
      .setCustomId("mid" + randid)
      .setLabel(`Page ${currentPage + 1} of ${totalPages}`)
      .setStyle(ButtonStyle.Secondary)
    const nDis = currentPage + 1 >= totalPages ? true : false

    const next = new ButtonBuilder()
      .setCustomId("next" + randid)
      .setEmoji("➡️")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(nDis)

    const buttonRow = new ActionRowBuilder().addComponents(prev, mid, next);


    const embed = new EmbedBuilder()
      .setTitle("Toolbox")
      .setColor(`#ff5454`)
      .setThumbnail(`https://polytoria.com/assets/img/model-temp.png`)
      .setDescription(toolboxData)

    await interaction.editReply({ embeds: [embed], components: [buttonRow] }).then((m) => {
      const collector = m.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 120000,
      })

      collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
          return
        }

        console.log(currentPage)
        console.log(totalPages)

        await i.deferUpdate();



        if (i.customId == "prev" + randid) {
          if (currentPage >= 0) currentPage--;
        } else if (i.customId == "next" + randid) {
          if (currentPage <= totalPages) currentPage++
        }

        if (currentPage >= (totalPages - 1)) next.setDisabled(true);
        else next.setDisabled(false);

        if (currentPage <= 0) prev.setDisabled(true);
        else prev.setDisabled(false);


        mid.setLabel(`Page ${currentPage + 1} of ${totalPages}`)

        const toolboxData = await changePage()
        embed.setDescription(toolboxData)

        const buttonRow = new ActionRowBuilder().addComponents(prev, mid, next);
        await interaction.editReply({ embeds: [embed], components: [buttonRow] });

        collector.resetTimer();
      })

      collector.on("end", async (i) => {
        await currentPage.edit({
          embeds: [embed],
          components: [],
        })
      })
    });
  },
};