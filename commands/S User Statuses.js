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
    'Status time and user status history',
    [
      {
        name: 'user',
        type: 'USER',
        description: 'user to get status history for',
        required: false,
      },
    ],
    async (interaction) => {
      const u = interaction.options.get('user')

      if (u?.user.bot) {
        const embed = new Discord.MessageEmbed()

        embed.setTitle(
          `${u.user.username} is a bot. Can not get status of bot.`
        )
        embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

        interaction.reply({
          embeds: [embed],
        })
        return
      }

      if (u) {
        if (typeof db.data.userDB[u.user.id] == 'undefined') {
          const embed = new Discord.MessageEmbed()

          embed.setTitle(`${u.user.username} not found`)
          embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

          interaction.reply({
            embeds: [embed],
          })
          return
        }

        const g = await client.guilds.fetch(u.member.guild.id)
        const m = await g.members.fetch(u.user.id)

        util.userStatuses(m)

        db.read()

        const userDB = db.data.userDB[u.user.id]

        let embed = new Discord.MessageEmbed()
        embed.setTitle(`${u.user.username}'s status history`)
        embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

        embed.addField('Status:', userDB.status, false)

        embed.addField('Online Time:', pms(userDB.statuses.online), true)
        embed.addField('Idle Time:', pms(userDB.statuses.idle), true)
        embed.addField('\u200b', '\u200b', true)

        embed.addField('DND Time:', pms(userDB.statuses.dnd), true)
        embed.addField(
          'Total Time:',
          pms(
            userDB.statuses.online + userDB.statuses.idle + userDB.statuses.dnd
          ),
          true
        )
        embed.addField('\u200b', '\u200b', true)

        embed.addField('Offline Time:', pms(userDB.statuses.offline), false)

        const games = Object.entries(userDB.games).sort((a, b) => {
          return b[1] - a[1]
        })

        embed.addField('Games:', `#${games.length}`, false)
        if (games.length > 0) {
          // let gameString = ''
          // games.forEach((g) => {
          //   gameString += `${g[0]}: ${pms(g[1])}\n`
          // })
          // embed.addField('Games:', gameString, false)

          embed.addField(`${g[0]}: ${pms(g[1])}`, '\u200b', true)
        }

        // games.forEach((g) => {
        //   embed.addField(g[0], pms(g[1]), false)
        // })

        interaction.reply({
          embeds: [embed],
        })

        return
      } else {
        db.read()
        const users = Object.values(db.data.userDB)

        const g = await client.guilds.fetch(interaction.guild.id)
        const m = await g.members.fetch()

        users.forEach((u) => {
          const m2 = m.get(u.id)
          if(m2) util.userStatuses(m2)
        })

        db.read()

        const sorted = Object.values(db.data.userDB).sort((a, b) => {
          let A = a.statuses.total
          let B = b.statuses.total
          return B - A
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
          time += `${pms(u.statuses.total)}\n`
        })
        embed.addField('Rank:', rank, true)
        embed.addField('Username:', usernames, true)
        embed.addField('Time:', time, true)

        interaction.reply({
          embeds: [embed],
        })
      }

      return
    }
  )
}
export { create }
