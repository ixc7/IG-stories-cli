import { spawn } from 'child_process'
// import readline from 'readline'
import display from '../actions/display.js'

// export default function render (file) {
// return new Promise((resolve, reject) => {


const timg = spawn(
  new URL('../vendor/timg', import.meta.url).pathname,
  [
    `-g ${process.stdout.columns}x${process.stdout.rows - 4}`,
    '--center',
    process.argv[2]
  ]
)

timg.stdout.pipe(process.stdout)

timg.on('close', () => {
  console.log('child render done, press any key to exit')
  // readline.cursorTo(0, process.stdout.rows, process.stdout)
  // process.stdout.write('child render done, press any key to exit')
})

process.on('message', (m) => {
  display.term.reset()
  console.log('child render closing on keypress')
  process.exit(0)
  // resolve(true)
})



// )}
// }
