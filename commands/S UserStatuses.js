import command from '../command.js'
import fetch from 'node-fetch'
import Discord, { Interaction } from 'discord.js'
import db from '../db.js'
import util from '../util.js'

import pms from 'pretty-ms'

const create = (client) => {
  new command.Slash(
    client,
    ['user-status'],
    'Get user status history',
    [
      {
        name: 'user',
        type: 'USER',
        description: 'user to get status history for',
        required: false,
      },
    ],
    async (interaction) => {
      let user = interaction.options.get('user')

      if (!user) {
        interaction.reply('You must specify a user')
        return
      }

      db.read()

      if (typeof db.data.userDB[user.user.id] == 'undefined') {
        interaction.reply('User not found')
        return
      }

      const userDB = db.data.userDB[user.user.id]

      let embed = new Discord.MessageEmbed()
      embed.setTitle(`${user.user.username}'s status history`)
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

      embed.addField('Status:', userDB.status, false)
      embed.addField('Online Time:', pms(userDB.statuses.online), false)
      embed.addField('Idle Time:', pms(userDB.statuses.idle), false)
      embed.addField('DND Time:', pms(userDB.statuses.dnd), false)
      embed.addField('Offline Time:', pms(userDB.statuses.offline), false)

      const games = Object.entries(userDB.games).sort((a, b) => {
        return b[1] - a[1]
      })

      if (games.length > 0) {
        let gameString = ''
        games.forEach((g) => {
          gameString += `${g[0]}: ${pms(g[1])}\n`
        })
        embed.addField('Games:', gameString, false)
      }

      // games.forEach((g) => {
      //   embed.addField(g[0], pms(g[1]), false)
      // })

      interaction.reply({
        embeds: [embed],
      })

      return
    }
  )

  new command.Slash(
    client,
    ['status-rank'],
    'rank users by amount of status',
    [],
    async (interaction) => {
      db.read()

      const users = Object.values(db.data.userDB)

      const sorted = users.sort((a, b) => {
        return b.statuses.online - a.statuses.online
      })

      let embed = new Discord.MessageEmbed()
      embed.setTitle('Status Rank')
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

      embed.setDescription(
        'Do `/user-status <user>` to get more info on a user'
      )
      embed.setFooter({ text: `${sorted.length} users` })

      let rank = ''
      let usernames = ''
      let time = ''
      sorted.forEach((u, i) => {
        rank += `${i + 1}\n`
        usernames += `${u.username}\n`
        time += `${pms(u.statuses.online)}\n`
      })
      embed.addField('Rank:', rank, true)
      embed.addField('Username:', usernames, true)
      embed.addField('Time:', time, true)

      interaction.reply({
        embeds: [embed],
      })

      return
    }
  )
}
export { create }
