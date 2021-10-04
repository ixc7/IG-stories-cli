import fs from 'fs'
import readline from 'readline'
import path from 'path'
import axios from 'axios'
import Progress from 'progress'

const { stdin, stdout } = process

// no scroll history
function clearScrollBack () {
  process.stdout.write('\u001b[3J\u001b[1J')
  console.clear()
}

// random string
function randomStr (input = '') {
  const prefix = `${input.split(' ')[0]}_` || ''
  const date = (new Date()).toDateString().toLowerCase().replace(/\s/g, '_')
  const str = (Math.random() + 1)
    .toString(36)
    .substring(2)
  return `${prefix}${str}_${date}`
}


// read config file
// TODO: just import it.
function config () {
  return JSON.parse(
    // fs.readFileSync(path.resolve(path.resolve(), '../config.json'), {
    fs.readFileSync(path.resolve(path.resolve(), 'config.json'), {
      encoding: 'utf-8'
    })
  )
}

// download from url
async function download (url, extension, directory) {
  const baseName = path.basename(url)
  const fileName = `${baseName
    .substring(0, 10)
    .replace(/\./g, ' ')}.${extension}`
  const filePath = path.resolve(directory, fileName)
  const response = await axios({
    method: 'GET',
    url,
    responseType: 'stream'
  })
  return response.data.pipe(fs.createWriteStream(filePath))
}

// download from array of urls
async function downloadAll (
  urls,
  destination,
  options = {
    console: false
  }
) {
  urls.forEach(async function (item, index) {
    if (options.console) {
      console.log(`downloading item ${index + 1} of ${urls.length}`)
    }
    await download(item.url, item.type, destination)
  })
  console.log('download complete')
}

// move cursor to position
function goto (x = stdout.columns, y = 0, clear = true) {
  if (clear) clearScrollBack()
  readline.cursorTo(process.stdout, x, y)
}

// display text in center of row
function centerText (x = stdout.columns, y = 0, msg = '', clear = true) {
  goto(Math.floor((x / 2) - (msg.length / 2)), y, clear)
  stdin.write(`${msg}\n`)
}

// generate filename
function makeName (prefix = 'filename', extension = 'txt') {
  const date = (new Date()).toDateString().toLowerCase().replace(/\s/g, '_')
  const str = (Math.random() + 1).toString(36).substring(2)
  return `${prefix}_${date}_${str}.${extension}`
}

// centered progress bar
function progress (response) {
  const total = parseInt(response.headers['content-length'], 10)
  const spacing = ' '.repeat(Math.floor(stdout.columns / 4))
  if (isNaN(total)) return false
  const bar = new Progress(`${spacing}[:bar]`, {
    complete: '\u001b[41m \u001b[0m',
    incomplete: '_',
    width: Math.floor(stdout.columns / 2),
    total
  })
  response.on('data', function (chunk) {
    bar.tick(chunk.length)
  })
}

export default {
  config,
  clearScrollBack,
  randomStr,
  download,
  downloadAll,
  goto,
  centerText,
  makeName,
  progress
}
