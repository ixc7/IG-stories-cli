/* eslint-disable */
import https from 'https'
import path from 'path'
import fs from 'fs'
import child_process from 'child_process'
import { getSetDir, upsertDir } from './directories.js'
import { getSetKey } from './keys.js'
import keyboard from './keyboard.js'
import utils from './utils.js'

const { stdout } = process
const { rows, columns } = stdout
const { spawn } = child_process

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
  utils.centerText(columns, 0, `searching for '${username}'`)
  keyboard.listen()
  keyboard.sigintListener()

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
    process.exit(0)
  }

  utils.centerText(columns, 0, `loading preview ${opts.int + 1} of ${opts.max} in ${destination}`)
  keyboard.reload()
  keyboard.sigintListener()

  const current = opts.data[opts.int]
  const fileName = utils.makeName(opts.username, current.type)
  // const filePath = path.resolve(path.resolve(), fileName)
  const filePath = `${destination}/${fileName}`
  // const filePath = path.resolve(`${opts.destinataion}`, `${fileName}`)
  const stream = fs.createWriteStream(filePath)
  const req = https.request(current.url)

  req.on('response', (res) => {
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
  utils.centerText(columns, 0, 'y: keep, n: skip, q: quit')
  keyboard.reload()
  keyboard.sigintListener()

  const rendered = spawn(
    path.resolve(path.resolve(), '../vendor/timg'),
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
      fs.rm(filePath, () => {})
      rendered.kill()
    }
  })

  rendered.on('close', () => {
    function getNext () {
      getOne(destination, {
        username: opts.username,
        data: opts.data,
        int: opts.int + 1,
        max: opts.max,
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
          fs.rm(destination, () => {})
          getNext()
        }
      })
    }
  })
}

// ----
async function init (username = 'alice') {
  const apiKey = await getSetKey()
  const destination = await getSetDir({ username })
  upsertDir(destination)
  getAll(username, apiKey, destination)
}

init()
export default init
