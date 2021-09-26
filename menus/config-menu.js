import inquirer from 'inquirer'
import { checkConfirm, checkRepeat } from '../actions/inquirer-actions.js'
import { getAPIKey, clearAPIKey } from '../actions/keys.js'
import { removeAllFavorites } from '../actions/favorites.js'
import { clearHistory } from '../actions/history.js'
import { getDir } from '../actions/directories.js'
import mainMenu from './main-menu.js'

export default async function configMenu () {
  const selection = (
    await inquirer.prompt([
      {
        type: 'list',
        name: 'selection',
        message: 'select a field to edit',
        choices: [
          {
            value: 'APIKey',
            name: 'edit API Key' // edit/reset
          },
          {
            value: 'destination',
            name: 'edit destination folder' // edit/reset
          },
          {
            value: 'history',
            name: 'clear history' // enable/disable/reset/go to history prompt
          },
          {
            value: 'saved',
            name: 'clear saved users' // enable/disable/reset/ go to saved prompt
          }
        ]
      }
    ])
  ).selection

  const actions = {
    async APIKey () {
      if (await checkConfirm()) {
        clearAPIKey()
        await getAPIKey({
          replace: true
        })
      }
    },
    async destination () {
      if (await checkConfirm()) {
        await getDir(null, {
          replace: true
        })
      }
    },
    async history () {
      if (await checkConfirm()) {
        clearHistory()
      }
    },
    async saved () {
      if (await checkConfirm()) {
        removeAllFavorites()
      }
    }
  }

  await actions[selection]()
  await checkRepeat(configMenu, mainMenu)
}
