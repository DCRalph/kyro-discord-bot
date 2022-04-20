import command from '../command.js'
import util from '../util.js'
// import fetch from 'node-fetch'
import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Slash(
    client,
    ['status'],
    'sets bot status',
    [
      {
        name: 'text',
        type: 'STRING',
        description: 'the text to set the status to',
        required: false,
      },
      {
        name: 'type',
        type: 'STRING',
        description: 'type',
        required: false,
        choices: [
          {
            name: 'Playing',
            value: 'PLAYING',
          },
          {
            name: 'Listening',
            value: 'LISTENING',
          },
          {
            name: 'Competing',
            value: 'COMPETING',
          },
        ],
      },
      {
        name: 'status',
        type: 'STRING',
        description: 'status like online idle dnd',
        required: false,
        choices: [
          {
            name: 'Online',
            value: 'online',
          },
          {
            name: 'Idle',
            value: 'idle',
          },
          {
            name: 'Dnd',
            value: 'dnd',
          },
        ],
      },
    ],
    async (interaction, client) => {
      let text = interaction.options.get('text')
      let type = interaction.options.get('type')
      let status = interaction.options.get('status')

      let obj = util.defaultAct

      if (text != null) obj.activities[0].name = text.value

      if (type != null) {
        if (['PLAYING', 'LISTENING', 'COMPETING'].includes(type.value))
          obj.activities[0].type = type.value
        else
          interaction.reply({
            content: 'Invalid type',
          })
      }

      if (status != null) {
        if (['online', 'idle', 'dnd'].includes(status.value))
          obj.status = status.value
        else
          interaction.reply({
            content: 'Invalid status',
          })
      }

      console.log(obj)

      client.user.setPresence(obj)

      const embed = new Discord.MessageEmbed()
      embed.setTitle('Status')
      embed.setDescription(`Sometimes not instantly set`)
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))
      embed.addField('Status', `- ${obj.status}`)
      embed.addField('Type', `- ${obj.activities[0].type}`)
      embed.addField('Text', `- ${obj.activities[0].name}`)

      interaction.reply({
        embeds: [embed],
      })
    }
  )
}
export { create }
