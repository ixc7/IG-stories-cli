import inquirer from 'inquirer'
import { checkConfirm } from '../actions/inquirer-actions.js'
import { getSetKey, unsetKey } from '../actions/keys.js'
import { unsetHistory } from '../actions/history.js'
import { whichDir } from '../actions/directories.js'

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
          {
            value: 'unset',
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
    apiKey: async () => await checkConfirm() &&
      unsetKey() && await getSetKey({ set: true }),
    destination: async () => await checkConfirm() && await whichDir({ set: true }),
    unset: async () => await checkConfirm() && unsetHistory(),
    back: () => 'exit'
  }

  await actions[selection]() !== 'exit' && await configMenu()
}
