// import { LowSync, JSONFileSync } from 'lowdb'
// import { Low, JSONFile } from 'lowdb'

import fs from 'fs'

interface Statuses {
  online: number
  idle: number
  dnd: number
  offline: number
  total: number
}

interface Games {
  [key: string]: number
}

interface UserDB {
  [key: string]: {
    id: string
    status: string
    last: number
    statuses: Statuses
    games: Games
    username: string
  }
}

interface dbData {
  commandLog: {
    [key: string]: number
  }
  fuckTemplate: {
    [key: string]: string[]
  }
  userDB: {
    [key: string]: {
      id: string
      status: string
      last: number
      statuses: Statuses
      games: Games
      username: string
    }
  }
}

// const db = new LowSync(new JSONFileSync('./db.json'))

// db.read()

// if (typeof db.data?.commandLog === 'undefined') db.data.commandLog = {}
// if (typeof db.data?.fuckTemplate === 'undefined') db.data.fuckTemplate = {}
// if (typeof db.data?.userDB === 'undefined') db.data.userDB: = {}

// db.write()

class DB {
  data: dbData = {
    commandLog: {},
    fuckTemplate: {},
    userDB: {},
  }
  file: string
  constructor(file: string) {
    this.file = file
    this.read()
  }

  read(){
    this.data = JSON.parse(fs.readFileSync(this.file, 'utf8'))
  }

  write(){
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
  }


}

const db = new DB('./db.json')

export default db
