import inquirer from 'inquirer'
import utils from '../actions/utils.js'
import { checkConfirm, checkRepeat } from './inquirer-actions.js'
// import search from '../actions/search.js'
import { whichDir, openDir, rmDir, dirExists, dirStats } from '../actions/directories.js'
import mainMenu from './main-menu.js'
const { config } = utils

// ----
// TODO: refactor to read from downloads dir
//       instead of reading/writing config.json
//       folders are named as instagram usernames already.

export default async function historyMenu () {
  // ----
  // TODO: change to dirStats(config().destination).contents
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
          /*
          {
            value: 'getStories',
            name: 'get latest stories'
          },
          */
          {
            value: 'getDownloads',
            name: 'view downloaded stories'
          },
          {
            value: 'removeDownloads',
            name: 'remove downloaded stories'
          },
          {
            value: 'back',
            name: 'back'
          }
        ]
      }
    ])

    const { username, selection } = answers

    const actions = {
      /*
      async getStories () {
        await search(username)
      },
      */
      getDownloads: async () => {
        const location = await whichDir({ username })

        // ---- if (dirExists(location)) {
        if (dirStats(location).valid) {
          openDir(location)
        } else {
          console.log('no downloads found')
        }
      },
      removeDownloads: async () => {
        const location = await whichDir({ username })
        if (dirExists(location)) {
          if (await checkConfirm()) {
            rmDir(location)
          }
        } else {
          console.log('no downloads found')
        }
      },
      back: async () => {
        await mainMenu()
      }
    }

    if (Object.prototype.hasOwnProperty.call(actions, selection)) await actions[selection]()
    await checkRepeat(historyMenu, mainMenu)
  } else {
    console.log('no search history')
    await mainMenu()
  }
}
