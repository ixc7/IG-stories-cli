import inquirer from 'inquirer'
import utils from '../actions/utils.js'
import { checkRepeat } from '../actions/inquirer-actions.js'
import search from '../actions/search.js'
import { getSetDir, openDir, removeDir, checkDirExists } from '../actions/directories.js'
import mainMenu from './main-menu.js'
const { config } = utils

export default async function historyMenu () {
  if (config().history.length) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'username',
        message: 'select a user',
        choices: config().history
      },
      {
        type: 'list',
        name: 'selection',
        message: 'select an action',
        choices: [
          {
            value: 'getStories',
            name: 'get latest stories'
          },
          {
            value: 'getDownloads',
            name: 'view downloaded stories'
          },
          {
            value: 'removeDownloads',
            name: 'remove downloaded stories'
          }
          // (optional): remove from history, add to saved
        ]
      }
    ])

    const { username, selection } = answers

    const actions = {
      async getStories () {
        await search(username)
      },
      async getDownloads () {
        const location = await getSetDir({ username })
        if (checkDirExists(location)) {
          openDir(location)
        } else {
          console.log('no downloads found')
        }
      },
      async removeDownloads () {
        const location = await getSetDir({ username })
        // TODO: add a confirm Y/N step
        if (checkDirExists(location)) {
          removeDir(location)
        } else {
          console.log('no downloads found')
        }
      }
    }

    if (Object.prototype.hasOwnProperty.call(actions, selection)) await actions[getSelection]()
    await checkRepeat(historyMenu, mainMenu)
  } else {
    console.log('no search history')
    await mainMenu()
  }
}
