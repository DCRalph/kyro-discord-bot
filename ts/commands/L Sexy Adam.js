import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Legacy(
    client,
    ['sexy adam', 'sexy frog', 'sexy frog hat boy'],
    'sexy adam',
    async (message) => {
      let times = message.content.split(' ')
      times = parseInt(times[times.length - 1])
      if (times == 'NaN' || isNaN(times)) times = 1

      for (let i = 0; i < times; i++) {
        message.channel.send({
          files: [
            'https://cdn.discordapp.com/attachments/689709940696416383/945938458071937024/Screenshot_20220223-195406_Snapchat.jpg',
          ],
        })
      }
    }
  )
}
export { create }
