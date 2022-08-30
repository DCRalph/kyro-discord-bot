import { LowSync, JSONFileSync } from 'lowdb'
// import { Low, JSONFile } from 'lowdb'

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
      statuses: { [key: string]: Statuses }
      games: Games
      username: string
    }
  }
}

const adapter = new JSONFileSync<dbData>('./db.json')

const db = new LowSync<dbData>(adapter)

db.read()

if (db.data == null) {
  db.data = {
    commandLog: {},
    fuckTemplate: {},
    userDB: {},
  }
}

db.write()

export default db
