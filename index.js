import Discord from 'discord.js'
import settings from './config.js'
import util from './util.js'
import command from './command.js'
// import commands from './commands.js'
import fs from 'fs'
import db from './db.js'
import log from './logger.js'

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
  log.log(`Logged in as ${client.user.tag}!`)

  client.user.setPresence(util.defaultAct)

  log.info('Loading commands...')

  let files = fs.readdirSync('./commands')
  for (let file of files) {
    if (file.endsWith('.js')) {
      let cmd = await import(`./commands/${file}`)
      cmd.create(client)
    }
  }

  db.read()
  for (const key in db.data.commandLog) {
    if (db.data.commandLog[key]) {
      if (!command.all.find((c) => c.name == key)) {
        log.log(
          log.c.red('Command'),
          log.c.blue(key),
          log.c.red('in in the database but has no corresponding command.')
        )
      }
    }
  }
})

// log.log(command.commands)

client.on('messageCreate', async (message) => {
  if (message.author.bot) return

  if (enable) command.runAllText(message, client)
})

client.on('interactionCreate', (interaction) => {
  if (interaction.isCommand()) {
    if (enable) command.runAllSlash(interaction, client)
  }
  if (interaction.isButton()) {
    log.log(interaction)
  }
})

client.login(settings.kyro)
