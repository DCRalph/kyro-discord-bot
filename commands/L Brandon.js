import command from '../command.js'
import util from '../util.js'
import fetch from 'node-fetch'
import Discord from 'discord.js'
import db from '../db.js'

const create = (client) => {
  new command.Leagcy(client, ['brandon ='], 'yes', async (message) => {
    let [first, ...rest] = message.content
      .toLowerCase()
      .replace('brandon =', '')
      .split(' ')
    let cmd = rest.join(' ').trim()

    const requis = () => {
      message.channel.send({
        files: [
          'https://cdn.discordapp.com/attachments/700110467049193523/965923204407365692/avatars-qFNWvHxdUwvGWEQZ-taPVRA-t240x240.jpg',
        ],
      })
    }

    console.log(cmd)

    if (cmd.includes('thicc')) {
      return requis()
    }

    if (cmd.includes('massive') && cmd.includes('dumpy')) {
      return requis()
    }

    message.channel.send('wrong')
  })
}
export { create }
