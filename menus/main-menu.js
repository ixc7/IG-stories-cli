import inquirer from 'inquirer'
import searchMenu from './search-menu.js'
import historyMenu from './history-menu.js'
import configMenu from './config-menu.js'

export default async function mainMenu () {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'selection',
      message: 'select an option',
      choices: [
        {
          value: 'searchMenu',
          name: 'search for a username'
        },
        {
          value: 'historyMenu',
          name: 'view downloads'
        },
        {
          value: 'configMenu',
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
    searchMenu,
    historyMenu,
    configMenu,
    exit () {
      console.log('goodbye')
      process.exit(0)
    }
  }

  await actions[answers.selection]()
}
