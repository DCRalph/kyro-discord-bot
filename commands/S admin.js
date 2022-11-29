import command from '../command.js'
import util from '../util.js'
// import fetch from 'node-fetch'
import Discord from 'discord.js'
// import db from '../db.js'
import config from '../config.js'

const create = (client) => {
  new command.Slash(
    client,
    ['unused'],
    'remove unused commands',
    [],
    async (interaction, client) => {
      if (interaction.user.id != config.me) {
        const embed = new Discord.MessageEmbed()

        embed.setTitle(`must be a chad to use this command`)

        embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

        interaction.reply({
          embeds: [embed],
        })

        return
      }

      await interaction.reply({
        content: `starting`,
      })

      const g = await client.guilds.fetch(config.servers[0])
      const c = await g.commands.fetch()

      // const loadedCommands = command.slashs.map((c) => c.name)

      // const unused = cmds.filter((c) => !loadedCommands.includes(c.name))

      // unused.forEach((c) => {
      //   g.commands.delete(c)
      // })

      const cmds = Array.from(c.values())

      cmds.forEach((c) => {
        g.commands.delete(c)
      })

      command.slashs.forEach((c) => {
        c.create(c.data, client)
      })


      const c2 = await g.commands.fetch()
      const cmds2 = Array.from(c2.values())



      const embed = new Discord.MessageEmbed()

      embed.setTitle('Unused Commands')
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))

      // embed.setDescription(`unused: ${unused.length}`)

      // unused.forEach((c) => {
      //   embed.addField(c.name, c.description)
      // })

      embed.addField('not', 'working')

      await interaction.channel.send({
        embeds: [embed],
      })
    }
  )
}
export { create }
