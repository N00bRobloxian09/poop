const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const { EmbedBuilder } = require("discord.js");
const userUtils = require("../../Utils/userUtils.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Gets user's avatar")
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Username')
        .setRequired(true)),
  execute: async (interaction, client) => {
    await interaction.deferReply();
    const user = await userUtils.getUserDataByUsername(interaction.options.getString("username"))
    if (user.Success == false) {
      return interaction.editReply({ content: `User not found... Please try again...` });
    }
    const avatar = await userUtils.getAvatar(user.ID)

    const bodyColors = avatar.BodyColors
    const wearables = avatar.Wearables
    const hats = wearables.Hats

    let bodyColorsString = ''

    bodyColorsString += 'Head: ' + bodyColors.Head + '\n'
    bodyColorsString += 'Torso: ' + bodyColors.Torso + '\n'
    bodyColorsString += 'Left Arm: ' + bodyColors.LeftArm + '\n'
    bodyColorsString += 'Right Arm: ' + bodyColors.RightArm + '\n'
    bodyColorsString += 'Left Leg: ' + bodyColors.LeftLeg + '\n'
    bodyColorsString += 'Right Leg: ' + bodyColors.RightLeg + '\n'

    let wearablesString = ''
    let studPrice = 0
    let brickPrice = 0


    for (const item of Object.values(hats)) {
      const itemData = await axios.get('https://api.polytoria.com/v1/asset/info?id=' + item, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
      if (itemData.data.Success) {
        wearablesString += `👒[${itemData.data.Name}](https://polytoria.com/shop/${itemData.data.ID.toString()})\n`
        if (itemData.data.Price !== -1) {
          if (itemData.data.Currency === 'Bricks') {
            brickPrice += itemData.data.Price
          } else {
            studPrice += itemData.data.Price
          }
        }
      }
    }

    for (const item of Object.values(wearables)) {
      if (typeof item === 'number') {
        const itemData = await axios.get('https://api.polytoria.com/v1/asset/info?id=' + item, { validateStatus: () => true, headers: { 'Accept-Encoding': 'application/json' } })
        if (itemData.data.Success) {
          let emoji = '❓'
          switch (itemData.data.Type) {
            case 'Face':
              emoji = '🙂'
              break
            case 'T-Shirt':
              emoji = '🎽'
              break
            case 'Shirt':
              emoji = '👕'
              break
            case 'Pants':
              emoji = '👖'
              break
            case 'Tool':
              emoji = '🥤'
              break
            case 'Head':
              emoji = '🗣️'
              break
          }

          wearablesString += `${emoji} [${itemData.data.Name}](https://polytoria.com/shop/${itemData.data.ID.toString()})\n`

          // Add to price
          if (itemData.data.Price !== -1) {
            if (itemData.data.Currency === 'Bricks') {
              brickPrice += itemData.data.Price
            } else {
              studPrice += itemData.data.Price
            }
          }
        }
      }
    }

    if (wearablesString === '') {
      wearablesString = "User doesn't wear anything."
    }


    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle(user.Username + "'s Avatar")
          .setColor("#ff5454")
          .setThumbnail(`https://polytoria.com/assets/thumbnails/avatars/${user.AvatarHash}.png`)
          .addFields([
            {
              name: `Currently Wearing`,
              value: wearablesString,
              inline: true,
            },
            {
              name: 'Body Colors',
              value: bodyColorsString,
              inline: true
            },
            {
              name: 'Total Price',
              value: `${brickPrice} Brick(s) ${studPrice} Stud(s)`,
              inline: true
            },
          ])
      ]
    });
  },
};