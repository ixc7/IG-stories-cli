/* eslint-disable brace-style */
import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import { execSync } from 'child_process'
import utils from './utils.js'

const { config } = utils

// ----
async function setDir () {
  const destination = (await inquirer.prompt([
    {
      type: 'input',
      name: 'destination',
      message: 'path',
      default: new URL('../DOWNLOADS', import.meta.url).pathname,
      validate (input) {
        if (typeof input === 'string' && !!input) return true
        return 'value cannot be empty'
      }
    }
  ])).destination

  fs.writeFileSync(
    new URL('../config.json', import.meta.url).pathname,
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

// ----
async function whichDir (options = { username: '', set: false }) {
  const basePath = options.set || !config().destination
    ? await setDir()
    : config().destination
  return path.resolve(basePath, options.username)
}

// ----
function dirExists (location) {
  if (!fs.existsSync(location) || !fs.readdirSync(location).length) {
    return false
  }
  return true
}

// TODO: replace dirExists with dirStats
// ----
function dirStats (location) {
  try {
    const dir = fs.readdirSync(location)
    const stats = {
      isDir: true,
      exists: true,
      empty: !dir.length
    }
    return {
      valid: !stats.empty,
      stats
    }
  }
  catch (err) {
    return {
      valid: false,
      stats: {
        isFile: err.code === 'ENOTDIR',
        exists: err.code !== 'ENOENT',
        empty: true
      }
    }
  }
}

// ----
function upsertDir (location) {
  if (!fs.existsSync(location)) {
    fs.mkdirSync(location, {
      recursive: true
    })
  }
}

// ----
function openDir (location) {
  execSync(`open ${location}`)
}

// ----
function rmDir (location) {
  fs.readdirSync(location).forEach(function (file) {
    fs.rmSync(path.resolve(location, file))
  })
  fs.rmdirSync(location)
}

export { whichDir, openDir, rmDir, upsertDir, dirExists, dirStats }
