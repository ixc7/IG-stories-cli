import inquirer from 'inquirer'
import searchMenu from './search-menu.js'
import configMenu from './config-menu.js'

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
          value: 'exit',
          name: 'exit'
        }
      ]
    }
  ])

  const actions = {
    search: async () => {
      await searchMenu()
      await mainMenu()
    },
    config: async () => {
      await configMenu()
      await mainMenu()
    },
    exit: async () => {
      console.log('goodbye')
      process.exit(0)
    }
  }

  await actions[answers.selection]()
}

export default mainMenu
