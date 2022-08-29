import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Slash(
    client,
    ['adams-command'],
    'adams command',
    [],
    async (interaction, client) => {
      if (
        ['624324290644279370', '472872051359612945'].includes(
          interaction.user.id
        )
      ) {
        interaction.reply({
          content: 'nigga',
        })
      } else {
        interaction.reply({
          content: 'your not adam',
        })
      }
    }
  )
}
export { create }
