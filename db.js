import { LowSync, JSONFileSync } from 'lowdb'
// import { Low, JSONFile } from 'lowdb'

const db = new LowSync(new JSONFileSync('./db.json'))
// const db = new Low(new JSONFile('./db.json'))

db.read()
// db.data ||= {
//   commandLog: {},
// }
db.write()

export default db
