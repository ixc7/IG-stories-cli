import inquirer from 'inquirer'
import { search } from '../actions/search.js'
// import { getDir, checkDirExists, openDir, removeDir } from '../actions/directories.js'
// import { config, checkRepeat, checkConfirm } from '../actions/utils.js'
// import { removeFavorite, removeAllFavorites } from '../actions/favorites.js'
// import { clearHistory } from '../actions/history.js'
// import { getAPIKey, clearAPIKey } from '../actions/apiKeys.js'
import favoritesMenu from './favorites.js'
import historyMenu from './history.js'
import configMenu from './config.js'

/* MAIN MENU */

async function mainMenu () {
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

/* FAVORITES */

/* HISTORY */

/* CONFIG */

/* INIT */
// mainMenu()

export { mainMenu }
