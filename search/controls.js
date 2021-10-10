import readline from 'readline'
import { fork } from 'child_process'
import search from './search.js'
import download from './download.js'
// import render from './render.js'
import { getSetKey } from '../actions/keys.js'
import { whichDir, upsertDir } from '../actions/directories.js'

// TODO: move
const getDestination = async (username) => {
  const dir = await whichDir({ username })
  upsertDir(dir)
  // prevent inquirer from fing it up
  readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return dir
}

// TODO: try {} catch (e) {}
const init = async () => {
  console.log('searching')
  
  search('alice', await getSetKey())
  .then(async (data) => {
    console.log(data)
    console.log('downloading')
    
    download('alice', data[3], await getDestination('alice'))
    .then((file) => {
      console.log('rendering')

      const render = fork(
        new URL('./render.js', import.meta.url).pathname,
        [file]
      )

      readline.emitKeypressEvents(process.stdin)
      process.stdin.setRawMode(true)

      process.stdin.on('keypress', () => {
        render.send('kill')
        setTimeout(() => {
          console.log('exit main')
          process.exit(0)
        }, 2000)
      })

    })
  })  
  .catch((err) => console.log(err))
}

init()
