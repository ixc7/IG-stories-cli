/* eslint-disable */
import path from 'path'
import readline from 'readline'
import { spawn } from 'child_process'
import axios from 'axios'
import https from 'https'

import { getSetKey } from './keys.js'
import { __dirname, clearScrollBack } from './utils.js'

// utils

const { stdout, stdin } = process
const { rows, columns } = stdout

function goto (x = stdout.columns, y = 0) {
  clearScrollBack()
  readline.cursorTo(process.stdout, x, y)
}

function centerText (x = stdout.columns, y = 0, msg = '') {
  goto(Math.floor((x / 2) - (msg.length / 2)), y)
  stdin.write(`${msg}\n`)
}


// https

async function getMedia (username = 'alice') {



  const options = {
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
  }
  
  const fetched = await axios.request(options)

  // ...



q



  
  //
  if (fetched?.data[0]?.story?.data && fetched.data[0].story.data.length) {
    const files = fetched.data[0].story.data.map(function (item) {
      if (item.media_type === 1) {
        return {
          url: item.image_versions2.candidates[0].url,
          type: 'jpg',
          display: 'image'
        }
      } else if (item.media_type === 2) {
        return {
          url: item.video_versions[0].url,
          type: 'mp4',
          display: 'video'
        }
      }
      return {}
    })
    return files
  }
  centerText(columns, 0, 'nothing found')
  process.exit(0)
  //




  
}

// timg

function showMedia (int = 0, max = 1, data = []) {
  if (int === max) {
    console.log('done')
    process.exit(0)
  }

  centerText(columns, 0, `preview ${int + 1} of ${max}`)
  readline.emitKeypressEvents(stdin)
  stdin.setRawMode(true)

  let gotKeypress = false

  const preview = spawn(
    path.resolve(__dirname, '../vendor/timg'),
    [
      `-g ${columns}x${rows - 4}`,
      '--center',
      data[int].url,
      data[int].type === 'jpg' ? '-w 5' : ''
    ]
  )

  preview.stdout.pipe(stdout)

  preview.on('close', async () => {
    stdin.removeAllListeners('keypress')
    if (gotKeypress === true) {
      goto(0, 0)
      showMedia((int + 1), max, data)
    } else {
      stdin.on('keypress', function (str) {
        const actions = {
          y: () => showMedia((int + 1), max, data),
          n: () => showMedia((int + 1), max, data),
          q: () => process.kill(process.pid, 'SIGINT')
        }
        if (actions.hasOwnProperty(str)) {
          goto(0, 0)
          stdin.removeAllListeners('keypress')
          actions[str]()
        }
      })
    }
  })

  // TODO: preview.kill(preview.pid, <signal>)
  //       https://man7.org/linux/man-pages/man7/signal.7.html
  //       SIGUSR1, SIGUSR2: User-defined signals

  stdin.on('keypress', (str) => {
    const actions = {
      y: () => preview.kill(),
      n: () => preview.kill(),
      q: () => process.kill(process.pid, 'SIGINT')
    }
    gotKeypress = true
    /* eslint-disable-next-line no-prototype-builtins */
    if (actions.hasOwnProperty(str)) actions[str]()
  })
}

// process 

process.on('SIGINT', () => {
  const cleanup = spawn('tput', ['reset'])
  cleanup.stdout.pipe(stdout)
  cleanup.on('close', () => {
    console.log('exit')
    process.exit(0)
  })
})

// init

async function search (username = 'mary') {
  centerText(columns, 0, '\'y\' = save, \'n\' = skip, \'q\' = quit')
  const stories = await getMedia(username)
  showMedia(0, (stories.length - 1), stories)
}

search('yesturdae')

// TODO: export default search
