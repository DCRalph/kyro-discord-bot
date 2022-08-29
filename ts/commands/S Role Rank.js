import command from '../command.js'
// import util from '../util.js'
import fetch from 'node-fetch'
import Discord, { Interaction } from 'discord.js'
import db from '../db.js'
import util from '../util.js'

const create = (client) => {
  new command.Slash(
    client,
    ['role-rank'],
    'Rank members by amount of roles',
    [],
    async (interaction) => {
      const guild = interaction.guild
      const data = await util.serverInfo(client, guild.id)

      // console.log(data)

      let members = data.members

      members = members.sort((a, b) => {
        return (
          b.member.roles.cache.map((e) => e).length -
          a.member.roles.cache.map((e) => e).length
        )
      })

      let usernames = ''
      let roles = ''
      let rank = ''

      members.forEach((m, i) => {
        rank += `${i + 1}\n`
        usernames += `${m.user.username}\n`
        roles += `${m.member.roles.cache.map((e) => e).length}\n`
      })

      let embed = new Discord.MessageEmbed()
      embed.setTitle('Role Rank')
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

      embed.addField('Rank:', rank, true)
      embed.addField('Username:', usernames, true)
      embed.addField('Roles:', roles, true)

      interaction.reply({
        embeds: [embed],
      })
      return
    }
  )
}
export { create }
