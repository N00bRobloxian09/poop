const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ActionRowBuilder, Events, StringSelectMenuBuilder, ComponentType } = require("discord.js");
const uuid = require("uuid")
const textTable = require("text-table")
const userUtils = require("../../Utils/userUtils.js")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Gets the on-site leaderboard data"),
  execute: async (interaction, client) => {
    await interaction.deferReply();
    let currentType = 'networth'

    async function refreshLeaderboard() {
      const response = await userUtils.getLeaderboard(currentType)
      const resultTable = []

      resultTable.push(['**#**', '**User**', '**Amount**'])

      let counter = 1

      response.forEach((item) => {
        const counterDisplay = counter.toString()

        resultTable.push([counterDisplay, `[${item.username}](https://polytoria.com/user/${item.user_id})`, '`' + item.statistic + '`'])
        counter++
      })

      return textTable(resultTable, { align: ['l', 'l', 'l'], hsep: 'ㅤ' })
    }

    const randid = uuid.v4()
    const selectorID = 'selector' + randid
    const menu = new StringSelectMenuBuilder()
      .setCustomId(selectorID)
      .setPlaceholder('Select type here')
      .addOptions([
        {
          label: 'Trade Value',
          value: 'networth',
          emoji: '💰'
        },
        {
          label: 'Forum Posts',
          value: 'posts',
          emoji: '🦆'
        },
        {
          label: 'Comments',
          value: 'comments',
          emoji: '💬'
        },
        {
          label: 'Profile Views',
          value: 'views',
          emoji: '👨‍👩‍👦'
        },
        {
          label: 'Item sales',
          value: 'sales',
          emoji: '👕'
        }
      ])

    const row = new ActionRowBuilder().addComponents(menu)


    const embed = new EmbedBuilder()
      .setTitle("Leaderboard")
      .setURL('https://polytoria.com/leaderboard')
      .setColor(`#ff5454`)
      .setThumbnail('https://polytoria.com/assets/thumbnails/catalog/234.png?v=2')

    await interaction.editReply({ embeds: [embed], components: [row] }).then((m) => {
      const collector = m.createMessageComponentCollector({
        componentType: ComponentType.SelectMenu,
        time: 120000,
      })

      collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
          return
        }

        await i.deferUpdate();

        if (i.customId === selectorID) {
          currentType = i.values[0]
        }

        const leaderboardData = await refreshLeaderboard()
        embed.setDescription('Leaderboards > ' + currentType + '\n\n' + leaderboardData)
        embed.setURL('https://polytoria.com/leaderboard?c=' + currentType)

        await interaction.editReply({ embeds: [embed], components: [row] });

        collector.resetTimer();
      })

      collector.on("end", async (i) => {
        await currentPage.editReply({
          embeds: [embed],
          components: [],
        })
      })
    });
  },
};