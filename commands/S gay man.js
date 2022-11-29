import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Slash(
    client,
    ['slay'],
    'slay',
    [],
    async (interaction, client) => {
      
        interaction.reply({
          content: 'https://cdn.discordapp.com/attachments/688142239817662502/881739512215126046/Screenshot_2021-07-09-16-08-34-23.jpg',
        })
      
    }
  )
}
export { create }
