import chalk from 'chalk'

const log = console.log

const red = chalk.red
const green = chalk.green
const yellow = chalk.yellow
const blue = chalk.blue
const magenta = chalk.magenta
const cyan = chalk.cyan
const white = chalk.white

export default {
  c: {
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    white,
  },
  log: log,
  error: (...args: any) => log(red(...args)),
  warning: (...args: any) => log(yellow(...args)),
  info: (...args: any) => log(blue(...args)),
  success: (...args: any) => log(green(...args)),
  debug: (...args: any) => log(magenta(...args)),
}
