import fs from 'fs'
import db from './db.js'

const defaultAct = {
  status: 'online',
  activities: [
    {
      name: 'cock and ball torture',
      type: 'PLAYING',
    },
  ],
}

class Timer {
  constructor(fn, t, state = true) {
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

const hslToHex = (h, s, l) => {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

const serverInfo = async (client, id) => {
  const g = await client.guilds.fetch(id)
  const m = await g.members.fetch()

  let mArr = []

  m.forEach((member) => {
    let obj = {
      member: member,
      user: member.user,
      presence: member.presence,
    }

    mArr.push(obj)
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

const presenceFilter = async () => {
  memberArr.forEach((member) => {
    if (member.presence) {
      if (member.presence.activities.length > 0) {
        // console.log(member.user.username)
        // console.log(member.presence.activities)

        // if (member.presence.activities[0].type === 'PLAYING' && member.presence.activities[0].name === 'League of Legends') {
        //   if (typeof memberData[member.user.id]['league-of-legends'] != 'undefined') {
        //     let timeDiff = Math.abs(new Date() - memberData[member.user.id]['league-of-legends'])

        //     if (timeDiff > 1000 * 1 * 60 * 10) {
        //       member.member.send('actually stop playing league of legends')
        //     }
        //   } else {
        //     member.member.send('stop playing league of legends')
        //     memberData[member.user.id]['league-of-legends'] = new Date()
        //     console.log(member.user.username + ': stop playing league of legends')
        //   }
        // }

        if (
          member.presence.activities[0].type === 'PLAYING' &&
          member.presence.activities[0].name === 'osu!'
        ) {
          console.log(member.custom)
          if (typeof memberData[member.user.id]['osu'] != 'undefined') {
            let timeDiff = Math.abs(
              new Date() - memberData[member.user.id]['osu']
            )

            if (timeDiff > 1000 * 1 * 60 * 10) {
              member.member.send('actually playing osu!')
            }
          } else {
            member.member.send('stop playing osu!')
            memberData[member.user.id]['osu'] = new Date()
            console.log(member.user.username + ': stop playing osu!')
          }
        }
      }
    }
  })
}

const sanitizer = (str) => {
  str = str.replaceAll('_', '\\_')

  return str
}

const mineSweeper = (size, bombs) => {
  const empty = '❌'
  const bomb = '💣'
  const numbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']
  const field = Array(size[1])
    .fill()
    .map(() => Array(size[0]).fill(empty))

  for (let i = 0; i < bombs; i++) {
    let x = Math.floor(Math.random() * size[0])
    let y = Math.floor(Math.random() * size[1])

    if (field[y][x] == empty) field[y][x] = bomb
    else i--
  }

  const checkAround = (x, y, what) => {
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



export default {
  defaultAct,
  Timer,
  hslToHex,
  serverInfo,
  sanitizer,
  mineSweeper,
  
}
