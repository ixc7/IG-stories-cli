import https from 'https'
// import { spawnSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import readline from 'readline'
import Progress from 'progress'
import open from 'open'
import showMedia from './showMedia.js'

const fileName = path.resolve(path.resolve(), 'myVideo.mp4')
const destination = fs.createWriteStream(fileName)

// TODO: nest entire function inside search() for loop.
//       there has to be a cleaner way to do this lol.

// request file

const req = https.request({
  host: 'file-examples-com.github.io',
  path: 'uploads/2017/04/file_example_MP4_640_3MG.mp4'
})

// exit on 's' or 'ctrl-c'

const msg = {
  cancel: '\ndownload cancelled',
  sigint: '\ndownload interrupted'
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.input.on('keypress', function (str, key) {
  if (str === 's') {
    console.log(msg.cancel)
    fs.rmSync(fileName)
    process.exit(1)
  }
})

rl.on('SIGINT', () => {
  console.log(msg.sigint)
  fs.rmSync(fileName)
  process.exit(1)
})

// show progress bar
// write + open + delete file

req.on('response', async function (res) {
  const bar = new Progress('[:bar] :rate/bps :percent :etas', {
    complete: '#',
    incomplete: '_',
    width: Math.floor(process.stdout.columns / 3),
    total: parseInt(res.headers['content-length'], 10)
  })

  res.pipe(destination)

  res.on('data', function (chunk) {
    bar.tick(chunk.length)
  })

  res.on('end', async function () {
    console.log('download complete')
    msg.cancel = msg.sigint = ''
    readline.cursorTo(process.stdout, 0, 4)

    // TODO: WHY IS THIS FREEZING???????!!!!!!!!!
    process.stdout.write(showMedia(fileName).stdout)

    /*
    // process.stdout.write(
      // spawnSync('timg', [
        // `-g ${process.stdout.columns}x${process.stdout.rows - 2}`,
        // '--compress',
        // fileName
      // ]).stdout
    // )
    */

    await open(fileName, { wait: true })
    fs.rmSync(fileName)
    process.exit(0)
  })
})

// TODO.
// process.on('beforeExit', (code) => { tput reset ... })

console.log(`download starting
press 's' to cancel`)
req.end()
