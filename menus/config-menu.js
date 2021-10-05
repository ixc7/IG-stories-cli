import inquirer from 'inquirer'
import { checkConfirm, checkRepeat } from '../actions/inquirer-actions.js'
import { getSetKey, unsetKey } from '../actions/keys.js'
// import { removeAllFavorites } from '../actions/favorites.js'
import { unsetHistory } from '../actions/history.js'
import { whichDir } from '../actions/directories.js'
import mainMenu from './main-menu.js'

export default async function configMenu () {
  const selection = (
    await inquirer.prompt([
      {
        type: 'list',
        name: 'selection',
        message: 'select an option',
        choices: [
          {
            value: 'changeAPIKey',
            name: 'change API Key'
          },
          {
            value: 'changeDownloadsFolder',
            name: 'change downloads folder'
          },
          {
            value: 'clearHistory',
            name: 'clear history'
          },
          {
            value: 'back',
            name: 'back'
          }
        ]
      }
    ])
  ).selection

  const actions = {
    async changeAPIKey () {
      if (await checkConfirm()) {
        unsetKey()
        await getSetKey({
          set: true
        })
      }
    },
    async changeDownloadsFolder () {
      if (await checkConfirm()) {
        await whichDir({
          set: true
        })
      }
    },
    async clearHistory () {
      if (await checkConfirm()) {
        unsetHistory()
      }
    },
    async back () {
      await mainMenu()
    }
  }

  await actions[selection]()
  await checkRepeat(configMenu, mainMenu)
}
