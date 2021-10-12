import { fork } from 'child_process'
import inquirer from 'inquirer'
import display from '../actions/display.js'

const searchMenu = async () => {
  display.term.reset()

  const username = (await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'username'
    }
  ])).username

  return new Promise((resolve, reject) => {
    const searchLoop = fork(
      new URL('../search/index.js', import.meta.url).pathname,
      [username]
    )
    searchLoop.on('close', () => resolve())
  })
}

export default searchMenu
