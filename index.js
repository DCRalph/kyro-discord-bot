import Discord from 'discord.js'
import config from './config.js'
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

  config.servers.forEach(async (s) => {
    await client.guilds.fetch(s)
  })

  let files = fs.readdirSync('./commands')
  for (let file of files) {
    if (file.endsWith('.js')) {
      let cmd = await import(`./commands/${file}`)
      await cmd.create(client)
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

  if (Math.floor(Math.random() * 100) == 1) {
    const imgs = [
      'https://i.kym-cdn.com/photos/images/original/000/642/238/cca.gif',
      'https://memegenerator.net/img/instances/51482093.jpg',
    ]

    const res = imgs[Math.floor(Math.random() * imgs.length)]

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

client.on('presenceUpdate', async (oldMember, newMember) => {
  // log.log('old', oldMember)
  // log.log('new', newMember)

  if (newMember.user.bot) return
  if (newMember.guild.id != 689384013047005199) return

  const g = await client.guilds.fetch(newMember.guild.id)
  const m = await g.members.fetch(newMember.user.id)

  util.userStatuses(m)
})

client.login(config.kyro)
