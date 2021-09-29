/* eslint-disable */

import path from 'path'
import { execSync, spawn } from 'child_process'
import inquirer from 'inquirer'
import readline from 'readline'
import axios from 'axios'
import { __dirname, config, downloadAll, clearScrollBack } from './utils.js'
import { getSetDir, upsertDir } from './directories.js'
import { addFavorite } from './favorites.js'
import { setHistory } from './history.js'
import { getSetKey } from './keys.js'

/*
  https://stackoverflow.com/a/38317377
*/

async function getStories () {

  const count = {
    photo: 0,
    video: 0
  }
  const filesToSave = []

  const username = 'alice'
  const destination = await getSetDir({ username })

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
  // return showPreview(0, files.length)
  // showPreview(0, files.length, files)
}


// function showPreview (int = 0, max = 1, data = []) {
function showPreview (int, max, data) {  
  console.log(`rendering ${int + 1} of ${max}`)
  const cols = process.stdout.columns
  const rows = process.stdout.rows
  
  if (int === max) {
    console.log('done')
    process.exit(0)
  }

  const preview = spawn(
    path.resolve(__dirname, '../vendor/timg'),
    [
      `-g ${cols - 10}x${rows - 10}`,
      '--center',
      data[int].url,
      data[int].type === 'jpg' ? '-w 7' : ''
    ]
  )

  preview.on('close', function (code, signal) {
    readline.cursorTo(process.stdout, 0, 0)
    clearScrollBack()
    showPreview((int + 1), max, data)
  })
  
  preview.stdout.pipe(process.stdout)  
}


// getStories()

(async function() {
  console.log('fetching data...')
  const stories = await getStories()
  console.log('success...')
  showPreview(0, (stories.length - 1), stories)
  // const
})()

