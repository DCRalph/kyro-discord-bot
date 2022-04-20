import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Leagcy(client, ['possum'], 'possum', async (message) => {
    message.channel.send({
      files: [
        'https://cdn.discordapp.com/attachments/766784398032764958/946547367828656199/9k.png',
      ],
    })
  })
}
export { create }
