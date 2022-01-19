/* eslint-disable brace-style */
import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import { execSync } from 'child_process'
import { config } from './utils.js'
import display from './display.js'

// ----
const setDir = async () => {
  const newDestination = (await inquirer.prompt([
    {
      type: 'input',
      name: 'destination',
      message: 'downloads folder',
      default: './downloads/',
      validate: input => {
        // -- TODO: rm whitespace then check
        if (typeof input === 'string' && !!input.replace(/\s/g, '')) return true
        return 'value cannot be empty'
      }
    }
  ])).destination

  const destination = path.resolve(path.resolve(), newDestination)

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

  display.txt.center(`downloads folder set to ${destination}`)
  return destination
}

//  TODO: don't use try/catch for control flow
//        const exists = fs.existsSync()
//        if (exists) { ... }
// ----
const dirStats = path => {
  try {
    const dir = fs.readdirSync(path)
    const stats = {
      isDir: true,
      exists: true,
      empty: !dir.length,
      contents: !dir.length ? false : dir
    }
    return {
      valid: !stats.empty,
      stats,
      path
    }
  }
  catch (err) {
    return {
      valid: false,
      stats: {
        isFile: err.code === 'ENOTDIR',
        exists: err.code !== 'ENOENT',
        empty: true,
        contents: false
      },
      path
    }
  }
}

// ----
const upsertDir = location => { if (!dirStats(location).exists) fs.mkdirSync(location, { recursive: true }) }

// ----
const dirExists = location => {
  const { exists, isFile } = dirStats(location).stats
  return exists && !isFile
}

// ----
const openDir = location => execSync(`open ${location}`)

// ----
const rmDir = location => {
  return fs.rmSync(location, { recursive: true, force: true })
}

// ----
const whichDir = async (options = {}) => {
  if (options.check) {
    try {
      return !!config().destination && dirStats(config().destination).valid
    }
    catch (e) {
      return false
    }
  }
  const basePath = options.set || !config().destination
    ? await setDir()
    : config().destination
  if (options.username) return path.resolve(basePath, options.username)
  return basePath
}

export { whichDir, openDir, rmDir, upsertDir, dirExists, dirStats }
