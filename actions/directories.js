/* eslint-disable brace-style */
import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer'
import { execSync } from 'child_process'
import utils from './utils.js'

const { config } = utils

// ----
const setDir = async () => {
  const destination = (await inquirer.prompt([
    {
      type: 'input',
      name: 'destination',
      message: 'path',
      default: new URL('../DOWNLOADS', import.meta.url).pathname,
      validate: input => {
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
const whichDir = async (options = { username: false, set: false }) => {
  const basePath = options.set || !config().destination
    ? await setDir()
    : config().destination
  if (options.username) return path.resolve(basePath, options.username)
  return basePath
}

//  TODO: replace dirExists with dirStats
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
const upsertDir = location => {
  if (!dirStats(location).exists) {
    fs.mkdirSync(location, {
      recursive: true
    })
  }
}

// ----
const dirExists = location => {
  const { exists, isFile } = dirStats(location).stats
  return exists && !isFile
}

// ----
const openDir = location => {
  execSync(`open ${location}`)
}

// ----
const rmDir = location => {
  fs.readdirSync(location).forEach(file => {
    fs.rmSync(path.resolve(location, file))
  })
  fs.rmdirSync(location)
}

export { whichDir, openDir, rmDir, upsertDir, dirExists, dirStats }
