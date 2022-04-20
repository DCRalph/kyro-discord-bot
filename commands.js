import command from './command.js'
import util from './util.js'
import fetch from 'node-fetch'
import Discord from 'discord.js'
import db from './db.js'

const create = async (client) => {
  new command.Command(
    client,
    ['help', 'info'],
    'Help command',
    async (message) => {
      let [first, ...rest] = message.content.toLowerCase().split(' ')
      let cmd = rest.join(' ').trim()

      if (cmd == '') {
        let embed = new Discord.MessageEmbed()
        embed.setTitle('Command List')
        embed.setDescription('Use `help <command>` to get info on a command')
        embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))
        let commands = {
          commands: [],
          descriptions: [],
        }

        for (let i = 0; i < command.all.length; i++) {
          commands.commands += `**${
            command.all[i].type == 'slash' ? '[/]' : ''
          }${command.all[i].name}**\n`
          commands.descriptions += `${command.all[i].description}\n`
        }

        embed.addField('Command:', commands.commands, true)
        embed.addField('Description:', commands.descriptions, true)

        message.channel.send({
          embeds: [embed],
        })
        return
      }

      let cmdData = command.getCommand(cmd)

      if (cmdData == null) {
        message.channel.send({
          content: 'That command dosent exist.',
        })
        return
      }

      db.read()
      let used = db.data.commandLog[cmdData.name] || -1

      let embed = new Discord.MessageEmbed()
      embed.setTitle(`${cmdData.name}`)
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))
      embed.setDescription(`${cmdData.description}`)
      embed.addField('Aliases', `${cmdData.aliases.join(', ')}`)
      embed.addField('Used', `${used}`)
      if (cmdData.coolDown > 0) {
        let timeLeft = Math.round(
          (cmdData.lastUsed + cmdData.coolDown - Date.now()) / 1000
        )
        if (timeLeft < 0) timeLeft = 0
        embed.addField('Cooldown', `${timeLeft}s/${cmdData.coolDown / 1000}s`)
      }

      message.channel.send({
        embeds: [embed],
      })
    }
  )

  new command.Command(client, ['ping'], 'Gets ping(ms)', async (message) => {
    const m = await message.channel.send({
      content: 'Ping?',
    })
    m.edit(`Pong! ${m.createdTimestamp - message.createdTimestamp}ms`)
  })

  new command.Command(
    client,
    ['covid', 'virus', 'crona', 'rona'],
    'Covid stats in nz or other country',
    async (message) => {
      let [first, ...rest] = message.content.toLowerCase().split(' ')

      let country = rest.join('%20') || 'nz'
      country = country.toLowerCase()

      if (country == 'murica') country = 'usa'
      if (rest.join(' ') == 'froghat fan club') {
        const embed = new Discord.MessageEmbed()

        embed.setTitle(`COVID-19 in Froghat Fan Club`)
        embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))
        embed.addField('Cases', `69420`, true)
        embed.addField('Deaths', `80085`, true)
        embed.addField('\u200b', '\u200b', true)
        embed.addField('Today Cases', `69696969`, true)
        embed.addField('Today Deaths', `420`, true)
        embed.addField('\u200b', '\u200b', true)
        embed.addField('Recovered', `-1000`, true)
        embed.addField('Active', `all of them`, true)
        embed.addField('\u200b', '\u200b', true)

        message.channel.send({
          embeds: [embed],
        })
        return
      }

      let url = `https://disease.sh/v3/covid-19/countries/${country}?strict=true`
      if (country == 'all')
        url = `https://disease.sh/v3/covid-19/all?strict=true`

      const req = await fetch(url)
      const data = await req.json()

      if (req.status != 200) {
        if (typeof data.message != 'undefined') {
          message.channel.send({
            content: data.message,
          })
        } else {
          throw new Error(`${req.status} ${url}`)
        }
        return
      }

      // console.log(data)

      const embed = new Discord.MessageEmbed()

      if (country != 'all') embed.setTitle(`COVID-19 in ${data.country}`)
      else embed.setTitle('COVID-19 in the world')
      if (country != 'all') embed.setThumbnail(data.countryInfo.flag)
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))
      embed.addField('Cases', `${data.cases}`, true)
      embed.addField('Deaths', `${data.deaths}`, true)
      embed.addField('\u200b', '\u200b', true)
      embed.addField('Today Cases', `${data.todayCases}`, true)
      embed.addField('Today Deaths', `${data.todayDeaths}`, true)
      embed.addField('\u200b', '\u200b', true)
      embed.addField('Recovered', `${data.recovered}`, true)
      embed.addField('Active', `${data.active}`, true)
      embed.addField('\u200b', '\u200b', true)

      message.channel.send({
        embeds: [embed],
      })
    }
  )

  new command.Command(
    client,
    ['list members'],
    'get all members',
    async (message, client) => {
      let data = await util.serverInfo(client, message.guild.id)
      let members = ''
      data.members.forEach((member) => {
        members += member.user.username + '\n'
      })

      members = util.sanitizer(members)
      message.channel.send({
        content: members,
      })
    }
  )

  new command.Command(
    client,
    ['bread', '🍞'],
    'Bread 👍',
    async (message) => {
      message.channel.send({
        content: 'Bread 👍',
      })
    },
    69000
  )

  new command.Command(
    client,
    ['hmmm'],
    'hmmm',
    async (message) => {
      message.channel.send({
        content: 'hmmm',
      })
    },
    60000
  )

  new command.Command(
    client,
    ['frog'],
    'a sexy man in a frog hat',
    async (message) => {
      message.channel.send({
        files: [
          'https://cdn.discordapp.com/attachments/766784398032764958/945924885337751572/frog.png',
        ],
      })
    }
  )

  new command.Command(client, ['amogus'], 'amogus', async (message) => {
    message.channel.send({
      content:
        'https://tenor.com/view/19dollar-fortnite-card-among-us-amogus-sus-red-among-sus-gif-20549014',
    })
  })

  new command.Command(
    client,
    ['sus', 'baka'],
    'sussy baka',
    async (message) => {
      message.channel.send({
        files: [
          'https://cdn.discordapp.com/attachments/766784398032764958/945924971035783210/sus.mp3',
        ],
      })
    }
  )

  new command.Command(
    client,
    ['david is sexy asian'],
    'Try to keep ur pants on',
    async (message) => {
      message.channel.send({
        content:
          'https://tenor.com/view/deez-nuts-chungus-reddit-cum-wholesome-gif-20085745',
      })
    }
  )

  new command.Command(client, ['shrek'], 'shrek', async (message) => {
    message.channel.send({
      files: [
        'https://cdn.discordapp.com/attachments/766784398032764958/945925099851227136/e2.jpeg',
      ],
    })
  })

  new command.Command(client, ['sexy shrek'], 'sexy shrek', async (message) => {
    message.channel.send({
      files: [
        'https://cdn.discordapp.com/attachments/689709940696416383/945931738180386846/IMG_0776.JPG',
      ],
    })
  })

  new command.Command(
    client,
    ['sexy adam', 'sexy frog', 'sexy frog hat boy'],
    'sexy adam',
    async (message) => {
      let times = message.content.split(' ')
      times = parseInt(times[times.length - 1])
      if (times == 'NaN' || isNaN(times)) times = 1

      for (let i = 0; i < times; i++) {
        message.channel.send({
          files: [
            'https://cdn.discordapp.com/attachments/689709940696416383/945938458071937024/Screenshot_20220223-195406_Snapchat.jpg',
          ],
        })
      }
    }
  )

  new command.Command(client, ['possum'], 'possum', async (message) => {
    message.channel.send({
      files: [
        'https://cdn.discordapp.com/attachments/766784398032764958/946547367828656199/9k.png',
      ],
    })
  })

  new command.Command(client, ['vc'], 'vc bitrate', async (message, client) => {
    let data = await util.serverInfo(client, message.guild.id)

    if (data.guild.me.permissions.has('MANAGE_CHANNELS') == false) {
      message.channel.send({
        content: 'I need the manage channels permission to do this',
      })
      return
    }

    let channels = await data.guild.channels.fetch()
    console.log()

    let bitrate = message.content.split(' ')[1]

    channels.forEach(async (channel) => {
      if (channel.type == 'GUILD_VOICE') {
        console.log(channel.name)

        // set bitrate
        try {
          await channel.setBitrate(Number(bitrate))
          await message.channel.send({
            content: `success ${channel.name} ${bitrate}`,
          })
        } catch (e) {
          console.log(e)
          await message.channel.send({
            content: `failed ${channel.name} ${bitrate}\n${e}`,
          })
        }
      }
    })
  })

  //#################################################

  new command.Slash(
    client,
    ['help'],
    'Help command',
    [
      {
        name: 'command',
        type: 'STRING',
        description: 'conmmand to get help for',
        required: false,
      },
    ],
    async (interaction) => {
      // let [first, ...rest] = message.content.toLowerCase().split(' ')
      // let cmd = rest.join(' ').trim()
      let cmd = ''

      try {
        cmd = interaction.options.get('command').value
      } catch (e) {
        cmd = ''
      }

      console.log(cmd)

      if (cmd == '') {
        let embed = new Discord.MessageEmbed()
        embed.setTitle('Command List')
        embed.setDescription('Use `help <command>` to get info on a command')
        embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))
        let commands = {
          commands: [],
          descriptions: [],
        }

        for (let i = 0; i < command.all.length; i++) {
          commands.commands += `**${
            command.all[i].type == 'slash' ? '[/]' : ''
          }${command.all[i].name}**\n`
          commands.descriptions += `${command.all[i].description}\n`
        }

        embed.addField('Command:', commands.commands, true)
        embed.addField('Description:', commands.descriptions, true)

        interaction.reply({
          embeds: [embed],
        })
        return
      }

      let cmdData = command.getCommand(cmd)

      if (cmdData == null) {
        interaction.reply({
          content: 'That command dosent exist.',
        })
        return
      }

      db.read()
      let used = db.data.commandLog[cmdData.name] || -1

      let embed = new Discord.MessageEmbed()
      embed.setTitle(`${cmdData.name}`)
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))
      embed.setDescription(`${cmdData.description}`)
      embed.addField('Aliases', `${cmdData.aliases.join(', ')}`)
      embed.addField('Used', `${used}`)
      if (cmdData.coolDown > 0) {
        let timeLeft = Math.round(
          (cmdData.lastUsed + cmdData.coolDown - Date.now()) / 1000
        )
        if (timeLeft < 0) timeLeft = 0
        embed.addField('Cooldown', `${timeLeft}s/${cmdData.coolDown / 1000}s`)
      }

      interaction.reply({
        embeds: [embed],
      })
    }
  )

  new command.Slash(
    client,
    ['yeet'],
    'yeet command',
    [
      {
        name: 'victim',
        type: 'USER',
        description: 'victim to yeet',
        required: false,
      },
    ],
    async (interaction, client) => {
      let victim = interaction.options.get('victim')

      if (victim == null) {
        victim = interaction.user
      } else {
        victim = victim.user
      }

      let embed = new Discord.MessageEmbed()
      embed.setTitle(`${victim.username} has been yeeted`)
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

      interaction.reply({
        content: `<@${victim.id}>`,
        embeds: [embed],
      })
    }
  )

  new command.Slash(
    client,
    ['fuck'],
    'mmmmmm',
    [
      {
        name: 'victim1',
        type: 'USER',
        description: 'victim 1 to fuck',
        required: false,
      },
      {
        name: 'victim2',
        type: 'USER',
        description: 'victim 2 to fuck',
        required: false,
      },
      {
        name: 'victim3',
        type: 'USER',
        description: 'victim 3 to fuck',
        required: false,
      },
      {
        name: 'victim4',
        type: 'USER',
        description: 'victim 4 to fuck',
        required: false,
      },
      {
        name: 'victim5',
        type: 'USER',
        description: 'victim 5 to fuck',
        required: false,
      },
      {
        name: 'template',
        type: 'STRING',
        description:
          '[x] you, [y] is victim 1, [z] is victim 2, [a] is victim 3, [b] is victim 4, [c] is victim 5',
        required: false,
      },
    ],
    async (interaction, client) => {
      let victim1 = interaction.options.get('victim1')
      let victim2 = interaction.options.get('victim2')
      let victim3 = interaction.options.get('victim3')
      let victim4 = interaction.options.get('victim4')
      let victim5 = interaction.options.get('victim5')
      let userTemplate = interaction.options.get('template')

      let fucking = [interaction]

      if (victim1 != null) fucking.push(victim1)
      if (victim2 != null) fucking.push(victim2)
      if (victim3 != null) fucking.push(victim3)
      if (victim4 != null) fucking.push(victim4)
      if (victim5 != null) fucking.push(victim5)

      let msg = ''
      let template = ''
      let dupe = false

      if (userTemplate != null) {
        template = userTemplate.value

        db.read()
        db.data.fuckTemplate[fucking.length].forEach((t) => {
          if (t.toLowerCase() == template.toLowerCase()) {
            dupe = true
          }
        })

        if (!dupe) {
          db.data.fuckTemplate[fucking.length].push(template)
          db.write()
        }
      } else {
        db.read()
        template =
          db.data.fuckTemplate[fucking.length][
            Math.floor(
              Math.random() * db.data.fuckTemplate[fucking.length].length
            )
          ]
      }

      if (fucking.length >= 1)
        template = template.replaceAll('[x]', fucking[0].member.displayName)

      if (fucking.length >= 2)
        template = template.replaceAll('[y]', fucking[1].member.displayName)
      if (fucking.length >= 3)
        template = template.replaceAll('[z]', fucking[2].member.displayName)
      if (fucking.length >= 4)
        template = template.replaceAll('[a]', fucking[3].member.displayName)
      if (fucking.length >= 5)
        template = template.replaceAll('[b]', fucking[4].member.displayName)
      if (fucking.length >= 6)
        template = template.replaceAll('[c]', fucking[5].member.displayName)

      msg = util.sanitizer(template)

      let embed = new Discord.MessageEmbed()
      if (msg.length < 256) embed.setTitle(msg)
      else if (msg.length < 5980) {
        embed.setTitle('FUCK')
        embed.setDescription(msg)
      } else {
        embed.setTitle('FUCK')
        embed.setDescription('FUCK TOO LONG')
      }
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

      interaction.reply({
        // content: `<@${victim.id}>`,
        embeds: [embed],
      })
    }
  )

  new command.Slash(
    client,
    ['adams-command'],
    'adams command',
    [],
    async (interaction, client) => {
      if (
        ['624324290644279370', '472872051359612945'].includes(
          interaction.user.id
        )
      ) {
        interaction.reply({
          content: 'nigga',
        })
      } else {
        interaction.reply({
          content: 'your not adam',
        })
      }
    }
  )

  new command.Slash(
    client,
    ['minesweeper'],
    'play minesweaper',
    [
      {
        name: 'size',
        type: 'STRING',
        description: 'x,y Defalut is 10,10',
        required: false,
      },
      {
        name: 'bombs',
        type: 'NUMBER',
        description: 'bombs Defalut is 30',
        required: false,
      },
    ],
    async (interaction, client) => {
      let sizeIN = interaction.options.get('size')
      let bombsIN = interaction.options.get('bombs')

      let size = [10, 10]
      let bombs = 30

      if (sizeIN != null) {
        size = sizeIN.value.split(',').map((x) => parseInt(x))
      }

      if (bombsIN != null) {
        bombs = bombsIN.value
      }

      // console.log(size, bombs)

      if (size[0] > 50) {
        interaction.reply({
          content: 'Size X too big',
        })
        return
      }

      if (size[1] > 50) {
        interaction.reply({
          content: 'Size Y too big',
        })
        return
      }

      if (bombs > size[0] * size[1]) {
        interaction.reply({
          content: 'Too many bombs',
        })
        return
      }

      interaction.reply({
        content: 'MINESWEEPER',
      })

      let board = util.mineSweeper(size, bombs)

      let row = board.raw[0].length
      // let col = board.raw.length

      // let rowsPer = Math.floor(sendPer / row)

      for (let i = 0; i < board.raw.length; i++) {
        let msg = ''

        for (let j = 0; j < board.raw[i].length; j++) {
          // msg += `${board.raw[i][j]} `
          msg += `||${board.raw[i][j]}|| `
        }
        msg += '\n'

        interaction.channel.send({
          content: msg,
        })
      }
      interaction.channel.send({
        content: 'DONE',
      })
    }
  )

  new command.Slash(
    client,
    ['status'],
    'sets bot status',
    [
      {
        name: 'text',
        type: 'STRING',
        description: 'the text to set the status to',
        required: false,
      },
      {
        name: 'type',
        type: 'STRING',
        description: 'type',
        required: false,
        choices: [
          {
            name: 'Playing',
            value: 'PLAYING',
          },
          {
            name: 'Listening',
            value: 'LISTENING',
          },
          {
            name: 'Competing',
            value: 'COMPETING',
          },
        ],
      },
      {
        name: 'status',
        type: 'STRING',
        description: 'status like online idle dnd',
        required: false,
        choices: [
          {
            name: 'Online',
            value: 'online',
          },
          {
            name: 'Idle',
            value: 'idle',
          },
          {
            name: 'Dnd',
            value: 'dnd',
          },
        ],
      },
    ],
    async (interaction, client) => {
      let text = interaction.options.get('text')
      let type = interaction.options.get('type')
      let status = interaction.options.get('status')

      let obj = util.defaultAct

      if (text != null) obj.activities[0].name = text.value

      if (type != null) {
        if (['PLAYING', 'LISTENING', 'COMPETING'].includes(type.value))
          obj.activities[0].type = type.value
        else
          interaction.reply({
            content: 'Invalid type',
          })
      }

      if (status != null) {
        if (['online', 'idle', 'dnd'].includes(status.value))
          obj.status = status.value
        else
          interaction.reply({
            content: 'Invalid status',
          })
      }

      console.log(obj)

      client.user.setPresence(obj)

      const embed = new Discord.MessageEmbed()
      embed.setTitle('Status')
      embed.setDescription(`Sometimes not instantly set`)
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))
      embed.addField('Status', `- ${obj.status}`)
      embed.addField('Type', `- ${obj.activities[0].type}`)
      embed.addField('Text', `- ${obj.activities[0].name}`)

      interaction.reply({
        embeds: [embed],
      })
    }
  )

  // end
}

export default {
  create,
}
