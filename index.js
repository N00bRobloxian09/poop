require('dotenv').config()
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const { join } = require('path')

const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});
client.commands = new Collection();
const commandarray = [];
const token = process.env.token;

const isDirectory = source => fs.lstatSync(source).isDirectory()

client.on("ready", () => {
  const commandCategories = fs
    .readdirSync("./Commands")
    .map(name => join("./Commands", name)).filter(isDirectory)

  commandCategories.forEach((folder) => {
    const commandFiles = fs
      .readdirSync(`${folder}`)
      .filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./${folder}/${file}`);
      console.log("[Loader] Loading command "+command.data.name)
      client.commands.set(command.data.name, command);
      commandarray.push(command.data.toJSON());
    }
  })

  const rest = new REST({ version: "9" }).setToken(token);
  ; (async () => {
    try {
      console.log("[Loader] Loading application commands");
      if(process.env.globalcmd == "true") {
        console.log("[Bot] Global Commands Enabled")
        await rest.put(Routes.applicationCommands(client.user.id), {
          body: commandarray,
        })
      } else {
        console.log("[Bot] Guild Commands Enabled, Assigning to "+process.env.guild_id)
        await rest.put(Routes.applicationGuildCommands(client.user.id, '' + process.env.guild_id), {
          body: commandarray,
        })
      }

      console.log("[Loader] Application commands successfully loaded");
    } catch (error) {
      console.error(error);
    }
  })();

  client.user.setActivity(`${client.guilds.cache.reduce((a, guild) => a + guild.memberCount, 0)} Users | /help`, { type: 'WATCHING' })

  setInterval(function() {
    client.user.setActivity(`${client.guilds.cache.reduce((a, guild) => a + guild.memberCount, 0)} Users | /help`, { type: 'WATCHING' })
  }, 60000)

  console.log(`Logged in as ${client.user.tag}!`);
});

const cooldown = new Collection();

client.on("interactionCreate", (...args) => {
  const event = require(`./Events/interactionCreate.js`);
  event.run(...args, cooldown, client)
});

client.login(token);