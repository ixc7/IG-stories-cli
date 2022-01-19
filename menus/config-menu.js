import { createInterface } from 'readline'
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

async function APIMenu () {
  const selection = (
    await inquirer.prompt([{
      type: 'list',
      name: 'selection',
      message: 'select an option',
      choices: [
        {
          value: 'changeKey',
          name: 'change API key'
        },
        {
          value: 'help',
          name: 'help'
        }
      ]
    }])
  ).selection
  
  const actions = {
    changeKey: async () => {
      if (await checkConfirm()) {
        unsetKey()
        await getSetKey({ set: true })
      }
    },
    help: () => {
      return new Promise((resolve, reject) => {

        const helpTxt = `
          here is the help text.
          it will help you with getting your API key.
          first, you go to rapid API .com
          then you get your API key.



          press <ENTER> to go back
        `

        const rl = createInterface({
          input: process.stdin,
          output: process.stdout
        })

        rl.on('line', () => {
          rl.close()
          resolve()
        })
      
        display.term.reset()
        console.log(helpTxt)
      })
    }
  }

  await actions[selection]() && await configMenu()
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
            value: 'APIKeys',
            // name: 'change API Key'
            name: 'API Keys'
          },
          {
            value: 'folder',
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
    APIKeys: async () => {
      await APIMenu()
      // if (await checkConfirm()) {
        // unsetKey()
        // await getSetKey({ set: true })
      // }
    },
    folder: async () => await checkConfirm() && await whichDir({ set: true }),
    back: () => 'back'
  }

  // loop
  await actions[selection]() !== 'back' && await configMenu()
}
