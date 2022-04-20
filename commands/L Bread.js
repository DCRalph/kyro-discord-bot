import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Leagcy(
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
}
export { create }
