import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import { execSync } from 'child_process'
import utils from './utils.js'
const { config } = utils

async function setDir () {
  const destination = (await inquirer.prompt([
    {
      type: 'input',
      name: 'destination',
      message: 'path',
      // default: path.resolve(path.resolve(), 'downloads'),
      default: new URL('../DOWNLOADS', import.meta.url).pathname,
      validate (input) {
        if (typeof input === 'string' && !!input) return true
        return 'value cannot be empty'
      }
    }
  ])).destination

  fs.writeFileSync(
    new URL('../../config.json', import.meta.url).pathname,
    // '../../config.json',
    JSON.stringify({
      ...config(),
      destination
    }, 0, 2),
    {
      encoding: 'utf-8'
    },
    2
  )
  return destination
}

// directory to save files
async function getSetDir (options = { username: '', set: false }) {
  const basePath = options.set || !config().destination
    ? await setDir()
    : config().destination

  return path.resolve(basePath, options.username)
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

function removeDir (location) {
  fs.readdirSync(location).forEach(function (file) {
    fs.rmSync(path.resolve(location, file))
  })
  fs.rmdirSync(location)
}

export { getSetDir, openDir, removeDir, upsertDir, checkDirExists }
