module.exports = {
  run: async (interaction, cooldown, client) => {
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) return;

      if (cooldown.has(`slash-${command.name}${interaction.user.id}`)) return interaction.reply({ content: 'Please wait before sending another command!' })

      try {
        await command.execute(interaction, client);
        cooldown.set(`slash-${command.name}${interaction.user.id}`, Date.now() + 1000)
        setTimeout(() => {
          cooldown.delete(`slash-${command.name}${interaction.user.id}`)
        }, 1000)
      } catch (error) {
        console.error(error);
      }
    }
  }
}