import Discord from 'discord.js'
import settings from './config.js'
import util from './util.js'
import command from './command.js'
// import commands from './commands.js'
import fs from 'fs'
import db from './db.js'

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    // Discord.Intents.FLAGS.DIRECT_MESSAGES,
  ],
})

let enable = true

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)

  client.user.setPresence(util.defaultAct)

  let files = fs.readdirSync('./commands')
  files.forEach(async (file) => {
    if (file.endsWith('.js') && !file.includes('!')) {
      const cmd = await import(`./commands/${file}`)
      cmd.create(client)
    }
  })

  db.read()
  for (key in db.data.commandLog) {
    if (db.data.commandLog[key]) {
    }
  }
})

// console.log(command.commands)

client.on('messageCreate', async (message) => {
  if (message.author.bot) return

  if (enable) command.runAllText(message, client)
})

client.on('interactionCreate', (interaction) => {
  if (interaction.isCommand()) {
    if (enable) command.runAllSlash(interaction, client)
  }
  if (interaction.isButton()) {
    console.log(interaction)
  }
})

client.login(settings.kyro)
