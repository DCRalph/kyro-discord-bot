import command from '../command.js'
// import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Leagcy(client, ['ping'], 'Gets ping(ms)', async (message) => {
    const m = await message.channel.send({
      content: 'Ping?',
    })
    m.edit(`Pong! ${m.createdTimestamp - message.createdTimestamp}ms`)
  })
}
export { create }
