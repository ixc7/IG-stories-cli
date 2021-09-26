import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import { execSync } from 'child_process'
import { config, __dirname } from './utils.js'

/* FILESYSTEM */

// where to save files
async function getDir (
  username,
  options = {
    replace: false
  }
) {
  async function setDir () {
    const input = await inquirer.prompt([
      {
        type: 'input',
        name: 'destination',
        message: 'path',
        default: path.resolve(__dirname, 'downloads'),
        validate (input) {
          if (typeof input === 'string' && !!input) return true
          return 'value cannot be empty'
        }
      }
    ])

    fs.writeFileSync(
      'config.json',
      JSON.stringify({
        ...config(),
        destination: input.destination
      }),
      {
        encoding: 'utf-8'
      },
      2
    )

    return input.destination
  }

  let basePath

  if (config().destination && !options.replace) {
    basePath = config().destination
  } else {
    basePath = await setDir()
  }

  if (!options.replace) {
    return path.resolve(basePath, username)
  }
}

function checkDirExists (location) {
  if (!fs.existsSync(location) || !fs.readdirSync(location).length) {
    return false
  }
  return true
}

function upsertDir (location) {
  if (!fs.existsSync(location)) {
    fs.mkdirSync(location, {
      recursive: true
    })
  }
}

function openDir (location) {
  execSync(`open ${location}`)
}

// delete files
function removeDir (location) {
  fs.readdirSync(location).forEach(function (file) {
    fs.rmSync(path.resolve(location, file))
  })
  fs.rmdirSync(location)
}

export { getDir, openDir, removeDir, upsertDir, checkDirExists }
