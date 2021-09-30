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

export default async function search (user) {
  // get username
  const username = user || (
    await inquirer.prompt([
      {
        type: 'input',
        name: 'username',
        message: 'instagram username',
        validate (input) {
          if (typeof input === 'string' && !!input) return true
          return 'value cannot be empty'
        }
      }
    ])
  ).username

  // get directory
  const destination = await getSetDir({ username })

  // get data from API
  console.log('fetching data from API')
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

  // if stories are found...
  if (fetched?.data[0]?.story?.data && fetched.data[0].story.data.length) {
    const count = {
      photo: 0,
      video: 0
    }

    // map urls w/ file extensions
    const urls = fetched.data[0].story.data.map(function (item) {
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
      return true
    })

    // mkdir
    upsertDir(destination)
    const urlsToSave = []
    const cols = process.stdout.columns
    const rows = process.stdout.rows














/////////////////////////////////////////////////////////////////////////////////////////



    // for (let i = 0; i < urls.length; i++) {
    ///// START OF FOR LOOP

      /*
      clearScrollBack()
      console.log(
        `found ${count.photo} ${count.photo === 1 ? 'photo' : 'photos'}`,
        `and ${count.video} ${count.video === 1 ? 'video' : 'videos'}`,
        `\nloading story ${i + 1} of ${urls.length} (${urls[i].display})`
      )
      */

      
      // readline.cursorTo(process.stdout, 0, 4)

      

      const preview = spawn(
        path.resolve(__dirname, '../vendor/timg'),
        [
          `-g ${cols - 10}x${rows - 10}`,
          '--center',
          urls[i].url
        ]
      )

      preview.on('close', function (code, signal) {
      // readline.cursorTo(process.stdout, 0, 0) // MOVE CURSOR TO TOP
      // readline.cursorTo(process.stdout, 0, 4) // MOVE CURSOR TO TOP + 4
      // readline.cursorTo(process.stdout, 0, process.stdout.rows) // MOVE CURSOR TO BOTTOM
        // if (urls[i].display === 'video') {
          readline.cursorTo(process.stdout, 0, 0)
          clearScrollBack()
        // }
      })

      preview.stdout.pipe(process.stdout)
      
      
      // preview.stdin.removeAllListeners("data")
      // preview.stderr.removeAllListeners("data")
      // preview.on('close', function () {
      // readline.cursorTo(process.stdout, 0, process.stdout.rows)
      // })
      // readline.cursorTo(process.stdout, 0, process.stdout.rows)



      // inquirer is fucking the video up
      // the video runs and stops and clears the screen on end
      // every time you type a letter into the prompt it just makes new lines of itself across the screen
      // and only the video part in the middle re renders
      // ... idk maybe just use readline

      /*
      const confirmDownload = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'save',
          message: `save ${i + 1}?`
        }
      ])

      if (confirmDownload.save) {
        urlsToSave.push(urls[i])
      }
      */

      // preview.kill('SIGINT')
      // clearScrollBack()








    ///// END OF FOR LOOP
    // }






/////////////////////////////////////////////////////////////////////////////////////////







    // done iterating through stories. clear screen.
    clearScrollBack()

    // if user selected anything to download...
    if (urlsToSave.length) {
      // download it
      await downloadAll(urlsToSave, destination, {
        console: true
      })

      // add to history
      setHistory(username)

      // save username y/n
      const confirmSave = (
        await inquirer.prompt([
          {
            type: 'confirm',
            name: 'save',
            message () {
              return `add '${username}?' to saved?`
            },
            when () {
              return config().users.indexOf(username) === -1
            }
          }
        ])
      ).save

      if (confirmSave) {
        addFavorite(username)
        console.log('saved!')
      }

      // open directory and exit
      execSync(`open ${destination}`)
    }

    // if user selected NOTHING AT ALL to save...
    else {
      console.log('nothing selected')
    }
  }

  // if no stories are found...
  else {
    console.log('nothing found')
  }
}
