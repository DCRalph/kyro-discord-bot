import command from '../command.js'
import util from '../util.js'
import Discord from 'discord.js'
import fs from 'fs'

import * as DiscordVoice from '@discordjs/voice'
import ffmpeg from 'ffmpeg'

let running = false

const Player = DiscordVoice.createAudioPlayer()
let connection
let sub = null

let timer1 = null
let timer2 = null

const create = (client) => {
  new command.Slash(
    client,
    ['outro'],
    'leave in style',
    [
      {
        name: 'volume',
        type: 'INTEGER',
        description: 'Volume of outro',
        required: false,
        maxValue: 100,
        minValue: 10
      },
    ],
    async (interaction, client) => {
      if (running) {
        interaction.reply({ content: `in use` })
        return
      }

      const volume = interaction.options.get('volume')

      const v = volume?.value || 50 

      const m = interaction.member

      if (!m.voice.channel) {
        interaction.reply({ content: `${m.displayName} isn't in vc` })
        return
      }

      const vc = m.voice.channel

      connection = DiscordVoice.joinVoiceChannel({
        channelId: vc.id,
        guildId: vc.guild.id,
        adapterCreator: vc.guild.voiceAdapterCreator,
      })

      sub = connection.subscribe(Player)

      const resource = DiscordVoice.createAudioResource(
        fs.createReadStream('./outro-t.wav'),
        {
          inputType: DiscordVoice.StreamType.Arbitrary,
          inlineVolume: true
        }
      )

      resource.volume.setVolume(1)

      Player.play(resource)

      timer1 = new util.Timer(() => {
        if (connection != null) {
          sub.unsubscribe()
          connection.destroy()
          connection = null
        }

        Player.stop()
        running = false
        timer1.stop()
      }, 1000 * 22)

      const say = (t) => {
        interaction.channel.send({
          content: t,
        })
      }

      timer2 = new util.Timer(async () => {
        // say('3')
        // await new Promise((r) => setTimeout(r, 1000))
        // say('2')
        // await new Promise((r) => setTimeout(r, 1000))
        // say('1')
        // await new Promise((r) => setTimeout(r, 1000))

        let ping = ''

        vc.members.forEach((mm) => {
          // if (mm.id == m.id) return
          if (mm.user.bot) return
          ping += `<@${mm.id}>`
        })

        say(ping + '\nI will see you next time. 🫡')

        m.voice.disconnect('chad')
        timer2.stop()
      }, 11000)

      const Row = new Discord.MessageActionRow()

      const Button1 = new Discord.MessageButton()
      Button1.setCustomId('stop-outro')
      Button1.setLabel('Stop outro')
      Button1.setStyle('DANGER')

      Row.setComponents(Button1)

      client.on('interactionCreate', (interaction2) => {
        if (!interaction2.isButton()) return
        if (interaction2.customId == 'stop-outro') {
          if (connection != null) {
            sub.unsubscribe()
            connection.destroy()
            connection = null
          }

          Player.stop()

          timer1.stop()
          timer2.stop()

          running = false

          interaction2.reply({ content: 'Stopped' })
          interaction.deleteReply()
        }
      })

      interaction.reply({
        content: 'playing',
        components: [Row],
      })
      running = true
    }
  )

 
}
export { create }
