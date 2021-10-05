import fs from 'fs'
import readline from 'readline'
import Progress from 'progress'

const { stdin, stdout } = process

// read config file
function config () {
  return JSON.parse(
    fs.readFileSync(new URL('../config.json', import.meta.url).pathname, {
      encoding: 'utf-8'
    })
  )
}

// display text in center of row
function centerText (x = stdout.columns, y = 0, msg = '', clear = true) {
  if (clear) {
    process.stdout.write('\u001b[3J\u001b[1J')
    console.clear()
  }
  readline.cursorTo(stdout, Math.floor((x / 2) - (msg.length / 2)), y)
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
    complete: '\u001b[102m \u001b[0m',
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
  centerText,
  makeName,
  progress
}
