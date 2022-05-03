import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Slash(
    client,
    ['test'],
    'test command',
    [],
    async (interaction, client) => {
      await interaction.reply({
        content: `Test 1`,
      })
      await interaction.reply({
        content: `Test 1`,
      })

      await interaction.channel.send({
        content: `Test 2`,
      })
    }
  )
}
export { create }
