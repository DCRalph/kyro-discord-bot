import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Leagcy(client, ['sus', 'baka'], 'sussy baka', async (message) => {
    message.channel.send({
      files: [
        'https://cdn.discordapp.com/attachments/766784398032764958/945924971035783210/sus.mp3',
      ],
    })
  })
}
export { create }
