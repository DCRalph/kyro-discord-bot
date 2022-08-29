import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Legacy(
    client,
    ['hmmm'],
    'hmmm',
    async (message) => {
      message.channel.send({
        content: 'hmmm',
      })
    },
    60000
  )
}
export { create }
