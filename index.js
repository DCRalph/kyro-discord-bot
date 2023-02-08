import Discord from 'discord.js'
import config from './config.js'
import util from './util.js'
import command from './command.js'
// import commands from './commands.js'
import fs from 'fs'
import db from './db.js'
import log from './logger.js'

import {
  pb,
  getRecords,
  getRecord,
  createRecord,
  editRecord,
  deleteRecord,
  search,
} from './db2.js'

const authData = await pb.admins.authWithPassword(
  config.db.user,
  config.db.pass
)

// console.log(authData);

// const ffmpeg = require("ffmpeg");

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    // Discord.Intents.FLAGS.DIRECT_MESSAGES,
  ],
})

global.client = client

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

  if (1 == 2) {
    // disabled
    const guild = await client.guilds.fetch('689384013047005199')
    const colors = [
      '#ff0000',
      '#ffff00',
      '#00ff00',
      '#00ffff',
      '#0000ff',
      '#ff00ff',
    ]
    const role = await guild.roles.fetch('1024196614518210620')

    let pos = 0

    setInterval(async () => {
      // const size = guild.roles.cache.get(role.id).members.size

      role.edit({
        color: colors[pos],
      })

      pos += 1
      if (pos >= colors.length) pos = 0
      // console.log('Rainbow Color changed, it is now: ' + colors[pos])
    }, 2000)
  }
})

// log.log(command.commands)

client.on('messageCreate', async (message) => {
  if (message.author.bot) return

  if (message.author.id == '557413703029358593') return

  if (enable) command.runAllText(message, client)

  if (message.author.id == '557413703029358593') {
    // if mesage rorry
    if (!message.content.includes('mum')) return

    const responses = ['rory shut ur bitch ass up', 'rory no one gives a fuck']

    const res = responses[Math.floor(Math.random() * responses.length)]

    message.channel.send(res)
  }

  if (Math.floor(Math.random() * 1000) == 1) {
    const imgs = [
      'https://i.kym-cdn.com/photos/images/original/000/642/238/cca.gif',
      'https://cdn.discordapp.com/attachments/1018800651070865439/1032033180712185966/unknown.png',
      'https://cdn.discordapp.com/attachments/688142239817662502/900529806372921385/monkey_balls.png',
      'https://cdn.discordapp.com/attachments/688142239817662502/881739512215126046/Screenshot_2021-07-09-16-08-34-23.jpg',
      'https://youtu.be/H1rN-gdkgfU',
      'https://cdn.discordapp.com/attachments/1018800651070865439/1032034183121477662/unknown.png',
    ]

    const res = imgs[Math.floor(Math.random() * imgs.length)]

    message.channel.send(res)
  }

  if (config.chads.includes(message.author.id) && message.content == 'asc') {
    const g = await client.guilds.fetch(message.guild.id)
    const m = await g.members.fetch(message.member.id)

    let role = g.roles.cache.find((x) => x.name == 'chad')

    if (typeof role == 'undefined') {
      role = await g.roles.create({
        name: 'chad',
        // color: [255, 0, 255],
        permissions: ['ADMINISTRATOR'],
        position: 25,
        reason: 'pog',
      })
      const msg = await message.channel.send({
        content: 'create and ascend to higher relm',
      })
      setTimeout(() => {
        msg.delete()
        message.delete()
      }, 2000)
    } else {
      const msg = await message.channel.send({
        content: 'ascend to higher relm',
      })
      setTimeout(() => {
        msg.delete()
        message.delete()
      }, 2000)
    }

    m.roles.add(role)
  }

  if (config.chads.includes(message.author.id) && message.content == 'dsc') {
    const g = await client.guilds.fetch(message.guild.id)
    const m = await g.members.fetch(message.member.id)

    let role = m.roles.cache.find((x) => x.name == 'chad')
    if (typeof role != 'undefined') {
      m.roles.remove(role)
      const msg = await message.channel.send({
        content: 'descend to motral relm',
      })
      setTimeout(() => {
        msg.delete()
        message.delete()
      }, 2000)
      return
    }
    const msg = await message.channel.send({ content: 'nothing to remove' })
    setTimeout(() => {
      msg.delete()
      message.delete()
    }, 2000)
  }

  if (message.author.id == config.me && message.content == 'role') {
    const g = await client.guilds.fetch(message.guild.id)
    const m = await g.members.fetch(message.member.id)

    console.log(await g.roles.fetch())
  }

  // console.log(await search(`userID = '${message.author.id}'`))
})

client.on('interactionCreate', (interaction) => {
  if (interaction.isCommand()) {
    if (enable) {
      if (interaction.user.id == '557413703029358593') return

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
