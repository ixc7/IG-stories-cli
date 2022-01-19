import inquirer from 'inquirer'
import searchMenu from './search-menu.js'
import configMenu from './config-menu.js'
import display from '../actions/display.js'

const mainMenu = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'selection',
      message: 'select an option',
      choices: [
        {
          value: 'search',
          name: 'search for a username'
        },
        {
          value: 'config',
          name: 'settings'
        },
        {
          value: 'quit',
          name: 'quit'
        }
      ]
    }
  ])

  const actions = {
    search: async () => {
      display.term.reset()
      await searchMenu()
      await mainMenu()
    },
    config: async () => {
      display.term.reset()
      await configMenu()
      display.term.reset()
      await mainMenu()
    },
    quit: async () => {
      // display.txt.center('exit')
      console.log('quit')
      process.exit(0)
    }
  }

  await actions[answers.selection]()
}

export default mainMenu
