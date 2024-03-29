import fs from 'fs'
import db from './db.js'
import log from './logger.js'
import Discord from 'discord.js'

// interface Act {
//   name: string
//   type: string
// }

// interface defaultAct {
//   status: string
//   activities: Act[]
// }

const defaultAct: Discord.PresenceData = {
  status: 'online',
  activities: [
    {
      name: 'cock and ball torture',
      type: 'PLAYING',
    },
  ],
}

// interface Timer {
//   fn: () => void
//   t
//   state

// }

class Timer {
  fn: () => void
  t: number
  state: boolean
  timer: NodeJS.Timer | undefined
  constructor(fn: () => void, t: number, state: boolean = true) {
    this.fn = fn
    this.t = t
    this.state = state
    if (this.state) this.timer = setInterval(fn, t)
  }

  stop = () => {
    if (this.state) {
      this.state = false
      clearInterval(this.timer)
    }
  }

  start = () => {
    if (!this.state) {
      this.state = true
      this.timer = setInterval(this.fn, this.t)
    }
  }

  reset = (nt = this.t) => {
    this.t = nt
    this.stop()
    this.start()
  }
}

const hslToHex = (h: number, s: number, l: number): Discord.ColorResolvable => {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

interface mArr {
  member: Discord.GuildMember
  user: Discord.User
  presence: Discord.Presence | null
}

const serverInfo = async (client: Discord.Client, id: string) => {
  const g = await client.guilds.fetch(id)
  const m = await g.members.fetch()

  let mArr: mArr[] = []

  m.forEach((member) => {
    mArr.push({
      member: member,
      user: member.user,
      presence: member.presence,
    })
  })

  let data = {
    guild: g,
    members: mArr,
  }

  fs.writeFile('./data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) throw err
    console.log('The file has been saved!')
  })

  return data
}

const sanitizer = (str: string) => {
  return str.replaceAll('_', '\\_')

  return str
}

const mineSweeper = (size: number[], bombs: number) => {
  const empty = '❌'
  const bomb = '💣'
  const numbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
  const field = Array(size[1])
    .fill(null)
    .map(() => Array(size[0]).fill(empty))

  for (let i = 0; i < bombs; i++) {
    let x = Math.floor(Math.random() * size[0])
    let y = Math.floor(Math.random() * size[1])

    if (field[y][x] == empty) field[y][x] = bomb
    else i--
  }

  const checkAround = (x: number, y: number, what: string) => {
    let around = []

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i == 0 && j == 0) continue
        if (x + i < 0 || x + i >= size[0]) continue
        if (y + j < 0 || y + j >= size[1]) continue

        if (field[y + j][x + i] == what) {
          around.push([x + i, y + j])
        }
      }
    }

    return around
  }

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (field[i][j] == empty) {
        // let count = 0

        // if (i > 0 && j > 0 && field[i - 1][j - 1] == bomb) count++
        // if (i > 0 && field[i - 1][j] == bomb) count++
        // if (i > 0 && j < field[i].length - 1 && field[i - 1][j + 1] == bomb)
        //   count++
        // if (j > 0 && field[i][j - 1] == bomb) count++
        // if (j < field[i].length - 1 && field[i][j + 1] == bomb) count++
        // if (i < field.length - 1 && j > 0 && field[i + 1][j - 1] == bomb)
        //   count++
        // if (i < field.length - 1 && field[i + 1][j] == bomb) count++
        // if (
        //   i < field.length - 1 &&
        //   j < field[i].length - 1 &&
        //   field[i + 1][j + 1] == bomb
        // )
        //   count++

        let count = checkAround(j, i, bomb).length

        field[i][j] = numbers[count]
      }
    }
  }

  // function zeroReplace(field) {
  //   for (let i = 0; i < field.length; i++) {
  //     for (let j = 0; j < field[i].length; j++) {
  //       if (field[i][j] != numbers[0]) continue

  //       let around = checkAround(j, i, numbers[0])

  //       if (around.length < 1) continue

  //       let count = 1

  //     }
  //   }
  // }

  let out = { raw: field, text: '', spoiler: '' }
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      // out += `||${field[i][j]}||`
      //   out += `${field[i][j]}`
      out.text += `${field[i][j]}`
      out.spoiler += `||${field[i][j]}||`
    }
    // out += '\n'
    out.text += '\n'
    out.spoiler += '\n'
  }
  // console.log(out, out.length)
  return out
}

