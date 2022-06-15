import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Legacy(
    client,
    ['frog'],
    'a sexy man in a frog hat',
    async (message) => {
      message.channel.send({
        files: [
          'https://cdn.discordapp.com/attachments/766784398032764958/945924885337751572/frog.png',
        ],
      })
    }
  )
}
export { create }
