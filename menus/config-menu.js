import inquirer from 'inquirer'
import { getSetKey, unsetKey } from '../actions/apiKeys.js'
import { whichDir, rmDir } from '../actions/directories.js'
import display from '../actions/display.js'

async function checkConfirm (message = 'proceed?') {
  const selection = (
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'checkConfirm',
        message
      }
    ])
  ).checkConfirm

  if (!selection) display.term.reset()
  return selection
}

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
            name: 'clear all downloads'
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
    unset: async () => {
      if (await checkConfirm()) {
        if (await whichDir({ check: true })) {
          rmDir(await whichDir())
          display.txt.center('cleared')
        } else {
          display.txt.center('no downloads')
        }
      }
    },
    apiKey: async () => {
      if (await checkConfirm()) {
        unsetKey()
        await getSetKey({ set: true })
      }
    },
    destination: async () => await checkConfirm() && await whichDir({ set: true }),
    back: () => 'back'
  }

  await actions[selection]() !== 'back' && await configMenu()
}
