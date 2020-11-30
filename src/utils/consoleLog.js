const figlet = require('figlet')
const chalk = require('chalk')

const printConsoleLog = {}

printConsoleLog.print = function () {
  console.log('process.env.NODE_ENV', process.env.NODE_ENV)
  if (process.env.NODE_ENV === 'development') {
    console.log(chalk.yellow(figlet.textSync('Cloud Miao', {
      font: 'big',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    })))
  }
}

module.exports = printConsoleLog
