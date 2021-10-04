/* eslint-disable */
import https from 'https'
import readline from 'readline'
import fs from 'fs'
import { spawn } from 'child_process'
import { getSetDir, upsertDir } from './directories.js'
import keyboard from './keyboard.js'
import utils from './utils.js'

const { stdout } = process
const { rows, columns } = stdout

// ----
process.on('SIGINT', () => {
  const cleanup = spawn('tput', ['reset'])
  cleanup.stdout.pipe(stdout)
  cleanup.on('close', () => {
    utils.centerText(columns, 0, 'sigint')
    process.exit(0)
  })
})

// ----
function getOne (destination, username) {
  utils.centerText(columns, 0, `downloading file`)
  keyboard.reload()
  keyboard.sigintListener()

  const fileName = utils.makeName(username, 'mp4')
  const filePath = new URL(`${destination}/${fileName}`, import.meta.url).pathname
  const fileStream = fs.createWriteStream(filePath)
  const req = https.request('https://jsoncompare.org/LearningContainer/SampleFiles/Video/MP4/Sample-MP4-Video-File-for-Testing.mp4')

  req.on('response', (res) => {
    utils.progress(res)
    res.pipe(fileStream)
    res.on('end', () => {
      showOne(destination, filePath)
    })
  })
  req.end()
}

// ----
function showOne (destination, filePath) {
  utils.centerText(columns, 0, 'y/n/q')
  keyboard.reload()
  keyboard.sigintListener()

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
      fs.rm(filePath, () => { rendered.kill() })
    }
  })

  rendered.on('close', () => {
    console.log('hurry up and pick something')
    function getNext () {
      // getOne(destination, 'some-other-cool-name')
      console.log('AAAAAAAHHHHHHHHHHH')
      process.exit(0)
    }

    if (signal === 'skip' || signal === 'save') {
      getNext()
    } else {
      keyboard.reload()
      keyboard.sigintListener()
      keyboard.keyListener({
        y: () => getNext(),
        n: () => {
          fs.rm(filePath, () => { getNext() })
        }
      })
    }
  })
}

// ----
async function init (username = 'some-cool-name') {

  const useInquirerWithoutKillingReadline = async () => { 
    const dir = await getSetDir({ username, set: true })
    readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    upsertDir(dir)
    return dir
  }

  const downloadsDir = await useInquirerWithoutKillingReadline()
  getOne(downloadsDir, username)

}

init()
