// import { spawn, exec } from 'child_process'
import { spawn, spawnSync } from 'child_process'
import { clearScrollBack } from './utils.js'
import readline from 'readline'

// https://stackoverflow.com/questions/22337446/how-to-wait-for-a-child-process-to-finish-in-node-js

clearScrollBack()
const rows = process.stdout.rows
const cols = process.stdout.columns

// const child = exec('timg file_example_MP4_640_3MG.mp4 -g100x100 -V --loops=-1')
const child = spawn(
  'timg',
  [
    `-g${cols}x${rows - 1}`,
    '--loops=-1',
    'file_example_MP4_640_3MG.mp4'
  ]
)

// child.stdout.removeAllListeners('data')
// readline.emitKeyPressEvents(true)
child.stdout.pipe(process.stdout)


// const rl = readline.createInterface({
  // input: process.stdin,
  // output: process.stdout
// })

// rl.input.on('keypress', function (str, key) {
  // if (str === 's') {
    // child.kill()
    // spawn('tput', ['reset'])
    // process.exit(0)
  // }
// })

process.on('SIGINT', () => {
  child.kill()
  spawnSync('tput', ['reset'])
  process.exit(0)
})
