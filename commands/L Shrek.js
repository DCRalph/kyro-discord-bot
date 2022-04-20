import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Command(client, ['shrek'], 'shrek', async (message) => {
    message.channel.send({
      files: [
        'https://cdn.discordapp.com/attachments/766784398032764958/945925099851227136/e2.jpeg',
      ],
    })
  })
}
export { create }
