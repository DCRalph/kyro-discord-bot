import command from '../command.js'
import util from '../util.js'
import fetch from 'node-fetch'
import Discord from 'discord.js'
import db from '../db.js'

const create = (client) => {
  new command.Slash(
    client,
    ['list members'],
    'get all members',
    [],
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
}
export { create }
