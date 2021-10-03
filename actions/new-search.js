import child_process from 'child_process'
import https from 'https'
import path from 'path'
import readline from 'readline'
import Progress from 'progress'
import { getSetKey } from './keys.js'
import { clearScrollBack } from './utils.js'

const { stdout, stdin } = process
const { rows, columns } = stdout
const { spawn } = child_process

function goto (x = stdout.columns, y = 0) {
  clearScrollBack()
  readline.cursorTo(process.stdout, x, y)
}

function centerText (x = stdout.columns, y = 0, msg = '') {
  goto(Math.floor((x / 2) - (msg.length / 2)), y)
  stdin.write(`${msg}\n`)
}

async function getMedia (username = 'alice') {
  centerText(columns, 0, '\'y\' = save, \'n\' = skip, \'q\' = quit')

  const query = new URL('/clients/api/ig/ig_profile', 'https://instagram-bulk-profile-scrapper.p.rapidapi.com')
  query.searchParams.set('ig', username)
  query.searchParams.set('response_type', 'story')

  const req = https.request(query.href)
  req.setHeader('x-rapidapi-host', 'instagram-bulk-profile-scrapper.p.rapidapi.com')
  req.setHeader('x-rapidapi-key', await getSetKey())

  req.on('response', (res) => {
    let myData = ''

    const bar = new Progress('[:bar] :rate/bps :percent :etas', {
      complete: '#',
      incomplete: '_',
      width: Math.floor(process.stdout.columns / 3),
      total: parseInt(res.headers['content-length'], 10)
    })

    res.on('data', (chunk) => {
      myData += chunk.toString('utf8')
      bar.tick(chunk.length)
    })

    res.on('end', () => {
      const fetched = JSON.parse(myData, 0, 2)
      if (fetched[0]?.story?.data && fetched[0].story.data.length) {
        const files = fetched[0].story.data.map(function (item) {
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
        })
        showMedia(0, (files.length), files)
      } else {
        centerText(columns, 0, 'nothing found')
        process.exit(0)
      }
    })
  })

  req.end()
}

function showMedia (int = 0, max = 1, data = []) {
  if (int === max) {
    console.log('done')
    process.exit(0)
  }

  let gotKeypress = false

  centerText(columns, 0, `preview ${int + 1} of ${max}`)
  readline.emitKeypressEvents(stdin)
  stdin.setRawMode(true)

  // TODO: profile picture, (posts...)

  const preview = spawn(
    path.resolve(path.resolve(), '../vendor/timg'),
    [
      `-g ${columns}x${rows - 4}`,
      '--center',
      data[int].url,
      data[int].type === 'jpg' ? '-w 5' : ''
    ]
  )

  preview.on('close', () => {
    stdin.removeAllListeners('keypress')
    if (gotKeypress === true) {
      goto(0, 0)
      showMedia((int + 1), max, data)
    } else {
      stdin.on('keypress', (str) => {
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

  preview.stdout.pipe(stdout)

  // TODO: preview.kill(preview.pid, <SIGUSR1, SIGUSR2, SIGSTOP> ?
  //       https://man7.org/linux/man-pages/man7/signal.7.html

  stdin.on('keypress', (str) => {
    gotKeypress = true

    const actions = {
      y: () => preview.kill(),
      n: () => preview.kill(),
      q: () => process.kill(process.pid, 'SIGINT')
    }

    if (actions.hasOwnProperty(str)) actions[str]()
  })
}

process.on('SIGINT', () => {
  const cleanup = spawn('tput', ['reset'])

  cleanup.on('close', () => {
    console.log('exit')
    process.exit(0)
  })

  cleanup.stdout.pipe(stdout)
})

// init
getMedia('alice')
//

export default getMedia
