import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Command(
    client,
    ['david is sexy asian'],
    'Try to keep ur pants on',
    async (message) => {
      message.channel.send({
        content:
          'https://tenor.com/view/deez-nuts-chungus-reddit-cum-wholesome-gif-20085745',
      })
    }
  )
}
export { create }
