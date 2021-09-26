import inquirer from 'inquirer'
import { search } from '../actions/search.js'
import favoritesMenu from './favorites-menu.js'
import historyMenu from './history-menu.js'
import configMenu from './config-menu.js'

/* MAIN MENU */

export default async function mainMenu () {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'submenu',
      message: 'select an option',
      choices: [
        {
          value: 'newSearch',
          name: 'download stories'
        },
        {
          value: 'favoritesMenu',
          name: 'view saved users'
        },
        {
          value: 'historyMenu',
          name: 'view search history'
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

  const submenuMap = {
    async newSearch () {
      await search()
      await mainMenu()
    },
    favoritesMenu,
    historyMenu,
    configMenu,
    exit () {
      return console.log('goodbye')
    }
  }

  await submenuMap[answers.submenu]()
}

export { mainMenu }
