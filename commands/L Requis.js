import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Legacy(client, ['requis'], 'lord requis', async (message) => {
    message.channel.send({
      files: [
        'https://cdn.discordapp.com/attachments/700110467049193523/965923204407365692/avatars-qFNWvHxdUwvGWEQZ-taPVRA-t240x240.jpg',
      ],
    })
  })
}
export { create }
