/* eslint-disable */
import https from 'https'
import path from 'path'
import fs from 'fs'
import readline from 'readline'
import child_process from 'child_process'
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

function makeName (prefix = 'filename', extension = 'txt') {
  const date = (new Date()).toDateString().toLowerCase().replace(/\s/g, '_')
  const str = (Math.random() + 1).toString(36).substring(2)
  return `${prefix}_${date}_${str}.${extension}`
}

////////////////////////////////





////////////////////////////////


// ----
const defaultOpts = {
  username:'username',
  data: [],
  int: 0,
  max: 1
}


// ----
function getAll (username = 'username', apiKey = '') {

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

    res.on('end', function () {
    
      const dataObj = JSON.parse(dataStr, 0, 2)
      
      if (dataObj[0]?.story?.data && dataObj[0].story.data.length) {

        const filesList = dataObj[0].story.data.map(function (item) {
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

        const options = {
          username,
          data: filesList,
          int: 0,
          max: filesList.length
        }
        
        getOne(options)
        // now call this recursively -> getOne ... showOne ... A/B loop
        // already know we can recursively call https requests on themselves
        

      } else {
        console.log('no results')
        process.exit(0)
      }
    })
  })

  req.end()
}


// ----
function getOne (opts = defaultOpts) {
  console.log('getOne init')
  
  if (opts.int === opts.max) {
    console.log('done')
    process.exit(0)
  }
  
  const current = opts.data[opts.int]
  const fileName = makeName(current.username, current.type)
  const filePath = path.resolve(path.resolve(), fileName)
  const stream = fs.createWriteStream(filePath)
  const req = https.request(current.url)
  
  stdin.removeAllListeners('keypress')

  req.on('response', (res) => {
    res.pipe(stream)
    
    res.on('end', () => {
      console.log('getOne on end')
      
      readline.emitKeypressEvents(stdin)
      stdin.setRawMode(true)
      
      stdin.on('keypress', function (str) {
        console.log('keypress calls showOne')

        showOne(filePath, {
          username: opts.username,
          data: opts.data,
          int: opts.int,
          max: opts.max
        })
      })
    })
  })
  req.end()
}


// ----
function showOne (location, opts = defaultOpts) {
  console.log('showOne init')

  stdin.removeAllListeners('keypress')

  const rendered = spawn(
    path.resolve(path.resolve(), '../vendor/timg'),
    [
      // `-g ${columns}x${rows - 4}`,
      `-g 50x25`,
      '--center',
      // opts.data[opts.int].url,
      location
      // ,
      // opts.data[opts.int].type === 'jpg' ? '-w 5' : ''
    ]
  )
  
  rendered.stdout.pipe(stdout)

  rendered.on('close', () => {
  
    console.log('showOne on close')
    readline.emitKeypressEvents(stdin)
    stdin.setRawMode(true)
    
    stdin.on('keypress', function (str) {
      console.log('keypress calls getOne')
      
      getOne({
        username: opts.username,
        data: opts.data,
        int: opts.int + 1,
        max: opts.max
      })
    })
    
  })

}


async function init (username = 'alice') {
  const apiKey = await getSetKey()
  getAll(username, apiKey)
}

init('yesturdae')


////////////////////////////////











////////////////////////////////


/*
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

  preview.stdout.pipe(stdout)
  
  // TODO: preview.kill(preview.pid, <SIGUSR1, SIGUSR2> ?
  //       https://man7.org/linux/man-pages/man7/signal.7.html

  stdin.on('keypress', (str) => {
    gotKeypress = true
    
    const actions = {
      y: () => preview.kill(),
      n: () => preview.kill(),
      q: () => process.kill(process.pid, 'SIGINT')
    }
    
    // eslint-disable-next-line no-prototype-builtins //
    if (actions.hasOwnProperty(str)) actions[str]()
  })
}
*/

////////////////////////////////

/*
process.on('SIGINT', () => {
  const cleanup = spawn('tput', ['reset'])
  
  cleanup.on('close', () => {
    console.log('exit')
    process.exit(0)
  })
  
  cleanup.stdout.pipe(stdout)
})
*/


