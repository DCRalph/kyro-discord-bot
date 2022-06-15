import command from '../command.js'
// import util from '../util.js'
import fetch from 'node-fetch'
import Discord, { Interaction } from 'discord.js'
import db from '../db.js'
import util from '../util.js'

const create = (client) => {
  return new command.Slash(
    client,
    ['role-rank'],
    'Rank members by amount of roles',
    [],
    async (interaction) => {
      const guild = interaction.guild
      const data = await util.serverInfo(client, guild.id)

      // console.log(data)

      let members = data.members

      // members = members.sort((a, b) => {
      //   return b.member.roles.length - a.member.roles.length
      // })

      let usernames = ''
      let roles = ''

      members.forEach((m) => {
        usernames += `${m.user.username}\n`
        roles += `${m.member.roles.length}\n`
        console.log(m.member.roles)
      })

      let embed = new Discord.MessageEmbed()
      embed.setTitle('Role Rank')

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
