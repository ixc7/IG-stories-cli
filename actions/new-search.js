/* eslint-disable */

import path from 'path'
import readline from 'readline'
import { spawn } from 'child_process'
import inquirer from 'inquirer'
import axios from 'axios'
import { __dirname, config, downloadAll, clearScrollBack } from './utils.js'
import { getSetDir, upsertDir } from './directories.js'
import { addFavorite } from './favorites.js'
import { setHistory } from './history.js'
import { getSetKey } from './keys.js'
import ansi from '../vendor/ansi-escapes.mjs'


function goto (x, y, after = () => {}) {
  clearScrollBack()
  readline.cursorTo(process.stdout, x, y, after)
}


async function getStories () {
  const username = 'alice'
  const destination = await getSetDir({ username })
  const filesToSave = []
  const count = {
    photo: 0,
    video: 0
  }

  const fetched = await axios.request({
    method: 'GET',
    url: 'https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile',
    params: {
      ig: username,
      response_type: 'story'
    },
    headers: {
      'x-rapidapi-host': 'instagram-bulk-profile-scrapper.p.rapidapi.com',
      'x-rapidapi-key': await getSetKey()
    }
  })

  const files = fetched.data[0].story.data.map(function (item) {
    if (item.media_type === 1) {
      count.photo += 1
      return {
        url: item.image_versions2.candidates[0].url,
        type: 'jpg',
        display: 'image'
      }
    } else if (item.media_type === 2) {
      count.video += 1
      return {
        url: item.video_versions[0].url,
        type: 'mp4',
        display: 'video'
      }
    }
  })

  upsertDir(destination)
  return files
}


function showPreview (int = 0, max = 1, data = []) {

  
  // const rl = readline.createInterface(process.stdin)
  readline.emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)
  process.stdin.on('keypress', function (str, key) {
    // clearScrollBack()
    // console.clear()
    // goto(0, 0)
    // if (str === 's') process.exit(1)
    // process.stdout.write('\x1b[D')
    // readline.moveCursor(process.stdout, -1, 0)
    // readline.cursorTo(process.stdout, 0, process.stdout.rows)
  })
  
  if (int === max) {
    console.log('done')
    process.exit(0)
  }

  
  const msg = `rendering ${int + 1} of ${max}`
  const cols = process.stdout.columns
  const rows = process.stdout.rows
  const center= Math.floor((cols / 2) - (msg.length / 2))

  goto(center, 0, function () {
    process.stdin.write(`${msg}\n`)
  })
  
  const preview = spawn(
    path.resolve(__dirname, '../vendor/timg'),
    [
      // `-g ${cols}x${rows - 2}`,
      // '--center',
      `-g 60x${rows - 2}`,
      data[int].url,
      data[int].type === 'jpg' ? '-w 7' : ''
    ],
    {
      // in, out, err | 0, 1, 2
      stdio: ['ignore', 'pipe', 'ignore']
    }
  )

  preview.on('close', function (code, signal) {
    goto(0, 0)
    showPreview((int + 1), max, data)
  })
  
  preview.stdout.pipe(process.stdout)
}


async function init () {
  console.log('fetching data...')
  const stories = await getStories()
  console.log('success...')
  showPreview(0, (stories.length - 1), stories)
}

init()

