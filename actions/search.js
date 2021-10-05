/* eslint-disable */
import readline from 'readline'
import https from 'https'
import path from 'path'
import fs from 'fs'
import { spawn } from 'child_process'
import { getSetDir, upsertDir } from './directories.js'
import { getSetKey } from './keys.js'
import keyboard from './keyboard.js'
import cursor from './cursor.js'
import utils from './utils.js'

const { stdout } = process
const { rows, columns } = stdout

// ----
process.on('SIGINT', () => {
  const cleanup = spawn('tput', ['reset'])
  cleanup.stdout.pipe(stdout)
  cleanup.on('close', () => {
    utils.centerText(columns, 0, 'exit')
    process.exit(0)
  })
})

// ----
function getAll (username, apiKey, destination) {
  cursor.hide()
  keyboard.listen()
  keyboard.sigintListener()
  utils.centerText(columns, 0, `searching for '${username}'`)

  const query = new URL('/clients/api/ig/ig_profile', 'https://instagram-bulk-profile-scrapper.p.rapidapi.com')
  query.searchParams.set('ig', username)
  query.searchParams.set('response_type', 'story')

  const req = https.request(query.href)
  req.setHeader('x-rapidapi-host', 'instagram-bulk-profile-scrapper.p.rapidapi.com')
  req.setHeader('x-rapidapi-key', apiKey)

  req.on('response', function (res) {
    let dataStr = ''

    res.on('data', function (chunk) {
      dataStr += chunk.toString('utf8')
    })
    utils.progress(res)

    res.on('end', function () {
      const dataObj = JSON.parse(dataStr, 0, 2)

      if (dataObj[0]?.story?.data?.length) {
        const filesList = dataObj[0].story.data.map(function (item) {
          let itemInfo = {}

          if (item.media_type === 1) {
            itemInfo = {
              url: item.image_versions2.candidates[0].url,
              type: 'jpg',
              display: 'image'
            }
          } else if (item.media_type === 2) {
            itemInfo = {
              url: item.video_versions[0].url,
              type: 'mp4',
              display: 'video'
            }
          }
          return itemInfo
        })

        getOne(destination, {
          username,
          data: filesList,
          int: 0,
          max: filesList.length,
        })
      } else {
        utils.centerText(columns, 0, 'nothing found')
        cursor.show()
        process.exit(0)
      }
    })
  })
  req.end()
}

// ----
function getOne (destination, opts) {
  if (opts.int === opts.max) {
    utils.centerText(columns, 0, 'done')
    cursor.show()
    process.exit(0)
  }

  cursor.hide()
  keyboard.reload()
  keyboard.sigintListener()
  utils.centerText(columns, 0, `loading preview ${opts.int + 1} of ${opts.max}`)

  const current = opts.data[opts.int]
  const fileName = utils.makeName(opts.username, current.type)
  const filePath = new URL(`${destination}/${fileName}`, import.meta.url).pathname
  const stream = fs.createWriteStream(filePath)
  const req = https.request(current.url)

  req.on('response', (res) => {
    stdout.write('\n')
    utils.progress(res)
    res.pipe(stream)
    res.on('end', () => {
      showOne(destination, filePath, opts)
    })
  })
  req.end()
}

// ----
function showOne (destination, filePath, opts) {
  cursor.hide()
  keyboard.reload()
  keyboard.sigintListener()
  utils.centerText(columns, 0, 'y: keep, n: skip, q: quit')

  const rendered = spawn(
    new URL('../vendor/timg', import.meta.url).pathname,
    [
      `-g ${columns}x${rows - 4}`,
      '--center',
      filePath
    ]
  )
  rendered.stdout.pipe(stdout)

  let signal = ''
  keyboard.keyListener({
    y: () => {
      signal = 'save'
      rendered.kill()
    },
    n: () => {
      signal = 'skip'
      fs.rmSync(filePath)
      rendered.kill()
    }
  })

  rendered.on('close', () => {
    cursor.hide()
    function getNext () {
      getOne(destination, {
        ...opts,
        int: opts.int + 1
      })
    }
    if (signal === 'skip' || signal === 'save') {
      getNext()
    } else {
      keyboard.reload()
      keyboard.sigintListener()
      keyboard.keyListener({
        y: () => getNext(),
        n: () => {
          fs.rmSync(filePath)
          getNext()
        }
      })
    }
  })
}

// ----
async function init (username = ' ') {
  const apiKey = await getSetKey()

  const getDestination = async () => { 
    const dir = await getSetDir({ username })
    upsertDir(dir)
    readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    return dir
  }
  
  const destination = await getDestination()
  getAll(username, apiKey, destination)
  
}

export default init
