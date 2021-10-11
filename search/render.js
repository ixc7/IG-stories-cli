import { spawn } from 'child_process'
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
  console.log('press any key to continue')
})

process.on('message', (m) => {
  display.term.reset()
  process.exit(0)
})
