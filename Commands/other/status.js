const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios")
const emojiUtils = require("../../Utils/emojiUtils.js");


const urlToCheck = [
  {
    name: 'Main site',
    url: 'https://polytoria.com/'
  },
  {
    name: 'Internal APIs',
    url: 'https://polytoria.com/api/fetch/catalog/items'
  },
  {
    name: 'Blog',
    url: 'https://blog.polytoria.com/'
  },
  {
    name: 'Docs',
    url: 'https://docs.polytoria.com/'
  },
  {
    name: 'Wiki',
    url: 'https://wiki.polytoria.com/'
  },
  {
    name: 'Helpdesk',
    url: 'https://help.polytoria.com/'
  }

]

function statusToEmoji(status) {
  if (status === 'Experiencing Issues') {
    return emojiUtils.warning
  }

  if (status === 'Down') {
    return emojiUtils.error
  }

  if (status === 'Working') {
    return emojiUtils.checkmark
  }

  return '❓'
}

async function checkStatus(url) {
  const startTime = new Date().getTime()
  const response = await axios.get(url, { validateStatus: () => true, timeout: 20000 })
  const endTime = new Date().getTime()

  let statusText = 'Unknown'
  const responseTime = endTime - startTime

  if (responseTime > 3000) {
    statusText = 'Experiencing Issues'
  }

  if (response.status.toString().startsWith('5')) {
    statusText = 'Down'
  }

  if (response.status.toString().startsWith('2')) {
    statusText = 'Working'
  }

  return {
    status: statusText,
    statusCode: response.status,
    responseTime: responseTime
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Gets the polytoria status"),
  execute: async (interaction, client) => {
    let embed = new EmbedBuilder()
      .setTitle('Polytoria Status')
      .setURL(`https://status.polytoria.com`)
      .setDescription(emojiUtils.loading + ' Checking..')
      .setColor("#ff5454")

    await interaction.reply({
      embeds: [
        embed
      ]
    });


    let index = 0
    let Allthestuff = []
    for (const item of urlToCheck) {
      embed.addFields([{
        name: item.name,
        value: `${emojiUtils.loading} Checking`,
        inline: true
      }])
      Allthestuff[index] = {
        name: item.name,
        value: `${emojiUtils.loading} Checking`,
        inline: true
      }
      index++
    }

    await interaction.editReply({
      embeds: [
        embed
      ]
    });

    const responseTimes = []

    let index2 = 0
    for (const item of urlToCheck) {
      const mainPageStatus = await checkStatus(item.url)
      Allthestuff[index2].value = `${statusToEmoji(mainPageStatus.status)} ${mainPageStatus.status}\n\`${mainPageStatus.statusCode} - ${mainPageStatus.responseTime}ms\``
      embed.setFields(Allthestuff)
      await interaction.editReply({
        embeds: [
          embed
        ]
      });
      responseTimes.push(mainPageStatus.responseTime)
      index2++
    }

    embed.setDescription(`Average Response time: \`${(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length).toFixed(2)}ms\``)
    return await interaction.editReply({
      embeds: [
        embed
      ]
    });
  },
};