const userStatuses = (gMember: Discord.GuildMember) => {
  db.read()
  if (db.data == null) return

  const now = Date.now()

  const status = gMember.presence?.status || 'offline'

  if (typeof db.data.userDB[gMember.user.id] == 'undefined') {
    db.data.userDB[gMember.user.id] = {
      id: gMember.user.id,
      status: status,
      username: gMember.user.username,
      last: now,
      statuses: {
        online: 0,
        idle: 0,
        dnd: 0,
        offline: 0,
        total: 0,
      },
      games: {},
    }
  }

  const oldStatus = db.data.userDB[gMember.user.id].status

  db.data.userDB[gMember.user.id].username = gMember.user.username

  log.info(
    `${log.c.magenta(gMember.user.username)} changed status from ${log.c.red(
      oldStatus
    )} to ${log.c.red(status)}`
  )

  if (['online', 'idle', 'dnd', 'offline'].includes(oldStatus)) {
    db.data.userDB[gMember.user.id].statuses[oldStatus] +=
      now - db.data.userDB[gMember.user.id].last
  } else {
    console.log('invalid status')
  }

  if (gMember.presence?.activities.length > 0) {
    const games = gMember.presence.activities
    games.forEach((game) => {
      if (!['PLAYING', 'LISTENING'].includes(game.type)) return

      if (
        typeof db.data.userDB[gMember.user.id].games[game.name] == 'undefined'
      ) {
        db.data.userDB[gMember.user.id].games[game.name] = 0
      }
      db.data.userDB[gMember.user.id].games[game.name] +=
        now - db.data.userDB[gMember.user.id].last
    })
  }

  db.data.userDB[gMember.user.id].statuses.total =
    db.data.userDB[gMember.user.id].statuses.online +
    db.data.userDB[gMember.user.id].statuses.idle +
    db.data.userDB[gMember.user.id].statuses.dnd

  db.data.userDB[gMember.user.id].last = now
  db.data.userDB[gMember.user.id].status = status

  db.write()
}

const calcCringe = (games) => {
  let cringe = 0
  let chad = 0
  let texts = []

  const has = (obj, word) => {
    return Object.keys(obj).some((key) => {
      return key.toLowerCase().includes(word.toLowerCase())
    })
  }

  const addText = (game, text) => {
    texts.push({ game, text })
  }

  const times = {
    hour: 3600000,
    minute: 60000,
    day: 86400000,
    week: 604800000,
    month: 2592000000,
    year: 31536000000,
  }

  if (has(games, 'League of Legends')) {
    let time = games['League of Legends']

    if (time < times.hour) {
      cringe += 100
      addText(
        'League of Legends',
        'Your have league of legends on your computer. Burn it.'
      )
    } else if (time < times.day) {
      cringe += 500
      addText('League of Legends', 'Please get help before its too late.')
    } else if (time < times.week) {
      cringe += 1000
      addText(
        'League of Legends',
        'Your a lost cause. Nothing can be done to save you.'
      )
    }
  }

  if (has(games, 'Overwatch')) {
    let time = games['Overwatch']

    if (time < times.hour) {
      cringe += 10
      addText('Overwatch', 'Play Overwatch more.')
    } else if (time < times.day) {
      chad += 10
      addText('Overwatch', 'Play Overwatch more.')
    } else if (time < times.month) {
      cringe += 20
      addText('Overwatch', 'Good job.')
    } else if (time > times.month) {
      cringe += 10
      chad += 100
      addText('Overwatch', 'Touch grass.')
    }
  }

  if (has(games, 'Minecraft')) {
    let time = games['Minecraft']

    if (time < times.day) {
      chad += 10
    } else if (time < times.week) {
      chad += 20
      addText('Minecraft', 'Dedication')
    } else if (time < times.month) {
      chad += 50
      addText('Minecraft', 'Serious dedication')
    } else if (time > times.month) {
      chad += 100
      addText('Minecraft', 'Minecraft chad.')
    }
  }

  return { cringe, chad, texts }
}

export default {
  defaultAct,
  Timer,
  hslToHex,
  serverInfo,
  sanitizer,
  mineSweeper,
  userStatuses,
  calcCringe,
}
