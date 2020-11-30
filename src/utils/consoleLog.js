const figlet = require('figlet')
const chalk = require('chalk')

const printConsoleLog = {}

printConsoleLog.print = function () {
  if (process.env.NODE_ENV === 'development') {
    console.log(chalk.italic.yellow(figlet.textSync('Cloud Miao', {
      font: 'big',
      horizontalLayout: 'fitted',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    })))
  }
}

module.exports = printConsoleLog
