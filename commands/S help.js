import command from '../command.js'
import util from '../util.js'
// import fetch from 'node-fetch'
import Discord from 'discord.js'
import db from '../db.js'

const create = (client) => {
  new command.Slash(
    client,
    ['help'],
    'Help command',
    [
      {
        name: 'command',
        type: 'STRING',
        description: 'conmmand to get help for',
        required: false,
      },
    ],
    async (interaction) => {
      // let [first, ...rest] = message.content.toLowerCase().split(' ')
      // let cmd = rest.join(' ').trim()
      let cmd = ''

      try {
        cmd = interaction.options.get('command').value
      } catch (e) {
        cmd = ''
      }

      console.log(cmd)

      if (cmd == '') {
        let embed = new Discord.MessageEmbed()
        embed.setTitle('Command List')
        embed.setDescription('Use `/help <command>` to get info on a command')
        embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))
        let commands = {
          commands: [],
          descriptions: [],
        }

        for (let i = 0; i < command.all.length; i++) {
          commands.commands += `**${
            command.all[i].type == 'slash' ? '[/]' : ''
          }${command.all[i].name}**\n`
          commands.descriptions += `${command.all[i].description}\n`
        }

        embed.addField('Command:', commands.commands, true)
        embed.addField('Description:', commands.descriptions, true)

        interaction.reply({
          embeds: [embed],
        })
        return
      }

      let cmdData = command.getCommand(cmd)

      if (cmdData == null) {
        interaction.reply({
          content: 'That command dosent exist.',
        })
        return
      }

      db.read()
      let used = db.data.commandLog[cmdData.name] || -1

      let embed = new Discord.MessageEmbed()
      embed.setTitle(`${cmdData.name}`)
      embed.setColor(util.hslToHex(Math.random() * 360, 100, 50))
      embed.setDescription(`${cmdData.description}`)
      embed.addField('Aliases', `${cmdData.aliases.join(', ')}`)
      embed.addField('Used', `${used}`)
      if (cmdData.coolDown > 0) {
        let timeLeft = Math.round(
          (cmdData.lastUsed + cmdData.coolDown - Date.now()) / 1000
        )
        if (timeLeft < 0) timeLeft = 0
        embed.addField('Cooldown', `${timeLeft}s/${cmdData.coolDown / 1000}s`)
      }

      interaction.reply({
        embeds: [embed],
      })
    }
  )
}
export { create }
