import fs from 'fs'
import inquirer from 'inquirer'
import { config } from './utils.js'

/* API KEYS */

// get/set API key
async function getSetKey (
  options = {
    set: false
  }
) {
  const newKey =
    config().APIKey && !options.set
      ? config().APIKey
      : (
          await inquirer.prompt([
            {
              type: 'input',
              name: 'APIKey',
              message: 'rapidAPI key',
              validate (input) {
                if (typeof input === 'string' && !!input) return true
                return 'value cannot be empty'
              }
            }
          ])
        ).APIKey

  const updated = JSON.stringify(
    {
      ...config(),
      APIKey: newKey
    },
    null,
    2
  )
  fs.writeFileSync('config.json', updated, {
    encoding: 'utf-8'
  })

  return newKey
}

// unset API key
function unsetKey () {
  const updated = JSON.stringify(
    {
      ...config(),
      APIKey: ''
    },
    null,
    2
  )
  fs.writeFileSync('config.json', updated, {
    encoding: 'utf-8'
  })
}

export { getSetKey, unsetKey }
