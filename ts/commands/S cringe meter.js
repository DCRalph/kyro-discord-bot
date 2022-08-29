import command from '../command.js'
import fetch from 'node-fetch'
import Discord, { Interaction } from 'discord.js'
import db from '../db.js'
import util from '../util.js'

import pms from 'pretty-ms'

const create = (client) => {
  new command.Slash(
    client,
    ['cringe-meter'],
    'ranks based on games played',
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

        embed.setTitle(`${u.user.username} is a bot. Bots are Gigachad`)
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

        const { cringe, chad, texts } = util.calcCringe(userDB.games)


        const embed = new Discord.MessageEmbed()
        embed.setTitle(`${u.user.username}'s cringe meter`)
        embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

        embed.addField('Cringe/Chad', `${cringe}/${chad}`)

        texts.forEach((text) => {
          embed.addField(text.game, text.text)
        })

        interaction.reply({
          embeds: [embed],
        })

        return
      } else {
        db.read()
        const users1 = Object.values(db.data.userDB)

        const g = await client.guilds.fetch(interaction.guild.id)
        const m = await g.members.fetch()

        users1.forEach((u) => {
          const m2 = m.get(u.id)
          util.userStatuses(m2)
        })

        db.read()
        const users = Object.values(db.data.userDB)
        const sorted = users
          .map((u) => {
            return { ...u, cringe: util.calcCringe(u.games) }
          })
          .sort((a, b) => {
            let A = a.cringe.cringe / a.cringe.chad
            let B = b.cringe.cringe / b.cringe.chad
            return B - A
          })

        let embed = new Discord.MessageEmbed()
        embed.setTitle('Cringe Meter')
        embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

        embed.setFooter({ text: `${sorted.length} users` })

        let rank = ''
        let usernames = ''
        let cringeChad = ''
        sorted.forEach((u, i) => {
          rank += `${i + 1}\n`
          usernames += `${u.username}\n`
          cringeChad += `${u.cringe.cringe}/${u.cringe.chad}\n`
        })

        embed.addField('Rank', rank, true)
        embed.addField('Usernames', usernames, true)
        embed.addField('Cringe/Chad', cringeChad, true)

        interaction.reply({
          embeds: [embed],
        })

        return
      }

      return
    }
  )
}
export { create }
