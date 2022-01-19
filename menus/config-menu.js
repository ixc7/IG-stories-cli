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

// TODO make a function so we're not rewriting this.
async function APIMenu () {
  display.term.reset()

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
        },
        {
          value: 'back',
          name: 'back'
        }
      ]
    }])
  ).selection

  // TODO add back button
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
          \rhere is the help text.
          \rit will help you with getting your API key.
          \rfirst, you go to rapid API dot com
          \rthen you get your API key.

          \rpress <ENTER> to go back
        `

        const rl = createInterface({
          input: process.stdin,
          output: process.stdout
        })

        rl.on('line', () => {
          rl.close()
          display.term.reset()
          resolve()
        })
      
        display.term.reset()
        console.log(helpTxt)
      })
    },
    back: () => 'back'
  }

  // loop
  await actions[selection]() !== 'back' && await APIMenu()
}

async function downloadsMenu () {
  display.term.reset()

  const { selection } = await inquirer.prompt(
  [{
    type: 'list',
    name: 'selection',
    message: 'select an option',
    choices: [
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
  }])

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
    folder: async () => await checkConfirm() && await whichDir({ set: true }),
    back: () => 'back'
  }

  await actions[selection]() !== 'back' && await downloadsMenu()
}


async function configMenu () {
  display.term.reset()

  const selection = (
    await inquirer.prompt([
      {
        type: 'list',
        name: 'selection',
        message: 'select an option',
        choices: [
          {
            value: 'APIKeys',
            name: 'API Keys'
          },
          
          // TODO make submenu
          // change folder, clear all (or username), open (or ls)
          /*
           {
            value: 'folder',
            name: 'change downloads folder'
          },
          {
            value: 'unset',
            name: 'clear all downloads'
          },
          */
          
          {
            value: 'downloads',
            name: 'downloads'
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
    APIKeys: async () => await APIMenu(),
    
    // TODO move me
    /*
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
    folder: async () => await checkConfirm() && await whichDir({ set: true }),
    */
    downloads: async () => await downloadsMenu(),
    back: () => 'back'
  }

  // loop
  await actions[selection]() !== 'back' && await configMenu()
}

export default configMenu
