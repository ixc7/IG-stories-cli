import inquirer from 'inquirer'
import { checkConfirm, checkRepeat } from '../actions/inquirer-actions.js'
import { getSetKey, unsetKey } from '../actions/keys.js'
// import { removeAllFavorites } from '../actions/favorites.js'
import { unsetHistory } from '../actions/history.js'
import { getSetDir } from '../actions/directories.js'
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
            value: 'setKey',
            name: 'edit API Key' // edit/reset
          },
          {
            value: 'setDir',
            name: 'edit destination folder' // edit/reset
          },
          {
            value: 'history',
            name: 'clear history' // enable/disable/reset/go to history prompt
          }
          //,
          // {
          //   value: 'saved',
          //   name: 'clear saved users' // enable/disable/reset/ go to saved prompt
          // }
        ]
      }
    ])
  ).selection

  const actions = {
    async setKey () {
      if (await checkConfirm()) {
        unsetKey()
        await getSetKey({
          set: true
        })
      }
    },
    async setDir () {
      if (await checkConfirm()) {
        await getSetDir({
          set: true
        })
      }
    },
    async history () {
      if (await checkConfirm()) {
        unsetHistory()
      }
    }
    //,
    // async saved () {
    //   if (await checkConfirm()) {
    //     removeAllFavorites()
    //   }
    // }
  }

  await actions[selection]()
  await checkRepeat(configMenu, mainMenu)
}
