import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Legacy(client, ['amogus'], 'amogus', async (message) => {
    message.channel.send({
      content:
        'https://tenor.com/view/19dollar-fortnite-card-among-us-amogus-sus-red-among-sus-gif-20549014',
    })
  })
}
export { create }
