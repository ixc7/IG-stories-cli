import { spawn } from 'child_process'
// import readline from 'readline'
import display from '../actions/display.js'
  
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
  console.log('done, press any key to exit')
})

process.on('message', (m) => {
  display.term.reset()
  console.log('render exiting on keypress')
  process.exit(0)
})
