import inquirer from 'inquirer'
import { config } from '../actions/utils.js'
import { checkRepeat } from '../actions/inquirer-actions.js'
import { search } from '../actions/search.js'
import { getDir, openDir, removeDir, checkDirExists } from '../actions/directories.js'
import { removeFavorite } from '../actions/favorites.js'
import mainMenu from './main-menu.js'

export default async function favoritesMenu () {
  if (config().users.length) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'username',
        message: 'select a user',
        choices: config().users
      },
      {
        type: 'list',
        name: 'action',
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
          },
          {
            value: 'removeSaved',
            name: 'remove from saved'
          }
        ]
      },
      {
        type: 'confirm',
        name: 'confirmRemove',
        message (response) {
          return `remove '${response.username}?' from saved?`
        },
        when (response) {
          return response.action === 'removeSaved'
        }
      }
    ])

    const username = answers.username
    const location = await getDir(username)

    const favoritesMap = {
      async getStories () {
        await search(username)
      },
      getDownloads () {
        if (checkDirExists(location)) {
          openDir(location)
        } else {
          console.log('no downloads found')
        }
      },
      removeDownloads () {
        if (checkDirExists(location)) {
          removeDir(location)
        } else {
          console.log('no downloads found')
        }
      },
      removeSaved () {
        removeFavorite(username)
      }
    }

    await favoritesMap[answers.action]()
    await checkRepeat(favoritesMenu, mainMenu)
  } else {
    console.log('no saved users')
    await mainMenu()
  }
}
