/* eslint-disable */
import path from 'path'
import readline from 'readline'
import { spawn } from 'child_process'
import axios from 'axios'
import { getSetKey } from './keys.js'
import { getSetDir, upsertDir } from './directories.js'
import { __dirname, clearScrollBack } from './utils.js'

// util

function goto (x = process.stdout.columns, y = 0) {
  clearScrollBack()
  readline.cursorTo(process.stdout, x, y)
}

function centerText (x = process.stdout.columns, y = 0, msg = 'msg') {
  goto(Math.floor((x / 2) - (msg.length / 2)), y)
  process.stdin.write(`${msg}\n`)
}

// fetch

async function getMedia (username = 'alice') {
  const destination = await getSetDir({ username })

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

  if (fetched?.data[0]?.story?.data && fetched.data[0].story.data.length) {
    // eslint-disable-next-line array-callback-return
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

  centerText(process.stdout.columns, 0, 'nothing found')
  process.exit(0)
}

// timg

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

  preview.stdout.pipe(process.stdout)

  // TODO : use signals instead (?)
  
  preview.on('close', async function () {
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
          process.kill(process.pid, 'SIGINT')
        }
      })
    }
  })

  // TODO: preview.kill(preview.pid, <signal>)
  //       could use an object instead of if/else.
  //       https://man7.org/linux/man-pages/man7/signal.7.html
  //       SIGUSR1, SIGUSR2: User-defined signals
  
  process.stdin.on('keypress', function (str) {
    gotKeypress = true
    if (str === 'y') {
      preview.kill()
    } else if (str === 'n') {
      preview.kill()
    } else if (str === 'q') {
      process.kill(process.pid, 'SIGINT')
    }
  })
}

// process handler(s)

process.on('SIGINT', function () {
  const cleanup = spawn('tput', ['reset'])
  cleanup.stdout.pipe(process.stdout)
  cleanup.on('close', function () {
    console.log('exit')
    process.exit(0)
  })
})

// init

async function search (username = 'mary') {
  centerText(process.stdout.columns, 0, '\'y\' = save, \'n\' = skip, \'q\' = quit')
  const stories = await getMedia(username)
  showMedia(0, (stories.length - 1), stories)
}

search('alice')

// TODO: export default search
