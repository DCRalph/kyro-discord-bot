import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Command(client, ['sexy shrek'], 'sexy shrek', async (message) => {
    message.channel.send({
      files: [
        'https://cdn.discordapp.com/attachments/689709940696416383/945931738180386846/IMG_0776.JPG',
      ],
    })
  })
}
export { create }
