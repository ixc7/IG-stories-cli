import inquirer from 'inquirer'
import { checkConfirm } from '../actions/inquirer-actions.js'
import { getSetKey, unsetKey } from '../actions/keys.js'
import { whichDir } from '../actions/directories.js'
// import { unsetHistory } from '../actions/history.js'

export default async function configMenu () {
  const selection = (
    await inquirer.prompt([
      {
        type: 'list',
        name: 'selection',
        message: 'select an option',
        choices: [
          {
            value: 'apiKey',
            name: 'change API Key'
          },
          {
            value: 'destination',
            name: 'change downloads folder'
          },

          /*
            TODO: a) delete everything from destination folder
                  b) list destination contents, select items to delete
                  c) if nothing found exit
          */

          /*
            {
              value: 'unset',
              name: 'clear history'
            },
          */

          {
            value: 'back',
            name: 'back'
          }
        ]
      }
    ])
  ).selection

  const actions = {
    apiKey: async () => {
      if (await checkConfirm()) {
        unsetKey()
        await getSetKey({ set: true })
      }
    },
    destination: async () => await checkConfirm() && await whichDir({ set: true }),
    // unset: async () => await checkConfirm() && unsetHistory(),
    back: () => 'back'
  }

  await actions[selection]() !== 'back' && await configMenu()
}
