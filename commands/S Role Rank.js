import command from '../command.js'
// import util from '../util.js'
import fetch from 'node-fetch'
import Discord from 'discord.js'
import db from '../db.js'
import util from '../util.js'

const create = (client) => {
  return new command.Slash(
    client,
    ['role-rank'],
    'Rank members by amount of roles',
    [],
    async (message, args) => {
      const guild = message.guild
      const data = util.serverInfo(client, guild.id)

      let members = data.members

      members = members.sort((a, b) => {
        return b.roles.length - a.roles.length
      })

      console.log(members)
    }
  )
}
export { create }
