import inquirer from 'inquirer'
import searchMenu from './search-menu.js'
// import historyMenu from './history-menu.js'
import configMenu from './config-menu.js'

export default async function mainMenu () {
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
        /*
        {
          value: 'historyMenu',
          name: 'view downloads'
        },
        */
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
    async search () {
      await searchMenu()
      await mainMenu()
    },
    // historyMenu,
    async config () {
      await configMenu()
      await mainMenu()
    },
    exit () {
      console.log('goodbye')
      process.exit(0)
    }
  }

  await actions[answers.selection]()
  // mainMenu()
}
