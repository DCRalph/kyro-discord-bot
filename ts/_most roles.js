import fs from 'fs'

let data2 = fs.readFileSync('./data.json')
let json = JSON.parse(data2)

let roles = []

json.members.forEach((e) => {
  roles.push([e.user.username, e.member.roles.length])
})

roles = roles.sort((a, b) => {
  return b[1] - a[1]
})

console.log(roles)
