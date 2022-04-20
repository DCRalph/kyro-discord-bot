import command from '../command.js'
import util from '../util.js'
// import fetch from 'node-fetch'
import Discord from 'discord.js'
// import db from '../db.js'

const create = (client) => {
  new command.Slash(
    client,
    ['yeet'],
    'yeet command',
    [
      {
        name: 'victim',
        type: 'USER',
        description: 'victim to yeet',
        required: false,
      },
    ],
    async (interaction, client) => {
      let victim = interaction.options.get('victim')

      if (victim == null) {
        victim = interaction.user
      } else {
        victim = victim.user
      }

      let embed = new Discord.MessageEmbed()
      embed.setTitle(`${victim.username} has been yeeted`)
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

      interaction.reply({
        content: `<@${victim.id}>`,
        embeds: [embed],
      })
    }
  )
}
export { create }
