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

  util.serverInfo(client, '689384013047005199')

  client.user.setPresence(util.defaultAct)

  log.info('Loading commands...')

  let files = fs.readdirSync('./commands')
  for (let file of files) {
    if (file.endsWith('.js')) {
      let cmd = await import(`./commands/${file}`)
      cmd.create(client)
    }
  }

  log.info('Loaded Done!')

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

  if (message.author.id == '557413703029358593') {
    // if mesage rorry
    if (!message.content.includes('mum')) return

    const responses = ['rory shut ur bitch ass up', 'rory no one gives a fuck']

    const res = responses[Math.floor(Math.random() * responses.length)]

    message.channel.send(res)
  }
})

client.on('interactionCreate', (interaction) => {
  if (interaction.isCommand()) {
    if (enable) {
      let res = command.runAllSlash(interaction, client)
      if (!res) {
        let embed = new Discord.MessageEmbed()
        embed.setTitle(
          `Sorry, I don't know what that means. Try /help for a list of commands.`
        )
        embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

        interaction.reply({
          embeds: [embed],
        })
      }
    }
  }
  if (interaction.isButton()) {
    log.log(interaction)
  }
})

client.on('presenceUpdate', (oldMember, newMember) => {
  // log.log('old', oldMember)
  // log.log('new', newMember)

  if (newMember.user.bot) return
  if (newMember.guild.id != 689384013047005199) return

  db.read()
  const now = Date.now()

  const status = newMember.status

  if (typeof db.data.userDB[newMember.user.id] == 'undefined') {
    db.data.userDB[newMember.user.id] = {
      id: newMember.user.id,
      status: status,
      last: now,
      statuses: {
        online: 0,
        idle: 0,
        dnd: 0,
        offline: 0,
      },
      games: {},
    }
  }

  const oldStatus = db.data.userDB[newMember.user.id].status

  db.data.userDB[newMember.user.id].username = newMember.user.username

  if (oldStatus != status) {
    log.info(
      `${newMember.user.username} changed status from ${oldStatus} to ${status}`
    )
  }

  if (['online', 'idle', 'dnd', 'offline'].includes(oldStatus)) {
    db.data.userDB[newMember.user.id].statuses[oldStatus] +=
      now - db.data.userDB[newMember.user.id].last
  } else {
    console.log('invalid status')
  }

  if (newMember.activities.length > 0) {
    const games = newMember.activities
    games.forEach((game) => {
      if (game.type != 'PLAYING') return

      if (
        typeof db.data.userDB[newMember.user.id].games[game.name] == 'undefined'
      ) {
        db.data.userDB[newMember.user.id].games[game.name] = 0
      }
      db.data.userDB[newMember.user.id].games[game.name] +=
        now - db.data.userDB[newMember.user.id].last
    })
  }

  db.data.userDB[newMember.user.id].last = now
  db.data.userDB[newMember.user.id].status = status

  db.write()
})

client.login(settings.kyro)
