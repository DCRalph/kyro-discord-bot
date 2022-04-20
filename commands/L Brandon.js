import command from '../command.js'
import util from '../util.js'
import fetch from 'node-fetch'
import Discord from 'discord.js'
import db from '../db.js'

const create = (client) => {
  new command.Leagcy(
    client,
    ['does Brandon have a massive dump'],
    'yes',
    async (message) => {
      let [first, ...rest] = message.content.toLowerCase().split(' ')
      let cmd = rest.join(' ').trim()

      const requis = () => {
        message.channel.send({
          content: ':requis:',
        })
      }

      if (cmd === 'yes') {
        requis()
      }
    }
  )
}
export { create }
