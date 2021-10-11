import { fork } from 'child_process'
import download from './download.js'
import { getSetKey } from '../actions/keys.js'
import { whichDir, upsertDir } from '../actions/directories.js'
import display from '../actions/display.js'
import readline from 'readline'

const index = parseInt(process.argv[2])
const env = JSON.parse(process.argv[3])
const data = env.data
const destination = env.destination

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
  
console.log(`downloading ${index + 1} of ${data.length}`)

download('alice', data[index], destination)
.then((file) => {
  console.log('rendering')

  const render = fork(
    new URL('./render.js', import.meta.url).pathname,
    [file]
  )

  process.stdin.on('keypress', (k) => { 
    render.send(k)
  })

  render.on('close', () => {
    if(index === data.length - 1) {
      process.send({ next: 'EXIT' })
      process.exit(0)
    } else {
      process.send({ next: parseInt(index + 1)})
      process.exit(0)
    }
  })
  
})


// q listener - abort search/download, kill render, exit
// n listener - abort download/rm file, kill render/rm file, continue
// y listener - kill render, continue
// done, exit

// TODO: try {} catch (e) {}
//       const data = await search('username', await getSetKey())
//       console.log(data)

// TODO: fork from main menu, wait for exit, return to menu prompt
