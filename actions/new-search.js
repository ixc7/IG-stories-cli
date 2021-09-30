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
  
  if (int === max) {
    console.log('done')
    process.exit(0)
  }

  // goto(0, 0)
  // console.log(`rendering ${int + 1} of ${max}`)
  
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
      `-g ${cols}x${rows - 2}`,
      '--center',
      '-pq',
      data[int].url,
      data[int].type === 'jpg' ? '-w 7' : ''
    ]
  )

  preview.on('close', function (code, signal) {
    goto(0, 0)
    showPreview((int + 1), max, data)
  })
  
  preview.stdout.pipe(process.stdout)
}


(async function() {

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.input.on('keypress', function () {
  // readline.cursorTo(process.stdout, 0, process.stdout.rows)
  console.clear()
  readline.cursorTo(process.stdout, 0, 0)
})

  console.log('fetching data...')
  const stories = await getStories()
  console.log('success...')
  showPreview(0, (stories.length - 1), stories)
})()

