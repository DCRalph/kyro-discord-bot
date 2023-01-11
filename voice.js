import util from '../util.js'
import Discord from 'discord.js'
import fs from 'fs'

import * as DiscordVoice from '@discordjs/voice'
import ffmpeg from 'ffmpeg'
import { nanoid } from 'nanoid'

let running = false

const Player = DiscordVoice.createAudioPlayer()
let connection = null
let sub = null



class Voice {
  constructor() {

  }
}
