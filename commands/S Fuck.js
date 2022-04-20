import command from '../command.js'
import util from '../util.js'
// import fetch from 'node-fetch'
import Discord from 'discord.js'
import db from '../db.js'

const create = (client) => {
  new command.Slash(
    client,
    ['fuck'],
    'mmmmmm',
    [
      {
        name: 'victim1',
        type: 'USER',
        description: 'victim 1 to fuck',
        required: false,
      },
      {
        name: 'victim2',
        type: 'USER',
        description: 'victim 2 to fuck',
        required: false,
      },
      {
        name: 'victim3',
        type: 'USER',
        description: 'victim 3 to fuck',
        required: false,
      },
      {
        name: 'victim4',
        type: 'USER',
        description: 'victim 4 to fuck',
        required: false,
      },
      {
        name: 'victim5',
        type: 'USER',
        description: 'victim 5 to fuck',
        required: false,
      },
      {
        name: 'template',
        type: 'STRING',
        description:
          '[x] you, [y] is victim 1, [z] is victim 2, [a] is victim 3, [b] is victim 4, [c] is victim 5',
        required: false,
      },
    ],
    async (interaction, client) => {
      let victim1 = interaction.options.get('victim1')
      let victim2 = interaction.options.get('victim2')
      let victim3 = interaction.options.get('victim3')
      let victim4 = interaction.options.get('victim4')
      let victim5 = interaction.options.get('victim5')
      let userTemplate = interaction.options.get('template')

      let fucking = [interaction]

      if (victim1 != null) fucking.push(victim1)
      if (victim2 != null) fucking.push(victim2)
      if (victim3 != null) fucking.push(victim3)
      if (victim4 != null) fucking.push(victim4)
      if (victim5 != null) fucking.push(victim5)

      let msg = ''
      let template = ''
      let dupe = false

      if (userTemplate != null) {
        template = userTemplate.value

        db.read()
        db.data.fuckTemplate[fucking.length].forEach((t) => {
          if (t.toLowerCase() == template.toLowerCase()) {
            dupe = true
          }
        })

        if (!dupe) {
          db.data.fuckTemplate[fucking.length].push(template)
          db.write()
        }
      } else {
        db.read()
        template =
          db.data.fuckTemplate[fucking.length][
            Math.floor(
              Math.random() * db.data.fuckTemplate[fucking.length].length
            )
          ]
      }

      if (fucking.length >= 1)
        template = template.replaceAll('[x]', fucking[0].member.displayName)

      if (fucking.length >= 2)
        template = template.replaceAll('[y]', fucking[1].member.displayName)
      if (fucking.length >= 3)
        template = template.replaceAll('[z]', fucking[2].member.displayName)
      if (fucking.length >= 4)
        template = template.replaceAll('[a]', fucking[3].member.displayName)
      if (fucking.length >= 5)
        template = template.replaceAll('[b]', fucking[4].member.displayName)
      if (fucking.length >= 6)
        template = template.replaceAll('[c]', fucking[5].member.displayName)

      msg = util.sanitizer(template)

      let embed = new Discord.MessageEmbed()
      if (msg.length < 256) embed.setTitle(msg)
      else if (msg.length < 5980) {
        embed.setTitle('FUCK')
        embed.setDescription(msg)
      } else {
        embed.setTitle('FUCK')
        embed.setDescription('FUCK TOO LONG')
      }
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

      interaction.reply({
        // content: `<@${victim.id}>`,
        embeds: [embed],
      })
    }
  )
}
export { create }
