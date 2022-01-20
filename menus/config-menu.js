import { createInterface } from 'readline'
import inquirer from 'inquirer'
import { config } from '../actions/utils.js'
import { getSetKey, unsetKey } from '../actions/apiKeys.js'
import { whichDir, rmDir } from '../actions/directories.js'
import display from '../actions/display.js'
const { reset } = display.term

async function checkConfirm (message = 'proceed?') {
  const { confirm } = (
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message
      }
    ])
  )
  if (!confirm) reset()
  return confirm
}

async function APIMenu () {
  reset()

  const { selection } = (
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
         value: 'showKey',
         name: 'view API key' 
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
  )

  const actions = {
    changeKey: async () => {
      if (await checkConfirm()) {
        unsetKey()
        await getSetKey({ set: true })
      }
    },
    showKey: () => {
      return new Promise((resolve, reject) => {
        const rl = createInterface({
          input: process.stdin,
          output: process.stdout
        })

        rl.on('line', () => {
          rl.close()
          reset()
          resolve()
        })
        
        reset()
        if (config().APIKey) {
          console.log(`
            \rKey: ${config().APIKey}
          
            \rpress <ENTER> to go back
          `)
        } else {
          console.log(`
            \rKey not found.
            \rPlease set one from -> settings -> API Keys -> 'Change API Key'
          
            \rpress <ENTER> to go back
          `)
        }
      })
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
          reset()
          resolve()
        })
      
        reset()
        console.log(helpTxt)
      })
    },
    back: () => 'back'
  }

  await actions[selection]() !== 'back' && await APIMenu()
}

async function downloadsMenu () {
  reset()

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
  reset()

  const { selection } = (
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
  )

  const actions = {
    APIKeys: async () => await APIMenu(),
    downloads: async () => await downloadsMenu(),
    back: () => 'back'
  }
  
  // loop self until back is selected
  await actions[selection]() !== 'back' && await configMenu()
}

export default configMenu
