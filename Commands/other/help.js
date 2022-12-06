const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js");
const pages = require("../../Utils/helpPage.js");
const uuid = require("uuid")
module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("View all commands"),
    execute: async (interaction, client) => {
        let currentPage = 0;
        const totalPages = pages.length

        async function changePage() {
            return pages[currentPage];
        }


        let helpData = await changePage()
      
        const randid = uuid.v4()
      
        const prev = new ButtonBuilder()
            .setCustomId("prev"+randid)
            .setEmoji("⬅️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)

        const mid = new ButtonBuilder()
            .setCustomId("mid"+randid)
            .setLabel(`Page ${currentPage+1} of ${totalPages}`)
            .setStyle(ButtonStyle.Secondary)

        const nDis = currentPage >= totalPages ? true : false
      
        const next = new ButtonBuilder()
            .setCustomId("next"+randid)
            .setEmoji("➡️")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(nDis)

        const buttonRow = new ActionRowBuilder().addComponents(prev, mid, next);


        const embed = new EmbedBuilder()
            .setTitle("List of available commands")
            .setColor(`#ff5454`)
            .setThumbnail('https://cdn.discordapp.com/icons/587167555068624915/4149b9aea50a0fd41260d71ac743407d.webp?size=128')

      embed.setFields(helpData)

        await interaction.reply({ embeds: [embed], components: [buttonRow] }).then((m) => {
        const collector = m.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 120000,
        })

        collector.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) {
                return
            }

            await i.deferUpdate();

            if (i.customId == "prev"+randid) {
                if (currentPage >= 0) currentPage--;
            } else if (i.customId == "next"+randid) {
                if (currentPage <= totalPages) currentPage++
            }
          
            if (currentPage >= (totalPages-1)) next.setDisabled(true);
            else next.setDisabled(false);

            if (currentPage <= 0) prev.setDisabled(true);
            else prev.setDisabled(false);

            mid.setLabel(`Page ${currentPage+1} of ${totalPages}`)
            
            let helpData = await changePage()
            embed.setFields(helpData)

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