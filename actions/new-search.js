/* eslint-disable */

import path from 'path'
import readline from 'readline'
import { spawn, execSync } from 'child_process'
import inquirer from 'inquirer'
import axios from 'axios'
import { __dirname, config, downloadAll, clearScrollBack } from './utils.js'
import { getSetDir, upsertDir } from './directories.js'
import { addFavorite } from './favorites.js'
import { setHistory } from './history.js'
import { getSetKey } from './keys.js'

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
  const msg = `${int + 1} of ${max} (y: save, n: skip, q: quit)`
  const cols = process.stdout.columns
  const rows = process.stdout.rows
  const center= Math.floor((cols / 2) - (msg.length / 2))

  if (int === max) {
    console.log('done')
    process.exit(0)
  }

  goto(center, 0, function () {
    process.stdin.write(`${msg}\n`)
  })

  const preview = spawn(
    path.resolve(__dirname, '../vendor/timg'),
    [
      `-g ${cols}x${rows - 2}`,
      '--center',
      data[int].url,
      data[int].type === 'jpg' ? '-w 1' : ''
    ]
  )

  preview.on('close', function (code, signal) {
    goto(0, 0)
    process.stdin.removeListener('keypress', function() {})
    showPreview((int + 1), max, data)
  })

  preview.stdout.pipe(process.stdout)
  readline.emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)
  
  process.stdin.once('keypress', function (str) {
    if (str === 'y') {
      // do something here...
      preview.kill()
    } else if (str === 'n') {
      preview.kill()
    } else if (str === 'q') {
      process.exit(1)
    }
  })
}

async function init () {
  goto(0, 0)
  console.log('fetching data...')
  const stories = await getStories()
  showPreview(0, (stories.length - 1), stories)
}

init()

