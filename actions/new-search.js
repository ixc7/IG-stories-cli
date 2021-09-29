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

async function search () {

  const count = {
    photo: 0,
    video: 0
  }
  const filesToSave = []
  const cols = process.stdout.columns
  const rows = process.stdout.rows
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


  const preview = spawn(
    path.resolve(__dirname, '../vendor/timg'),
    [
    `-g ${cols - 10}x${rows - 10}`,
    '--center',
    files[0].url
    ]
  )


  preview.on('close', function (code, signal) {
    readline.cursorTo(process.stdout, 0, 0)
    clearScrollBack()
  })


  preview.stdout.pipe(process.stdout)  

}


search()

