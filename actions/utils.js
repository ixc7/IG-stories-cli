import fs from 'fs'
import path from 'path'
import axios from 'axios'
import inquirer from 'inquirer'

// __dirname polyfill
const __dirname = path.dirname(new URL(import.meta.url).pathname)

// clear ENTIRE scrollback
function clearScrollBack () {
  process.stdout.write('\u001b[3J\u001b[1J')
  console.clear()
}

// get config file
function config () {
  return JSON.parse(
    fs.readFileSync('config.json', {
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

/* INQUIRER METHODS  */

async function repeatPrompt (message = ' ') {
  return (
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'repeat',
        message
      }
    ])
  ).repeat
}

async function checkRepeat (
  prompt,
  callback = async function () {},
  message = 'do more?'
) {
  if (await repeatPrompt(message)) {
    await prompt()
  } else {
    await callback()
  }
}

async function checkConfirm (message = 'proceed?') {
  return (
    await inquirer.prompt([
      {
        type: 'confirm',
        name: 'checkConfirm',
        message
      }
    ])
  ).checkConfirm
}

export {
  config,
  __dirname,
  clearScrollBack,
  download,
  downloadAll,
  checkRepeat,
  checkConfirm
}
