import { LowSync, JSONFileSync } from 'lowdb'
// import { Low, JSONFile } from 'lowdb'

const db = new LowSync(new JSONFileSync('./db.json'))
// const db = new Low(new JSONFile('./db.json'))

db.read()

if (typeof db.data.commandLog === 'undefined') db.data.commandLog = {}
if (typeof db.data.fuckTemplate === 'undefined') db.data.fuckTemplate = {}
if (typeof db.data.userDB === 'undefined') db.data.userDB = {}

db.write()

export default db
