import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Slash(
    client,
    ['slay'],
    '',
    [],
    async (interaction, client) => {
      
        interaction.reply({
          content: 'nigga',
        })
      
    }
  )
}
export { create }
