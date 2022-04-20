import command from '../command.js'
import util from '../util.js'
// import fetch from 'node-fetch'
// import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Slash(
    client,
    ['minesweeper'],
    'play minesweaper',
    [
      {
        name: 'size',
        type: 'STRING',
        description: 'x,y Defalut is 10,10',
        required: false,
      },
      {
        name: 'bombs',
        type: 'NUMBER',
        description: 'bombs Defalut is 30',
        required: false,
      },
    ],
    async (interaction, client) => {
      let sizeIN = interaction.options.get('size')
      let bombsIN = interaction.options.get('bombs')

      let size = [10, 10]
      let bombs = 30

      if (sizeIN != null) {
        size = sizeIN.value.split(',').map((x) => parseInt(x))
      }

      if (bombsIN != null) {
        bombs = bombsIN.value
      }

      // console.log(size, bombs)

      if (size[0] > 50) {
        interaction.reply({
          content: 'Size X too big',
        })
        return
      }

      if (size[1] > 50) {
        interaction.reply({
          content: 'Size Y too big',
        })
        return
      }

      if (bombs > size[0] * size[1]) {
        interaction.reply({
          content: 'Too many bombs',
        })
        return
      }

      interaction.reply({
        content: 'MINESWEEPER',
      })

      let board = util.mineSweeper(size, bombs)

      let row = board.raw[0].length
      // let col = board.raw.length

      // let rowsPer = Math.floor(sendPer / row)

      for (let i = 0; i < board.raw.length; i++) {
        let msg = ''

        for (let j = 0; j < board.raw[i].length; j++) {
          // msg += `${board.raw[i][j]} `
          msg += `||${board.raw[i][j]}|| `
        }
        msg += '\n'

        interaction.channel.send({
          content: msg,
        })
      }
      interaction.channel.send({
        content: 'DONE',
      })
    }
  )
}
export { create }
