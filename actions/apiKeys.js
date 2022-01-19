import fs from 'fs'
import inquirer from 'inquirer'
import { config } from './utils.js'
const file = new URL('../config.json', import.meta.url).pathname

// ---- set/return key from file
const getSetKey = async (options = { set: false }) => {
  const res = config().APIKey && !options.set
    ? config().APIKey
    : (await inquirer.prompt([
        {
          type: 'input',
          name: 'APIKey',
          message: 'API key:',
          validate: input => {
            if (typeof input === 'string' && !!input) return true
            return 'API key cannot be empty'
          }
        }
      ])).APIKey

  const updated = JSON.stringify({ ...config(), APIKey: res }, 0, 2)
  fs.writeFileSync(file, updated, { encoding: 'utf-8' })
  return res
}

// ---- delete key from file
const unsetKey = () => {
  const updated = JSON.stringify({ ...config(), APIKey: '' }, 0, 2)
  fs.writeFileSync(file, updated, { encoding: 'utf-8' })
}

export { getSetKey, unsetKey }
