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

function goto (x = process.stdout.columns, y = 0) {
  clearScrollBack()
  readline.cursorTo(process.stdout, x, y)
}

function centerText (x = process.stdout.columns, y = 0, msg = 'msg') { 
  goto(Math.floor((x / 2) - (msg.length / 2)), y)
  process.stdin.write(`${msg}\n`)
}

async function getMedia () {
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

function showMedia (int = 0, max = 1, data = []) {
  if (int === max) {
    console.log('done')
    process.exit(0)
  }
  
  centerText(process.stdout.columns, 0, `preview ${int + 1} of ${max}`)
  readline.emitKeypressEvents(process.stdin)
  process.stdin.setRawMode(true)

  let gotKeypress = false

  const preview = spawn(
    path.resolve(__dirname, '../vendor/timg'),
    [
      `-g ${process.stdout.columns}x${process.stdout.rows - 4}`,
      '--center',
      data[int].url,
      data[int].type === 'jpg' ? '-w 5' : ''
    ]
  )

  preview.on('close', async function (code, signal) {
  
    process.stdin.removeAllListeners('keypress')
    
    if (gotKeypress === true) {

      goto(0, 0)
      showMedia((int + 1), max, data)
      
    } else {
    
        process.stdin.on('keypress', function (str) {
          if (str === 'y') {
            goto(0, 0)
            process.stdin.removeAllListeners('keypress')
            showMedia((int + 1), max, data)
          } else if (str === 'n') {
            goto(0, 0)
            process.stdin.removeAllListeners('keypress')
            showMedia((int + 1), max, data)
          } else if (str === 'q') {
            process.exit(1)
          }
      })
      
    }
  })

  process.stdin.on('keypress', function (str) {
    gotKeypress = true
    if (str === 'y') {
      preview.kill()
    } else if (str === 'n') {
      preview.kill()
    } else if (str === 'q') {
      process.exit(1)
    }
  })

  preview.stdout.pipe(process.stdout)
}

async function init () {
  centerText(process.stdout.columns, 0, `'y' = save, 'n' = skip, 'q' = quit`)
  const stories = await getMedia()
  showMedia(0, (stories.length - 1), stories)
}

init()





